
var fs = require('fs'),
    path = require('path'),
    recursive = require('recursive-fs'),
    EventEmitter = require('events').EventEmitter;
var log = require('./logger');
var watch = require(path.resolve(__dirname, '../../../config/server')).watch,
    timer = null;


function Watcher () {}
Watcher.prototype = Object.create(EventEmitter.prototype);
Watcher.prototype.constructor = Watcher;

Watcher.prototype.start = function (cb) {
    var self = this;
    function loop (index) {
        if (index == watch.length) return cb();
        var config = watch[index];
        if (!config.enabled) return loop(++index);
        recursive.readdirr(config.path, function (err, dirs, files) {
            if (err) return cb(err);
            log.watching(config.path, dirs, files);
            for (var i=0; i < dirs.length; i++) {
                fs.watch(dirs[i], self.onChange(config.host, config.path));
            }
            loop(++index);
        });
    }
    loop(0);
}

Watcher.prototype.onChange = function (host, dpath) {
    var self = this;
    return function (event, filename) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            log.changed(host, dpath, event, filename);
            self.emit('change', host);
        }, 100);
    }
}

module.exports = new Watcher();
