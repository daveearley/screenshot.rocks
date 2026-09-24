// Serves the production build plus the real /api/setImage handler, mirroring the Vercel deployment.
const http = require('http');
const fs = require('fs');
const path = require('path');
const setImage = require('../api/setImage');

const root = path.join(__dirname, '../build');
const port = Number(process.env.PORT) || 5055;
const types = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
    '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};

if (!fs.existsSync(path.join(root, 'index.html'))) {
    console.error('No production build found. Run `yarn build` first.');
    process.exit(1);
}

http.createServer((req, res) => {
    const {pathname} = new URL(req.url, 'http://localhost');

    if (pathname === '/api/setImage') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            // Vercel parses application/x-www-form-urlencoded bodies into an object before calling the handler.
            req.body = req.headers['content-type'] === 'application/x-www-form-urlencoded'
                ? Object.fromEntries(new URLSearchParams(body))
                : body;
            setImage(req, res);
        });
        return;
    }

    let file = path.join(root, decodeURIComponent(pathname));
    if (file.startsWith(root) && fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        file = path.join(file, 'index.html'); // static content pages, e.g. /guides/
    }
    if (!file.startsWith(root) || !fs.existsSync(file)) {
        file = path.join(root, 'index.html'); // SPA fallback for /app
    }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`e2e server on http://127.0.0.1:${port}`));
