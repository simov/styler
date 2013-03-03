require.register('template', function (module, exports, require) {


var file = require('file');


exports.add = function (path, name, cb) {
    file.load(path, function (err, data) {
        if (err) return cb(err);
        exports[name] = {
            path: path,
            html: data,
            compiled: Hogan.compile(data),
            render: function (params, partials) {
                return this.compiled.render(params, partials)
            }
        }
        cb();
    });
}

exports.load = function (paths, cb) {
    var keys = Object.keys(paths);
    (function loop (index) {
        if (index == keys.length) return cb(null);
        var name = keys[index];
        exports.add(paths[name], name, function (err) {
            if (err) return cb(err);
            loop(++index);
        });
    }(0));
}


});