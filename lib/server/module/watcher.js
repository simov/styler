
var fs = require('fs'),
    path = require('path'),
    recursive = require('recursive-fs'),
    EventEmitter = require('events').EventEmitter;
var log = require('./logger');
var timer = null;


/**
 * Watcher is Emitter.
 */

function Watcher () {
    this.options = {};
}
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
        keys = Object.keys(settings);

    (function loop (index) {
        if (index == keys.length) return cb();
        var key = keys[index],
            item = settings[key];
        if (!item.enabled || !item.watch) return loop(++index);

        self.watchList(key, item.watch, function (err) {
            if (err) return cb(err);
            loop(++index);
        });
    }(0));
}

/**
 * Start watching each directory in the list.
 *
 * @param {String} key
 * @param {String} wpath watched path
 * @api public
 */

Watcher.prototype.watchList = function (key, watch, cb) {
    var self = this;
    (function loop (index) {
        if (index == watch.length) return cb();
        fs.exists(watch[index], function (exists) {
            if (!exists) {
                log.missing(watch[index]);
                return loop(++index);
            }
            self.watchPath(key, watch[index], function (err) {
                if (err) return cb(err);
                loop(++index);
            });
        });
    }(0));
}

/**
 * Recursively read and watch all directories inside a given path.
 *
 * @param {String} key
 * @param {String} wpath watched path
 * @api public
 */
 
Watcher.prototype.watchPath = function (key, wpath, cb) {
    var self = this;
    recursive.readdirr(wpath, function (err, dirs, files) {
        if (err) return cb(err);
        log.watching(wpath, dirs, files);

        for (var i=0; i < dirs.length; i++) {
            fs.watch(dirs[i], onChange.call(self, key, dirs[i]));
        }
        cb();
    });
}

/**
 * Emits a 'change' event whenever file is changed.
 *
 * @param {String} key
 * @param {String} dpath directory path
 * @api private
 */

function onChange (key, dpath) {
    var self = this,
        options = {};
    // copy all options set before calling the start method
    for (var name in this.options) {
        options[name] = this.options[name];
    }
    return function (event, filename) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            log.changed(key, dpath, event, filename);
            self.emit('change', key, options);
        }, 100);
    }
}

module.exports = new Watcher();
