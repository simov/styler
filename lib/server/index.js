
var path = require('path'),
    ws = require('ws');

var Client = require('./module/client'),
    clients = require('./module/clients'),
    log = require('./module/logger'),
    watcher = require('./module/watcher');

var config = require(path.resolve(__dirname, '../../config/server')),
    server = new ws.Server({
        host: config.server.host,
        port: config.server.port
    });


server.on('connection', function (socket) {
    log.connection(socket);
    clients.add(new Client(socket));
});
// server.on('headers', function (headers) {
// 	console.log(headers);
// });
server.on('error', function (err) {
    console.log(err);
});
log.server(config.server);

watcher.start(function (err) {
    if (err) throw err;
});
watcher.on('change', function (host) {
    clients.extension(host);
});
