
var http = require('http'),
    spawn = require('child_process').spawn;


describe('styler', function () {
    var browser = null,
        server = null;
    it('should inject custom css', function (done) {
        done(new Error('Not implemented!'));
        // /chrome-extension:\/\/.*dummy\.css/i.test(html).should.equal(true);
    });

    it('should inject custom js', function (done) {
        done(new Error('Not implemented!'));
        // /chrome-extension:\/\/.*dummy\.js/i.test(html).should.equal(true);
    });

    it('should refresh the page on file changed', function (done) {
        return done(new Error('Not implemented!'));

        function startBrowser () {
            browser = spawn('google-chrome', ['http://localhost:4444']);
            browser.stdout.setEncoding('utf8');
            browser.stdout.on('data', function (data) {
                var text = data.toString().trim();
                console.log(text);
                switch (text) {
                    case '': break;
                }
            });
            browser.stdout.on('error', function (data) {
                console.log(data);
            });
            browser.stdout.on('close', function (code, signal) {
                console.log(code, signal);
            });
        }

        server = spawn('node', ['./lib/server/index.js', '../../test/config/server']);
        server.stdout.setEncoding('utf8');
        server.stdout.on('data', function (data) {
            var text = data.toString().trim();
            console.log(text);
            switch (true) {
                case /.*watching.*/.test(text): startBrowser(); break;
            }
        });
        server.stdout.on('error', function (data) {
            console.log(data);
        });
        server.stdout.on('close', function (code, signal) {
            console.log(code, signal);
        });

        setTimeout(function () {
            debugger;
            done();
        }, 3000);

        // spawn server
        // spawn browser
        // save a file
        // listen on the stdout stream
    });

    after(function (done) {
        server.kill();
        browser.kill();
        done();
    });
});
