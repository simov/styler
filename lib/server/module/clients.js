
var ws = require('ws');


/**
 * Collection of all clients connected to the server.
 */

exports = module.exports = {
    add: function (socket) {
        if (this[socket.host] === undefined) {
            this[socket.host] = {};
        }
        this[socket.host][socket.key] = socket;
    },
    remove: function (socket) {
        delete this[socket.host][socket.key];
    },
    refresh: function (host) {
        for (var key in this[host]) {
            if (this[host][key].readyState == ws.OPEN) {
                var message = JSON.stringify({
                    message: 'restart-page'
                });
                this[host][key].send(message);
            }
        }
    },
    extension: function (host) {
        if (!this[host]) return;
        var keys = Object.keys(this[host]);
        if (!keys.length) return;
        var message = JSON.stringify({
            host: host,
            message: 'restart-extension'
        });
        var key = keys[0];
        if (this[host][key].readyState == ws.OPEN) {
            this[host][key].send(message);
        }
    }
};
