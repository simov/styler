
/**
 * The custom code is injected into tags at the end of the document's body
 * in order to give them enough weight for successful override.
 */

// require('file'),
// require('settings');

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