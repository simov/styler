(function () {


// require('inject');


chrome.extension.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.restart) {
        window.location.reload(true);
    }
});


var action = {
    inject: function (cb) {
        var req = {
            inject: true,
            host: window.location.hostname,
            path: window.location.pathname
        };
        chrome.extension.sendMessage(req, function (res) {
            if(!res) return cb();
            if (res.err) return cb(res.err);
            inject.style(res.css);
            inject.script(res.js);
            cb();
        });
    },
    tab: function (cb) {
        var req = {
            tab: true,
            host: window.location.hostname,
            path: window.location.pathname
        };
        chrome.extension.sendMessage(req, function (res) {
            cb();
        });
    }
}

action.inject(function (err) {
    if (err) throw err;
    action.tab(function () {
        
    });
});


}());
