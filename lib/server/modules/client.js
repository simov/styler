
var EventEmitter = require('events').EventEmitter;
var log = require('./logger');


/**
 * Client is Emitter.
 */

function Client (socket) {
    this.socket = socket;
    socket.on('message', this.onmessage.bind(this));
    socket.on('error', this.onerror.bind(this));
    socket.on('close', this.onclose.bind(this));
    
    socket.host = socket.upgradeReq.headers.origin.split('://')[1];
    socket.key  = socket.upgradeReq.headers['sec-websocket-key'];
}
Client.prototype = Object.create(EventEmitter.prototype);
Client.prototype.constructor = Client;

/**
 * Parses the incoming message and emit the appropriate event.
 * Events: settings
 *
 * @param {String} message
 * @api private
 */

Client.prototype.onmessage = function (message) {
    try {
        var req = JSON.parse(message);
    } catch (e) {
        console.log(e);
    }
    if (req.settings) {
        this.emit('settings', req.settings)
    }
}

/**
 * Log the error message and re-emit the event.
 * Event: error
 *
 * @param {Object} err
 * @api private
 */

Client.prototype.onerror = function (err) {
    console.log(err);
    this.emit('error');
}

/**
 * Log the error message and re-emit the event.
 * Event: close
 *
 * @param {Number} code
 * @param {String} message
 * @api private
 */

Client.prototype.onclose = function (code, message) {
    log.close(this.socket, code, message);
    this.emit('close');
}

/**
 * Sends a message to the socket.
 *
 * @param {Object} message
 * @api public
 */

Client.prototype.send = function (message) {
    this.socket.send(JSON.stringify(message));
}

exports = module.exports = Client;
