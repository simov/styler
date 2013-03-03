
var file = require('file'),
    Client = require('client'),
    settings = require('settings');


chrome.extension.onMessage.addListener(function (req, sender, sendResponse) {
    switch (true) {
        case req.inject: inject(req.host, req.path, sendResponse);
            break;
        case req.tab: addTab(req, sender, sendResponse);
            break;
    }
    return true;
});

chrome.tabs.onRemoved.addListener(function (id, info) {
    delete tabs[id];
});


var settingsData = {};
var client = new Client();

chrome.storage.sync.get(function (data) {
    settingsData = data;
    settings.sort(data);

    file.load('config/server.json', function (err, data) {
        if (err) throw err;
        var config = JSON.parse(data);
        client.connect(config, settingsData, function (e) {
            console.log(e.type, e);
        });
    });
});

client.on('change', function (host, path) {
    for (var id in tabs) {
        var tab = tabs[id];
        if (tab.host === host) {
            chrome.tabs.sendMessage(tab.id, {restart: true}, null);
        }
    }
});


function inject (host, path, cb) {
    // must implement path for injection
    var sett = settingsData;
    if (!sett[host] || !sett[host].enabled || !sett[host].inject) return cb();
    var inj = sett[host].inject || {};

    file.loadList(inj.css || [], function (err, css) {
        if (err) return cb({err: err});
        file.loadList(inj.js || [], function (err, js) {
            if (err) return cb({err: err});
            cb({css: map(css), js: map(js)});
        });
    });
}
function map (result) {
    var str = '';
    for (var file in result) {
        var code = result[file];
        str += '\n/*'+file+'*/\n'+code;
    }
    return str;
}


var tabs = {};
function addTab (req, sender, cb) {
    var url = req.host + (req.path == '/' ? '' : req.path);
    var host = settings.match(url);
    if (!host) return cb({message: 'Not watching this tab.'});

    sender.tab.host = host;
    tabs[sender.tab.id] = sender.tab;
    cb(tabs);
}
