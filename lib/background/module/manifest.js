require.register('manifest', function (module, exports, require) {


function Manifest (string) {
    this.manifest = JSON.parse(string);
}

Manifest.prototype.getContentScripts = function (host) {
    var scripts = this.manifest.content_scripts,
        result = { css: [], js: [] };
    for (var i=0; i < scripts.length; i++) {
        var script = scripts[i],
            matches = script.matches;
        for (var j=0; j < matches.length; j++) {
            if (matches[j].indexOf(host) != -1) {
                if (script.css) result.css = result.css.concat(script.css);
                if (script.js) result.js = result.js.concat(script.js);
            }
        }
    }
    return result;
}

exports.Manifest = Manifest;


});
