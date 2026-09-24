/** Receive screenshots from existing browser extensions without changing their POST contract. */
module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.statusCode = 405;
        return res.end('Please capture a screenshot using the browser extension.');
    }

    const body = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : req.body;
    const image = body && body.image;
    if (typeof image !== 'string' || !/^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(image)) {
        res.statusCode = 400;
        return res.end('The screenshot could not be read. Please try capturing the tab again.');
    }

    const serialized = JSON.stringify(image).replace(/</g, '\\u003c');
    res.end(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Opening screenshot…</title></head>
<body><p id="status">Opening your screenshot…</p>
<script>
try {
    sessionStorage.setItem('imageFromPost', ${serialized});
    window.location.replace('/app?utm_source=extension');
} catch (error) {
    document.getElementById('status').textContent = 'Your browser could not transfer this screenshot. Save it below, then upload it in the editor.';
    const download = document.createElement('a');
    download.href = ${serialized};
    download.download = 'screenshot.png';
    download.textContent = 'Save screenshot';
    document.body.appendChild(download);
    const editor = document.createElement('a');
    editor.href = '/app?utm_source=extension';
    editor.textContent = ' Open editor';
    document.body.appendChild(editor);
}
</script></body></html>`);
};
