const endpoint = 'https://screenshot.rocks/api/setImage';
const pendingCaptures = new Map();

chrome.action.onClicked.addListener((activeTab) => {
    chrome.tabs.captureVisibleTab(activeTab.windowId, {format: 'png'}, (image) => {
        if (chrome.runtime.lastError || !image) {
            console.error('Screenshot capture failed:', chrome.runtime.lastError);
            chrome.action.setBadgeText({tabId: activeTab.id, text: '!'});
            chrome.action.setTitle({tabId: activeTab.id, title: 'Unable to capture this page. Try a regular website tab.'});
            return;
        }
        chrome.action.setBadgeText({tabId: activeTab.id, text: ''});
        chrome.tabs.create({url: chrome.runtime.getURL('post.html')}, (tab) => {
            if (chrome.runtime.lastError || !tab) return;
            pendingCaptures.set(tab.id, image);
        });
    });
});

// The transfer page asks when it is ready, avoiding a tabs.onUpdated listener race.
chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (message.type !== 'capture-ready' || sender.id !== chrome.runtime.id) return;
    const tabId = message.tabId;
    const image = pendingCaptures.get(tabId);
    if (!image) {
        respond({ready: false});
        return;
    }
    pendingCaptures.delete(tabId);
    respond({ready: true, url: endpoint, data: {image}});
});
chrome.tabs.onRemoved.addListener(tabId => pendingCaptures.delete(tabId));
