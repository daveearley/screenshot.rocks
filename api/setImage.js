module.exports = async (req, res) => {
    const {body} = req
    res.end(`
<html>
<head>
<title>Redirecting...</title>
<script>
    localStorage.setItem('imageFromPost', '${body.image}');
    window.location.href = 'https://screenshot.rocks?utm_source=chrome-extension';
</script>
</head>
<body>
Redirecting...
</body>
</html>
`)
}