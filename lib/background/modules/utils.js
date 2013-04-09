
/**
 * The custom code is injected into tags at the end of the document's body
 * in order to give them enough weight for successful override.
 */

// requires: file, settings

var inject = (function () {
    return function (url, cb) {
        if (!url) return cb(true);
        var path = settings.match(url.host + (url.path || ''));
        if (!path) return cb(true);

        var sett = settings.data.styler.sites;
        if (!sett[path].enabled || !sett[path].inject) return cb(true);
        var inj = sett[path].inject || {};

        file.loadList(inj.css || [], function (err, css) {
            if (err) return cb({err: err});
            file.loadList(inj.js || [], function (err, js) {
                if (err) return cb({err: err});
                cb(null, {css: map(css), js: map(js)});
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
}());


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
    var path = settings.match(url.host + (url.path || ''));
    if (!path) return;
    tabs[id] = {
        id: id,
        host: path
    };
}
