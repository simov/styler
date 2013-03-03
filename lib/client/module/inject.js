require.register('inject', function (module, exports, require) {



exports.style = function (string) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = string;
    document.head.appendChild(style);
}

exports.script = function (string) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.innerHTML = string;
    document.head.appendChild(script);
}

exports.css = function (path) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.extension.getURL(path);
    document.head.appendChild(link);
}

exports.js = function (path) {
    var script = document.createElement('script');
    script.charset = 'utf-8';
    script.type = 'text/javascript';
    script.src = chrome.extension.getURL(path);
    document.head.appendChild(script);
}



});
