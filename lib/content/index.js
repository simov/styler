
chrome.extension.sendMessage({message: 'onload'}, function (res) {
    switch (res.message) {
        case 'inject':
            inject.style(res.code.css);
            inject.script(res.code.js);
        break;
    }
});
