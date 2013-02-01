require.register('create', function (module, exports, require) {


var file = require('file');


exports.string = function (paths, cb) {
    var str = '';
    function loop (index) {
        if (index == paths.length) return cb(null, str);
        file.load('sites/'+paths[index], function (err, string) {
            if (err) return cb(err);
            str += '\n/*'+paths[index]+'*/\n' + string;
            loop(++index);
        });
    }
    loop(0);
}


});
