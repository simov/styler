
var fs = require('fs'),
    path = require('path'),
    recursive = require('recursive-fs'),
    EventEmitter = require('events').EventEmitter;
var log = require('./logger');
var timer = null;


/**
 * Watcher is Emitter.
 */

function Watcher () {}
Watcher.prototype = Object.create(EventEmitter.prototype);
Watcher.prototype.constructor = Watcher;

/**
 * Start to watch all paths specified in the settings.
 *
 * @param {Object} settings
 * @param {Function} callback
 * @api public
 */

Watcher.prototype.start = function (settings, cb) {
    var self = this,
        hosts = Object.keys(settings);

    (function loop (index) {
        if (index == hosts.length) return cb();
        var host = settings[hosts[index]];
        if (!host.enabled) return loop(++index);

        inner(hosts[index], host.watch, function (err) {
            if (err) return cb(err);
            loop(++index);
        });
    }(0));

    function inner (host, watch, cb) {
        (function loop (index) {
            if (index == watch.length) return cb();
            fs.exists(watch[index], function (exists) {
                if (!exists) {
                    log.missing(watch[index]);
                    return loop(++index);
                }
                self.watchPath(host, watch[index], function (err) {
                    if (err) return cb(err);
                    loop(++index);
                });
            });
        }(0));
    }
}

/**
 * Recursively read and watch all directories inside a given path.
 *
 * @param {String} host
 * @param {String} wpath watched path
 * @api private
 */
 
Watcher.prototype.watchPath = function (host, wpath, cb) {
    var self = this;
    recursive.readdirr(wpath, function (err, dirs, files) {
        if (err) return cb(err);
        log.watching(wpath, dirs, files);

        for (var i=0; i < dirs.length; i++) {
            fs.watch(dirs[i], self.onChange(host, dirs[i], wpath));
        }
        cb();
    });
}

/**
 * Emits a 'change' event whenever file is changed.
 *
 * @param {String} host
 * @param {String} dpath directory path
 * @api private
 */

Watcher.prototype.onChange = function (host, dpath) {
    var self = this;
    return function (event, filename) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            log.changed(host, dpath, event, filename);
            self.emit('change', host, path.join(dpath, filename));
        }, 100);
    }
}

module.exports = new Watcher();
