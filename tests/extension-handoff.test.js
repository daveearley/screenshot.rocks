const assert = require('assert');
const vm = require('vm');
const handler = require('../api/setImage');
const image = 'data:image/png;base64,aGVsbG8=';

async function request(body, method = 'POST') {
    const response = {statusCode: 200, headers: {}, setHeader(k, v) {this.headers[k] = v;}, end(value) {this.body = value;}};
    await handler({body, method}, response);
    return response;
}
(async () => {
    for (const body of [{image}, new URLSearchParams({image}).toString()]) {
        const response = await request(body);
        assert.equal(response.statusCode, 200);
        let stored, destination;
        vm.runInNewContext(response.body.match(/<script>([\s\S]*?)<\/script>/)[1], {
            sessionStorage: {setItem(key, value) {stored = {key, value};}},
            window: {location: {replace(url) {destination = url;}}}
        });
        assert.deepEqual(stored, {key: 'imageFromPost', value: image});
        assert.equal(destination, '/app?utm_source=extension');
    }
    for (const body of [undefined, {}, {image: 'null'}, {image: "</script><script>alert(1)</script>"}]) {
        assert.equal((await request(body)).statusCode, 400);
    }
    assert.equal((await request({}, 'GET')).statusCode, 405);
    const response = await request({image});
    const elements = [];
    const status = {};
    vm.runInNewContext(response.body.match(/<script>([\s\S]*?)<\/script>/)[1], {
        sessionStorage: {setItem() {throw new Error('Quota exceeded');}},
        document: {getElementById() {return status;}, createElement() {return {};}, body: {appendChild(el) {elements.push(el);}}}
    });
    assert.equal(elements[0].href, image);
    assert.equal(elements[1].href, '/app?utm_source=extension');
    assert(status.textContent.includes('Save it below'));
    console.log('Extension POST contract, validation, same-origin redirect and storage fallback passed.');
})().catch(error => {console.error(error); process.exitCode = 1;});
