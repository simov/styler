
// require('file'),
// require('client'),
// require('settings');
var client = new Client(),
    tabs = {};
var extensionId = ''; // extension id for reload


chrome.extension.onMessage.addListener(function (req, sender, sendResponse) {
    switch (true) {
        case req.inject: inject(req.host, req.path, sendResponse);
            break;
        case req.tab: addTab(req, sender, sendResponse);
            break;
    }
    return true;
});

// chrome.tabs.onCreated.addListener(function (tab) {
// 	if (tab.url.indexOf('chrome-extension://') == 0) {
// 		var regex = new RegExp('chrome-extension://(.*)/.*');
// 		var match = tab.url.match(regex);
// 		if (match) {
// 			var id = match[1];
// 			tab.host = id;
// 			tabs[tab.id] = tab;
// 		}
// 	}
// });

chrome.tabs.onRemoved.addListener(function (id, info) {
    delete tabs[id];
});

chrome.storage.sync.get(function (data) {
    settings.data = data;
    settings.sort();

    file.load('config/server.json', function (err, data) {
        if (err) throw err;
        var config = JSON.parse(data);
        client.connect(config, settings.data, function (e) {
            // ..
        });
    });
});

client.on('change', function (key, options) {
    if (options.extension) {
        extensionId = key;
        return disable();
    }
    // site
    for (var id in tabs) {
        var tab = tabs[id];
        if (tab.host === key) {
            chrome.tabs.sendMessage(tab.id, {restart: true}, null);
        }
    }
});


function inject (host, path, cb) {
    // must implement path for injection
    var sett = settings.data.styler.sites;
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


function addTab (req, sender, cb) {
    var url = req.host + (req.path == '/' ? '' : req.path);
    var host = settings.match(url);
    if (!host) return cb({message: 'Not watching this tab.'});

    sender.tab.host = host;
    tabs[sender.tab.id] = sender.tab;
    cb(tabs);
}

// extension reload

function enable (cb) {
    chrome.management.setEnabled(extensionId, true, cb);
}
function disable (cb) {
    chrome.management.setEnabled(extensionId, false, cb);
}

chrome.management.onDisabled.addListener(function (extension) {
    if (extension.id !== extensionId) return;
    enable(function () {
        extensionId = '';
    });
});
