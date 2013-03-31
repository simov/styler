
var json = require('sr-json'),
    template = require('template');


$(function () {
    // the ui plugin instance
    var sites = {
        id: '#site-settings'
    };
    var extensions = {
        id: '#extension-settings'
    };
    var active = sites;
    
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
    
    // toggle tabs
    $('#tabs a').on('click', function (e) {
        $('#tabs li').removeClass('active');
        var link = $(this);
        switch (true) {
            case link.hasClass('btn-sites'):
                active = sites;
                break;
            case link.hasClass('btn-extensions'):
                active = extensions;
                break;
        }
        $(sites.id).hide();
        $(extensions.id).hide();
        $(active.id).show();
        link.parent().addClass('active');
        return false;
    });

    // actions
    $('#actions a').on('click', function (e) {
        var link = $(this);
        switch (true) {
            case link.hasClass('btn-new'):
                active.ui.addHost();
                break;
            case link.hasClass('btn-save'):
                var sitesData = {};
                json.serialize(sitesData, $(sites.id+' > ul')[0].children);
                var extensionsData = {};
                json.serialize(extensionsData, $(extensions.id+' > ul')[0].children);
                write(sitesData, extensionsData);
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
            if (!data) data = {styler: {sites: {}, extensions: {}}};
            render(sites, data.styler.sites || {});
            render(extensions, data.styler.extensions || {});
        });
    }

    // write to chrome.storage
    function write (sitesData, extensionsData) {
        chrome.storage.sync.clear(function () {
            var data = {
                styler: {
                    sites: sitesData,
                    extensions: extensionsData
                }
            };
            chrome.storage.sync.set(data, function () {
                read();
            });
        });
    }
    
    // render the settings
    function render (obj, settings) {
        json.parse(settings, function (params) {
            obj.ui = $(obj.id).srJSON({
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
