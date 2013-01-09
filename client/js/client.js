
var site = {
    'github': {
        css: ['monokai-theme-github-code-view-and-gist']
    }
}

function init () {
    var host = window.location.hostname,
        parts = host.split('.'),
        name = parts.length < 2 ? parts[0] : parts[parts.length-2];
    if (!site[name]) return;
    loadfiles(name, site[name].css, 'css');
    loadfiles(name, site[name].js, 'js');
}

function loadfiles (name, files, ext) {
    if (!files) return;
    for (var i=0; i < files.length; i++) {
        var path = 'sites/'.concat(name,'/',files[i],'.',ext);
        inject[ext](path);
    }
}

var inject = {
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


var server = {
    host: 'localhost',
    port: 3000
}

function connect () {
    // connect
    var ws = new WebSocket('ws://'.concat(server.host,':',server.port));

    // response
    ws.onmessage = function (e) {
        window.location.reload(true);
    };

    // errors
    ws.onerror = function (error) {
        console.log(error);
    };
}

init();
connect();
