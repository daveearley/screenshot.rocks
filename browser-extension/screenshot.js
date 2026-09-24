const showError = () => {
    document.querySelector('.content p').textContent = 'Unable to open this screenshot. Return to your tab and click the extension again.';
};

chrome.tabs.getCurrent((tab) => {
    if (chrome.runtime.lastError || !tab) return showError();
    let attempts = 0;
    const requestCapture = () => {
        chrome.runtime.sendMessage({type: 'capture-ready', tabId: tab.id}, (message) => {
            if (chrome.runtime.lastError || !message || !message.ready) {
                if (++attempts < 20) return setTimeout(requestCapture, 250);
                return showError();
            }
            const form = document.createElement('form');
            form.method = 'post';
            form.action = message.url;
            form.enctype = 'application/x-www-form-urlencoded';
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'image';
            input.value = message.data.image;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        });
    };
    requestCapture();
});
