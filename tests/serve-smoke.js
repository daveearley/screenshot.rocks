// Local-only integration harness for the extension POST → sessionStorage → editor flow.
const http = require('http');
const fs = require('fs');
const path = require('path');
const setImage = require('../api/setImage');
http.createServer((req, res) => {
    if (req.url === '/extension-smoke') {
        const image = fs.readFileSync(path.join(__dirname, '../public/images/demo-image.png')).toString('base64');
        res.setHeader('Content-Type', 'text/html');
        return res.end(`<form method="post" action="/api/setImage"><input type="hidden" name="image" value="data:image/png;base64,${image}"><button>Open extension test screenshot</button></form>`);
    }
    if (req.url === '/api/setImage') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {req.body = body; setImage(req, res);});
        return;
    }
    const proxy = http.request({hostname: '127.0.0.1', port: 3000, path: req.url, method: req.method, headers: req.headers}, upstream => {
        res.writeHead(upstream.statusCode, upstream.headers);
        upstream.pipe(res);
    });
    proxy.on('error', () => {res.statusCode = 502; res.end('Start npm start first.');});
    req.pipe(proxy);
}).listen(3001, '127.0.0.1', () => console.log('Extension smoke test: http://localhost:3001/extension-smoke'));
