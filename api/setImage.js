module.exports = async (req, res) => {
    const {body} = req
    res.end(`
<html>
<head>
<title>Redirecting...</title>
<script>
    localStorage.setItem('imageFromPost', '${body.image}');
    setTimeout(() => {
        window.location.href = 'https://screenshot-rocks-git-extension-prep.daveearley.vercel.app/?utm_source=extension';
    }, 500)
</script>
</head>
<body>
Redirecting...
</body>
</html>
`)
}