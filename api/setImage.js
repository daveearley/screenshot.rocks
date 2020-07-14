module.exports = async (req, res) => {
    const {body} = req
    res.end(`
<html>
<head>
<title>Redirecting...</title>
<script>
    localStorage.setItem('imageFromPost', '${body.image}');
    setTimeout(() => {
        window.location.href = 'https://screenshot.rocks?utm_source=extension';
    }, 1000)
    
</script>
</head>
<body>
Please wait...
</body>
</html>
`)
}