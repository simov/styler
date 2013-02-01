
var file = require('file'),
    Manifest = require('manifest').Manifest,
    create = require('create');


var sites = null;
chrome.management.getAll(function (info) {
    for (var i=0; i < info.length; i++) {
        if (info[i].name == 'Styler Sites') {
            sites = info[i];
            break;
        }
    }
});

function inject (host) {
    file.load('sites/manifest.json', function (err, string) {
        var manifest = new Manifest(string),
            result = manifest.getContentScripts(host);
        
        create.string(result.css, function (err, css) {
            if (err) return resInject({err: err});
            create.string(result.js, function (err, js) {
                if (err) return resInject({err: err});
                resInject({css: css, js: js});
            });
        });
    });
}

function server () {
    file.load('config/client.json', function (err, string) {
        if (err) return resServer({err: err});
        resServer(JSON.parse(string));
    });
}


function disable (cb) {
    chrome.management.setEnabled(sites.id, false, cb);
}
function enable (cb) {
    chrome.management.setEnabled(sites.id, true, cb);
}
function afterDisable () {
    // sendMessage({enabled: styler.enabled});
}
function afterEnable () {
    // sendMessage({enabled: styler.enabled});
    resRestart({restarted: true});
}
function sendMessage (message) {
    chrome.tabs.getSelected(null, function (tab) {
        chrome.tabs.sendMessage(tab.id, message, function (res) {
            // res
        });
    });
}
var resInject = null,
    resServer = null,
    resRestart = null;
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    // console.log(request);
    switch (true) {
        case request.inject: resInject = sendResponse; inject(request.host); break;
        case request.server: resServer = sendResponse; server(); break;
        case request.restart: resRestart = sendResponse; disable(); break;
    }
    return true;
});
chrome.management.onDisabled.addListener(function (extension) {
    if (extension.name == 'Styler Sites') {
        afterDisable();
        enable(afterEnable);
    }
});
