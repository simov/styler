
// require('file'),
// require('client'),
// require('settings');
var client = new Client();
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
    chrome.tabs.query({}, function (tabs) {
        for (var i=0; i < tabs.length; i++) {
            var url = parseUrl(tabs[i].url);
            var path = settings.match(url.host + (url.path || ''));
            if (!path) continue;
            chrome.tabs.reload(tabs[i].id);
        }
    });
});

// tab detection

chrome.webNavigation.onCommitted.addListener(function (details) {
    // if (details.url === 'about:blank') return;
    // load the custom code and send it the content script
    var url = parseUrl(details.url);
    inject(url, function (err, code) {
        if (err) return;
        chrome.tabs.sendMessage(details.tabId, {inject: true, code: code});
        log('webNavigation.onCommitted', details.tabId, details.url);
    });
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
