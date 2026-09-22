import urllib.request, re
url = 'https://booking-flow-production-c.squarecdn.com/assets/indexStreamingBody-CTRoZxds.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
content = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
matches = [m.start() for m in re.finditer(r'function\s+qo', content)]
print('function qo:', matches)
for m in re.finditer(r'[A-Za-z0-9_$]+\s*=\s*\([^)]*\)\s*=>[^{]*qo', content):
    print('arrow to qo:', m.group(0))
for m in re.finditer(r'qo\s*=\s*', content):
    print('qo =:', content[m.start()-20:m.start()+100])
