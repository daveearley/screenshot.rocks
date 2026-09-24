// Loaded by the CRA dev server only: serves the static pages from site/, which production builds write to build/.
const path = require('path');

const RENDER = require.resolve('../site/render');
const mightBeContent = pathname => pathname !== '/' && ['', '.html', '.css', '.xml', '.txt'].includes(path.extname(pathname));

// Re-required on every request so edits to site/, including the renderer itself, apply without a restart.
const renderSite = () => {
    delete require.cache[RENDER];
    return require(RENDER).renderSite();
};

module.exports = app => {
    app.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const {pathname} = new URL(req.url, 'http://localhost');
        if (!mightBeContent(pathname) || pathname.startsWith('/sockjs-node')) return next();
        let site;
        try {
            site = renderSite();
        } catch (error) {
            // A broken content page shouldn't take the app down with it.
            console.error(`Could not render the content pages: ${error.stack}`);
            return next();
        }
        if (!pathname.endsWith('/') && site.files[`${pathname}/`]) {
            res.statusCode = 301;
            res.setHeader('Location', `${pathname}/`);
            return res.end();
        }
        const file = site.files[pathname];
        if (!file) return next();
        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Cache-Control', 'no-store');
        res.end(req.method === 'HEAD' ? undefined : file.body);
    });
};
