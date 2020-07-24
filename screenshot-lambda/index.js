const chromium = require('chrome-aws-lambda');

const validURL = str => {
    let pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(str);
};

exports.handler = async (event, context, callback) => {
    let result = null;
    let browser = null;
    let isMobile = event.queryStringParameters.mobile || false

    if (!event.queryStringParameters.url || !validURL(event.queryStringParameters.url)) {
        return callback(null, {
            "statusCode": 400,
            "body": JSON.stringify({
                success: false,
                message: "No/Invalid URL"
            }),
            "headers": {
                'Content-Type': 'application/json',
            }
        });
    }

    try {
        browser = await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        let page = await browser.newPage();

        if (isMobile) {
            await page.setViewport({
                width: 375,
                height: 812,
                deviceScaleFactor: 3,
                isMobile: true,
                hasTouch: true,
                isLandscape: false,
            });
            await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')
        } else {
            await page.setViewport({
                height: 800,
                width: 1440,
                deviceScaleFactor: 2
            });
        }

        await page.goto(event.queryStringParameters.url);
        result = await page.screenshot({encoding: "base64"})
    } catch (error) {
        return callback(error);
    } finally {
        if (browser !== null) {
            await browser.close();
        }
    }

    return callback(null, {
        "statusCode": 200,
        "body": JSON.stringify({
            imageBase64: result
        }),
        "headers": {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
};

