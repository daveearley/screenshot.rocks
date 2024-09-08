// Establish a connection with the background script
const port = chrome.runtime.connect({name: "screenshot"});

// Inform the background script that the content script is ready
port.postMessage({ready: true});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.url && message.data) {
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
});
