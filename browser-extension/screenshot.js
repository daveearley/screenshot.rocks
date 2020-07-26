window.browser = (() => window.msBrowser || window.browser || window.chrome)();

const handler = (message) => {
    browser.runtime.onMessage.removeListener(handler);
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", message.url);
    form.setAttribute('enctype', 'application/x-www-form-urlencoded');

    for (const key in message.data) {
        const hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", message.data[key]);
        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
}

browser.runtime.onMessage.addListener(handler);
