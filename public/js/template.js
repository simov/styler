
// require('file');
var template = {};

template.add = function (path, name, cb) {
    file.load(path, function (err, data) {
        if (err) return cb(err);
        template[name] = {
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

template.load = function (paths, cb) {
    var keys = Object.keys(paths);
    (function loop (index) {
        if (index == keys.length) return cb(null);
        var name = keys[index];
        template.add(paths[name], name, function (err) {
            if (err) return cb(err);
            loop(++index);
        });
    }(0));
}
