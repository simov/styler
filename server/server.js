
var fs = require('fs'),
    ws = require('ws');
var recursive = require('./readdirr'),
    config = require('./config'),
    server = new ws.Server({ host: config.host, port: config.port }),
    clients = {};


server.on('connection', function (socket) {
    var req = socket.upgradeReq;
    clients[req.headers.origin] = socket;
});

function watcher () {
    recursive.readdirr(config.path, function (err, dir, file) {
        for (var i=0; i < dir.length; i++) {
            fs.watch(dir[i], onFileChanged);
        }
    });
}

function onFileChanged (event, filename) {
    setTimeout(function () {
        for (var key in clients) {
            if (clients[key].readyState == ws.OPEN) {
                clients[key].send('wohoo file changed');
            }
        }
    }, 100);
}

watcher();
