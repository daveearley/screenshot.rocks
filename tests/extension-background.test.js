const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
let click, message, removed, captureArgs, created, badge;
const chrome = {
    runtime: {id: 'test-extension', getURL: path => `chrome-extension://test-extension/${path}`, onMessage: {addListener(fn) {message = fn;}}},
    action: {onClicked: {addListener(fn) {click = fn;}}, setBadgeText(value) {badge = value;}, setTitle() {}},
    tabs: {
        captureVisibleTab(windowId, options, callback) {captureArgs = {windowId, options}; callback(chrome.runtime.lastError ? undefined : 'data:image/png;base64,aGVsbG8=');},
        create(options, callback) {created = options; callback({id: 42});},
        onRemoved: {addListener(fn) {removed = fn;}}
    }
};
vm.runInNewContext(fs.readFileSync('browser-extension/background.js', 'utf8'), {chrome, console});
let reply;
message({type: 'capture-ready', tabId: 42}, {id: chrome.runtime.id}, result => reply = result);
assert.equal(reply.ready, false);
click({id: 9, windowId: 7});
assert.equal(captureArgs.windowId, 7);
assert.equal(captureArgs.options.format, 'png');
assert(created.url.endsWith('/post.html'));
message({type: 'capture-ready', tabId: 42}, {id: chrome.runtime.id}, result => reply = result);
assert.equal(reply.data.image, 'data:image/png;base64,aGVsbG8=');
assert.equal(reply.url, 'https://screenshot.rocks/api/setImage');
message({type: 'capture-ready', tabId: 42}, {id: chrome.runtime.id}, result => reply = result);
assert.equal(reply.ready, false);
chrome.runtime.lastError = {message: 'Restricted page'};
created = null;
click({id: 9, windowId: 7});
assert.equal(created, null);
assert.equal(badge.text, '!');
removed(42);
console.log('Extension readiness, single-use handoff, active window capture and failure recovery passed.');
