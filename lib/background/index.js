
// require('file'),
// require('client'),
// require('settings');
var client = new Client(),
    tabs = {};
var extensionId = ''; // extension id for reload


// storage and reload

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

// tab detection

chrome.tabs.onUpdated.addListener(function (id, info, tab) {
    if (info.status === 'complete') return;
    var url = parseUrl(tab.url);
    if (!/(http|https)/.test(url.prot)) {
        addTab(id, tab.url);
    }
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

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    if (details.url === 'about:blank') return;
    // maybe I should insert the content scripts here
    // only for pages that need them
    // chrome.tabs.insertCSS(id, {file: file, runAt: 'document_start'});
    // chrome.tabs.executeScript(id, {file: file, runAt: 'document_start'});
    log('webNavigation.onBeforeNavigate', details.tabId, details.url);
});

chrome.webNavigation.onCommitted.addListener(function (details) {
    if (details.url === 'about:blank') return;
    // load the custom code and send it the content script
    var url = parseUrl(details.url);
    inject(url.host, '', function (code) {
        chrome.tabs.sendMessage(details.tabId, {inject: true, code: code});
        log('webNavigation.onCommitted', details.tabId, details.url);
    });
});

chrome.webNavigation.onCompleted.addListener(function (details) {
    if (details.url === 'about:blank') return;
    var url = parseUrl(details.url);
    addTab(details.tabId, url);
    log('webNavigation.onCompleted', details.tabId, details.url);
});

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
    var match = settings.match(url.host + (url.path || ''));
    if (!match) return;
    tabs[id] = {
        id: id,
        host: match
    };
}
