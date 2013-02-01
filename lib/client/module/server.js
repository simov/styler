require.register('server', function (module, exports, require) {


exports.connect = function (host, port) {
    var url = 'ws://'.concat(host,':',port),
        ws = new WebSocket(url);

    ws.onopen = function (e) {
        
    };

    ws.onmessage = function (e) {
        console.log(e);
        try {
            var json = JSON.parse(e.data);
            if (json.message == 'restart-extension') {
                chrome.extension.sendMessage({restart: true}, function (res) {
                    if (res.restarted) {
                        var message = JSON.stringify({
                            host: window.location.hostname,
                            message: 'extension-restarted'
                        });
                        ws.send(message);
                    }
                });
            } else if (json.message == 'restart-page') {
                ws.close();
                window.location.reload(true);
            }
        } catch (e) {
            console.log(e);
        }
    };

    ws.onclose = function (e) {
        
    };

    ws.onerror = function (error) {
        console.log(error);
    };

    // this.instance = ws;
}


});
