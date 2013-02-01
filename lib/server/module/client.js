
var log = require('./logger'),
    clients = require('./clients');


function Client (socket) {
    socket.on('message', function (data) {
        // console.log(data);
        try {
            var json = JSON.parse(data);
        } catch(e) {
            return console.log(e);
        }
        if (json.message == 'extension-restarted') {
            log.restarted(json.host);
            clients.refresh(json.host);
        }
    });
    socket.on('error', function (err) {
        console.log(err);
    });
    socket.on('close', function (code, message) {
        // console.log(code, message);
        log.close(this, code, message);
        clients.remove(this);
    });
    socket.host = socket.upgradeReq.headers.origin.split('://')[1];
    socket.key  = socket.upgradeReq.headers['sec-websocket-key'];

    return socket;
}

exports = module.exports = Client;
