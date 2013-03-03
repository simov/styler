require.register('client', function (module, exports, require) {


var Emitter = require('emitter');


/**
 * Client is Emitter.
 */

function Client () {
    Emitter.call(this);
}
Client.prototype = Object.create(Emitter.prototype);
Client.prototype.constructor = Client;

/**
 * Connect to a server
 * and send the user's settings.
 *
 * @param {Object} config
 * @param {Object} settings
 * @param {Function} callback
 * @return {Object} event
 * @api public
 */

Client.prototype.connect = function (config, settings, cb) {
    var url = 'ws://'.concat(config.host,':',config.port);
    var ws = new WebSocket(url);
    this.socket = ws;

    ws.onopen = function (e) {
        cb(e);
        this.emit('settings', e);
        this.send({settings: settings});
        return this.onerror;
    }.bind(this);

    ws.onclose = function (e) {
        cb(e);
        this.emit('close', e);
        return this.onclose;
    }.bind(this);

    ws.onmessage = this.onmessage.bind(this);
    ws.onerror = this.onerror.bind(this);
}

/**
 * Events: open, close, change, error
 * Subscribe to them:
 * client.on('event', callback)
 *
 * @param {Object} event
 * @api private
 */

Client.prototype.onopen = function (e) {
    this.emit('open', e);
}
Client.prototype.onclose = function (e) {
    this.emit('close', e);
}
Client.prototype.onmessage = function (e) {
    try {
        var req = JSON.parse(e.data);
    } catch (e) {
        console.log(e);
    }
    switch (true) {
        case req.change: this.emit('change', req.host, req.path); break;
    }
}
Client.prototype.onerror = function (e) {
    this.emit('error', e);
}

/**
 * Sends a message to the server.
 *
 * @param {Object} message
 * @api public
 */

Client.prototype.send = function (message) {
    this.socket.send(JSON.stringify(message));
}

module.exports = Client;


});
