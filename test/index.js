
/*
    Before running the test:
    Fire up chrome and navigate to 'about:extensions'
    Click on 'Load unpacked extension ...' and select
    the project's folder and then do the same for the sites folder
*/

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
        done(new Error('Not implemented!'));
        // browser = spawn('google-chrome', ['http://localhost']);
        // server = spawn('node', ['./server/server.js']);
    });

    after(function (done) {
        // server.kill();
        done();
    });
});
