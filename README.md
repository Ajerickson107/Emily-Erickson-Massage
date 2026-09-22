# Emily Erickson Massage Therapy

Modern web application and booking platform for **Emily Erickson, Licensed Massage Therapist (LMT)** in Rio Rancho, New Mexico.

## Deploying to GitHub Pages

This project is pre-configured for GitHub Pages:

### Method 1: Automated GitHub Actions (Recommended)
1. Push this repository to GitHub (branch `main`).
2. On your repository page, click **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) will automatically build and publish your site whenever you push changes to `main`.

### Method 2: Manual Deploy / Build
```bash
npm install
npm run build
```
The output files in `dist/` are configured with relative asset paths (`base: './'`) and can be deployed to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, etc.).

## Local Development
```bash
npm install
npm run dev
```
Open `http://localhost:3000` to preview.
