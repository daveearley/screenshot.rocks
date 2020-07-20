/**
 * Serverless function to take base64 encoded image from the post body and set it in local storage.
 */
module.exports = async (req, res) => {
    const {body} = req
    res.end(`
<html>
<head>
<title>Redirecting...</title>
<script>
    sessionStorage.setItem('imageFromPost', '${body.image || null}');
    window.location.href = 'https://screenshot.rocks/app?utm_source=extension';
</script>
<style>
    body {
        padding: 30px;
        text-align: center;
        font-size: 1.4em;;
    }
</style>
</head>
<body>
    Parsing screenshot...
</body>
</html>
`)
}