require.register('sr-json', function (module, exports, require) {


/**
 * Parse a given json object.
 * Return params object ready for rendering.
 *
 * @param {Object} json
 * @param {Function} callback
 * @return {Array} params
 * @api public
 */

exports.parse = function (json, cb) {
    read(json, [], cb);
}

/**
 * Recursively read a json object.
 * Return params object ready for rendering.
 *
 * @param {Object} json
 * @param {Array} value
 * @param {Function} callback
 * @return {Array} value
 * @api private
 */

function read (json, value, cb) {
    var keys = Object.keys(json);
    function loop (index) {
        if (index == keys.length) return cb(value);
        var key = keys[index],
            obj = json[key];
        var type = null;

        if (obj === null) {
            type = 'nul';
            value.push(v(type, key, 'null'));
            loop(++index);
        } else if (obj instanceof Object) {
            type = (obj instanceof Array) ? 'arr' : 'obj';
            value.push(o(type, key));
            read(obj, value[value.length-1].value, function () {
                loop(++index);
            });
        } else {
            switch (true) {
                case obj.constructor === Number:
                    value.push(v('num', key, obj));
                    break;
                case obj.constructor === String:
                    value.push(v('str', key, obj));
                    break;
                case obj.constructor === Boolean:
                    value.push(v('bool', key, obj));
                    break;
            }
            loop(++index);
        }
    }
    loop(0);
}

/**
 * Create object.
 *
 * @api private
 */

function o (type, key) {
    return {
        obj: true,
        type: type,
        key: key,
        value: []
    }
}

/**
 * Create value.
 *
 * @api private
 */

function v (type, key, value) {
    return {
        obj: false,
        type: type,
        key: key,
        value: value
    }
}

/**
 * Serialize dom structure.
 *
 * @param {Object} json - result
 * @param {Object} elems - dom
 * @api public
 */

exports.serialize = function (json, elems) {
    (function objectType (json, elems) {
        for (var i=0; i < elems.length; i++) {
            var obj = elems[i],
                type = obj.className,
                // key = obj.children[0].innerHTML,
                key = _key(obj.children).innerHTML,
                value = obj.children[1];

            if (/^(obj|arr)$/.test(type)) {
                var val = (type == 'obj') ? {} : [];
                json instanceof Array ? json.push(val) : json[key] = val;
                objectType(json[key], value.children);
            } else {
                var val = value.innerHTML;
                json instanceof Array ? json.push(val) : json[key] = _type(type, val);
            }
        }
    }(json, elems));
}

function _type (type, value) {
    switch (type) {
        case 'str':
            return value;
        case 'num':
            return parseInt(value);
        case 'bool':
            return value === 'true' ? true : false;
        case 'nul':
            return null;	
    }
}

function _key (elems) {
    for (var i=0; i < elems.length; i++) {
        // if (elems[i].className.indexOf('key') != -1) {
        if (elems[i].className.match(/^key$/)) {
            return elems[i];
        }
        if (elems[i].children.length) {
            return _key(elems[i].children);
        }
    }
    return null;
}

});