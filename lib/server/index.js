
var path = require('path'),
    ws = require('ws');

var Client = require('./modules/client'),
    log = require('./modules/logger'),
    watcher = require('./modules/watcher'),
    client = null;


var config = require(path.resolve(__dirname, process.argv[2] || '../../config/server')),
    server = new ws.Server({
        host: config.host,
        port: config.port
    });


server.on('listening', function () {
    log.server(config);
});

server.on('error', function (err) {
    console.log(err);
});

server.on('connection', function (socket) {
    log.connection(socket);
    client = new Client(socket);
    client.on('settings', function (settings) {
        watcher.start(settings.styler.sites, function (err) {
            if (err) throw err;
            watcher.options = {extension: true};
            watcher.start(settings.styler.extensions, function (err) {
                if (err) throw err;
                watcher.options = {};
            });
        });
    });
});

watcher.on('change', function (key, options) {
    if (client.socket.readyState == ws.OPEN) {
        client.send({change: true, key: key, options: options});
    }
});
