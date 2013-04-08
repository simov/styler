
chrome.extension.onMessage.addListener(function (req, sender, sendResponse) {
    switch (true) {
        case req.inject:
            inject.style(req.code.css);
            inject.script(req.code.js);
        break;
    }
});
