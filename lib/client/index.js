(function () {


var server = require('server');

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(request);
});

chrome.extension.sendMessage({inject: true, host: window.location.hostname}, function (res) {
    if (res.err) throw res.err;
    inject.style(res.css);

    chrome.extension.sendMessage({server: true}, function (res) {
        if (res.err) throw res.err;
        server.connect(res.host, res.port);
    });
});

var inject = {
    style: function (string) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = string;
        document.head.appendChild(style);
    },
    script: function (string) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.charset = 'utf-8';
        script.innerHTML = string;
        document.head.appendChild(script);
    },
    css: function (path) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.extension.getURL(path);
        document.head.appendChild(link);
    },
    js: function (path) {
        var script = document.createElement('script');
        script.charset = 'utf-8';
        script.type = 'text/javascript';
        script.src = chrome.extension.getURL(path);
        document.head.appendChild(script);
    }
}


}());
