require('colors');

var enabled = true,
    verbose = true;

exports.server = function (server) {
    if (!enabled) return;
    console.log('WebSocket server listening on'.grey,
        (server.host+':'+server.port).yellow);
}

exports.connection = function (socket) {
    if (!enabled) return;
    var headers = socket.upgradeReq.headers;
    console.log('connected'.blue, ':', headers.origin.blue);
}

exports.close = function (socket, code, message) {
    if (!enabled) return;
    var headers = socket.upgradeReq.headers;
    console.log('closed'.red, ':', socket.host.red);
}

exports.restarted = function (host) {
    if (!enabled || !verbose) return;
    console.log('restarted'.green, ':', host.green);
}

exports.watching = function (path, dirs, files) {
    if (!enabled || !verbose) return;
    console.log('watching'.cyan, ':', path.grey, ':',
        (dirs.length+' dirs').green, ':', (files.length+' files').magenta);
}

exports.missing = function (path) {
    if (!enabled || !verbose) return;
    console.log(' missing'.red, ':', path);
}

exports.changed = function (host, path, event, filename) {
    if (!enabled || !verbose) return;
    console.log(event.magenta, ':', filename.magenta, ':', path.grey, ':', host.cyan);
}
