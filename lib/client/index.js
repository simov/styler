(function () {


// require('inject');

var req = {
    inject: true,
    host: window.location.hostname,
    path: window.location.pathname
};
chrome.extension.sendMessage(req, function (res) {
    if(!res) return;
    if (res.err) throw res.err;
    inject.style(res.css);
    inject.script(res.js);
});


}());
