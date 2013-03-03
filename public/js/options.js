
var json = require('sr-json'),
    file = require('file'),
    template = require('template');


$(function () {
    // the ui plugin instance
    var ui = null;
    // partials
    var templates = {
        value: 'module/json/partials/sr-json-value.html',
        keys: 'partials/keys.html',
        obj: 'partials/object.html'
    };
    // intialize hogan.js template instances
    template.load(templates, function (err) {
        if (err) throw err;
        read();
    });
    
    // main menu links
    $('#main-menu a').on('click', function (e) {
        var link = $(this);
        switch (true) {
            case link.hasClass('btn-new'):
                ui.addHost();
                break;
            case link.hasClass('btn-save'):
                var data = {};
                json.serialize(data, $('.sr-json > ul')[0].children);
                console.log('serialized', data);
                write(data);
                break;
            case link.hasClass('btn-undo'):
                read();
                break;	
        }
        return false;
    });

    // read from chrome.storage
    function read () {
        chrome.storage.sync.get(function (data) {
            show(data);
        });
    }
    // write to chrome.storage
    function write (data) {
        chrome.storage.sync.clear(function () {
            chrome.storage.sync.set(data, function () {
                show(data);
            });
        });
    }
    // show the info
    function show (data) {
        json.parse(data, function (params) {
            console.log('parsed', params);
            ui = $('.sr-json').srJSON({
                content: template.value.render(
                    {value: params}, {value: template.value.html}),
                template: template
            });
        });
    }
});

console.log = function (name, object) {
    console.group(name);
    console.dir(object);
    console.groupEnd();
}
