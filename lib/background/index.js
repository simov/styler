
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

chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    if (info.status === 'complete') return;
    addTab(id, tab.url);
    log('tabs.onUpdated', id, tab.url);
});

chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
    delete tabs[removedTabId];
    log('tabs.onReplaced', addedTabId, removedTabId);
});

chrome.tabs.onRemoved.addListener(function (id, info) {
    delete tabs[id];
    log('tabs.onRemoved', id);
});

chrome.webNavigation.onCompleted.addListener(function (details) {
    if (details.url === 'about:blank') return;
    addTab(details.tabId, details.url);
    log('webNavigation.onCompleted', details.tabId, details.url);
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
            chrome.tabs.reload(tab.id);
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

// adding a tab

function parseUrl (url) {
    var regex = /^([^:]+):\/\/([^\/]+)((\/[^\/]+(?=\/))+)?(?:\/(.*))?$/;
    var match = url.match(regex)
    // prot - chrome-extension, chrome, http ...
    return match ? {
        prot: match[1],
        host: match[2],
        path: match[3],
        file: match[5]
    } : null;
}

function addTab (id, url) {
    var url = parseUrl(url);
    var match = settings.match(url.host + (url.path || ''));
    if (!match) return;
    tabs[id] = {
        id: id,
        host: match
    };
}

// console

function log () {
    var header = 'color: #fd971f; font-weight: bold;',
        tab = 'color: #1a770f;',
        url = 'color: #ae81ff;',
        sep = 'color: #7c7c7b;',
        rem = 'color: #af033f;';

    switch (arguments[0]) {
        case 'tabs.onUpdated':
            console.log('%ctabs.onUpdated', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, url);
            break;
        case 'tabs.onReplaced':
            console.log('%ctabs.onReplaced', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, rem);
            break;
        case 'tabs.onRemoved':
            console.log('%ctabs.onRemoved', header);
            console.log('%c'+arguments[1], rem);
            break;
        case 'webNavigation.onCompleted':
            console.log('%cwebNavigation.onCompleted', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, url);
            break;
    }
    console.log('%c---------------------------------', sep);
}
