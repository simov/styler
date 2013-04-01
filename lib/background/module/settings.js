require.register('settings', function (module, exports, require) {


exports.data = {};
var sorted = [];

/**
 * Create sorted array of all settings.
 *
 * @api public
 */

exports.sort = function () {
    var sites = this.data.styler.sites;
    for (var host in sites) {
        sorted.push({host: host, data: sites[host]});
    }
    sorted.sort(desc);
}

/**
 * Helper sorter.
 *
 * @api private
 */

function desc (a, b) {
    if (a.host < b.host) return  1;
    if (a.host > b.host) return -1;
    return 0;
}

/**
 * Test if a given url matches one of
 * the urls from the settings.
 *
 * @param {String} url
 * @return {String} host
 * @api public
 */

exports.match = function (url) {
    for (var i=0; i < sorted.length; i++) {
        var regex = new RegExp('^'+sorted[i].host);
        if (regex.test(url)) {
            return sorted[i].host;
        }
    }
    return null;
}


});