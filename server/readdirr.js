
// MIT Copyright (c) 2012 https://gist.github.com/4132717

var fs = require('fs'),
    path = require('path');


var dir = null, file = null;

exports.readdirr = function (dpath, cb) {
    dir = [], file = [];
    dir.push(dpath);
    function loop (i) {
        if (i == dir.length) return cb(null, dir, file);
        fs.readdir(dir[i], function (err, files) {
            if (err) return cb(err);
            getstat(dir[i], files, function (err) {
                if (err) return cb(err);
                loop(++i);
            });
        });
    }
    loop(0);
}

function getstat (dpath, files, cb) {
    function loop (i) {
        if (i == files.length) return cb();
        var fpath = path.join(dpath, files[i]);
        fs.stat(fpath, function (err, stats) {
            if (err) return cb(err);
            if (stats.isDirectory()) {
                dir.push(fpath);
            } else {
                file.push(fpath);
            }
            loop(++i);
        });
    }
    loop(0);
}

/*
    var recursive = require('readdirr');

    var root = path.resolve(process.argv[2]);
    recursive.readdirr(root, function (err, dir, file) {
        if (err) {
            console.log(err);
        } else {
            console.log('DONE!');
        }
    });
*/
