const endpoint = 'https://screenshot.rocks/api/setImage';

const postData = (url, data) => {
    chrome.tabs.create(
        { url: chrome.runtime.getURL("post.html") },
        (tab) => {
            const handler = (tabId, changeInfo) => {
                if (tabId === tab.id && changeInfo.status === "complete") {
                    chrome.tabs.onUpdated.removeListener(handler);
                    chrome.tabs.sendMessage(tabId, { url: url, data: data }).catch(error => {
                        console.error("Error sending message:", error);
                    });
                }
            };
            chrome.tabs.onUpdated.addListener(handler);
        }
    );
};

chrome.action.onClicked.addListener(() => {
    chrome.tabs.captureVisibleTab((screenshotUrl) => {
        postData(endpoint, { "image": screenshotUrl });
    });
});

// Listen for connections from the content script
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        if (msg.ready) {
            console.log("Content script is ready");
        }
    });
});
