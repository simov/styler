require.register('file', function (module, exports, require) {


exports.load = function (path, cb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            cb(null, xhr.responseText);
        }
    };
    xhr.open('GET', chrome.extension.getURL(path), true);
    try {
        xhr.send();
    } catch (e) {
        return cb(new Error('Couldn\'t load file'));
    }
}


});
