import express, { Request, Response } from 'express';
import path from 'path';
import https from 'https';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// In-memory cache for the patched Square bundle
let cachedPatchedJs: { hash: string; content: string } | null = null;

function fetchFromSquare(
  targetUrl: string,
  reqHeaders: Record<string, any> = {}
): Promise<{ statusCode: number; headers: Record<string, any>; data: Buffer }> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(targetUrl);
    const headers: Record<string, any> = {
      ...reqHeaders,
      host: urlObj.host,
      origin: `https://${urlObj.host}`,
      referer: `https://${urlObj.host}/appointments/6jkiftssg2nhc1/location/L2N4AWWF3XG13`,
      'user-agent':
        reqHeaders['user-agent'] ||
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    delete headers['cookie']; // Square will initialize fresh buyer visitor cookies
    delete headers['accept-encoding']; // Let Square return uncompressed text/html for easy patching

    const req = https.request(
      urlObj,
      {
        method: 'GET',
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 200,
            headers: res.headers,
            data: Buffer.concat(chunks),
          });
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

// 1. Proxy the Square booking assets with iframe detection removed
app.get('/square-assets/indexStreamingBody-:hash.js', async (req: Request, res: Response) => {
  const { hash } = req.params;

  if (cachedPatchedJs && cachedPatchedJs.hash === hash) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cachedPatchedJs.content);
  }

  try {
    const sourceUrl = `https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-${hash}.js`;
    const result = await fetchFromSquare(sourceUrl);
    let js = result.data.toString('utf8');

    // Patch 1: Neutralize iframe detection (qo function)
    // Square's original: function qo(){try{return window.self!==window.top}catch{return!0}}
    const qoRegex = /function qo\(\)\{try\{return window\.self!==window\.top\}catch\{return!?0\}\}/;
    js = js.replace(qoRegex, 'function qo(){return false;}');

    // Patch 2: Neutralize H1 (breakout window.open function)
    // Original: const H1=e=>{const t=new URL(e,window.location.origin),n=t.searchParams,r=fs("_savt");r&&n.set("savt",r),window.open(t.toString(),"_blank")};
    // Patched: Instead of window.open("_blank"), redirect current frame or do nothing
    js = js.replace(
      /const H1=e=>\{const t=new URL\(e,window\.location\.origin\),n=t\.searchParams,r=fs\("_savt"\);r&&n\.set\("savt",r\),window\.open\(t\.toString\(\),"_blank"\)\};/,
      'const H1=e=>{const t=new URL(e,window.location.origin); window.location.href=t.toString();};'
    );

    cachedPatchedJs = { hash, content: js };

    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(js);
  } catch (err: any) {
    console.error('Error fetching/patching Square JS:', err);
    res.status(502).send('Error loading Square assets');
  }
});

// 2. Proxy the Square Appointments booking flow page
app.get('/appointments/6jkiftssg2nhc1/location/L2N4AWWF3XG13*', async (req: Request, res: Response) => {
  try {
    const targetUrl = 'https://book.squareup.com/appointments/6jkiftssg2nhc1/location/L2N4AWWF3XG13';
    const result = await fetchFromSquare(targetUrl, req.headers as any);
    let html = result.data.toString('utf8');

    // Route the script through our proxy endpoint
    html = html.replace(
      /https:\/\/booking-flow-production-c\.squarecdn\.com\/assets\/indexStreamingBody-([a-zA-Z0-9_\-]+)\.js/g,
      '/square-assets/indexStreamingBody-$1.js'
    );

    // Inject in-frame navigation guard to guarantee no links or buttons pop open a new tab
    const guardScript = `
    <script>
      (function() {
        // Intercept window.open calls to stay in current frame
        var _origOpen = window.open;
        window.open = function(url, target) {
          if (url && (target === '_blank' || target === '_top' || !target)) {
            window.location.href = url;
            return window;
          }
          return _origOpen.apply(this, arguments);
        };
      })();
    </script>
    `;
    html = html.replace('<head>', '<head>' + guardScript);

    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.send(html);
  } catch (err: any) {
    console.error('Error fetching Square appointment HTML:', err);
    res.status(502).send('Error connecting to Square Appointments');
  }
});

// 3. Proxy API requests for availability and booking
app.all('/appointments/api*', (req: Request, res: Response) => {
  const targetUrl = `https://book.squareup.com${req.originalUrl}`;
  const urlObj = new URL(targetUrl);

  const headers: Record<string, any> = {
    ...req.headers,
    host: urlObj.host,
    origin: `https://${urlObj.host}`,
    referer: `https://${urlObj.host}/appointments/6jkiftssg2nhc1/location/L2N4AWWF3XG13`,
  };

  const proxyReq = https.request(
    urlObj,
    {
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    console.error('Square API proxy error:', err);
    res.status(502).json({ error: 'Square API proxy error' });
  });

  req.pipe(proxyReq);
});

// 4. Vite middleware for development & static serving for production
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
