/**
 * jquery.simplr.json
 * version 1.0
 * copyright (c) 2013 https://github.com/simov/simplr-json
 * licensed under MIT
 */
;(function($) {
    'use strict';

    $.fn.srJSON = function(options) {
    
    // public
    var properties = $.extend({
        content: null,
        template: null
    }, options || {});

    // public
    var api = {
        addHost: addHost
    };

    // this alias
    var self = $.extend(this, properties, api);
    
    // init

    // add the rendered html
    self = self.empty().append(self.content);
    self.off('click mouseover mouseout');

    // values and host names are content editables
    $('.sr-json .value, .sr-json > ul > li > .key').attr('contenteditable', true);

    // wrap each object type key and add keys
    $('.obj', self).each(function (index) {
        $('> .key', this).wrap('<div class="keys-wrapper">');
        var keys = $('> div .key', this).attr('contenteditable')
            ? ['inject', 'watch'] // host
            : ['css', 'js']       // inject
        var html = self.template.keys.render({keys: keys});
        $('> div', this).append(html);
        // toggle add/remove classes
        var obj = this;
        $('> ul > li > .key', this).each(function (index) {
            $('> div li:contains("'+$(this).text()+'")', obj)
                .removeClass('add').addClass('remove');
        });
    });

    // insert remove button for all hosts
    $('> ul > li', self).append('<a href="#" class="btn-remove">&nbsp;</a>');

    // tooltips
    $.bt.options = {
        positions: ['top', 'most'],
        padding: 5,
        width: 'auto',
        spikeLength: 5,
        fill: 'rgba(255, 255, 255, .8)',
        cssStyles: {color: '#000', 'white-space': 'nowrap'},
        preShow: function (box) {
            var top = parseInt($(box).css('top').replace('px',''));
            $(box).css({top: top-3});
        }
    };
    $('.sr-json .keys').each(function (index) {
        $('li', this).each(function (index) {
            var text = $(this).hasClass('add') ? 'add' : 'remove';
            $(this).bt(text);
        });
    });
    $('.btn-remove').bt('remove', {preShow: btPreShow});
    function btPreShow (box) {
        var trigger = $(this),
            top = trigger.parent().offset().top,
            content = $('.bt-content', box);
        $(box).css({
            top: top - (content.outerHeight()) - 18,
            left: trigger.parent().width() - (content.outerWidth()/2) + 4
        });
    }

    // events

    // toggle menu-keys on hover
    self.on('mouseover', '.keys-wrapper', function (e) {
        $('.keys', this).css({visibility: 'visible'});
        return false;
    })
    .on('mouseout', '.keys-wrapper', function (e) {
        $('.keys', this).css({visibility: 'hidden'});
        return false;
    });

    // template params
    var params = {
        host: {
            type: 'obj',
            hasRemove: true,
            hasChildren: true,
            key: 'host.com',
            keys: ['inject', 'watch'],
            enabled: true
        },
        inject: {
            type: 'obj',
            hasChildren: true,
            key: 'inject',
            keys: ['css', 'js']
        },
        arr: function (key) {
            return {
                type: 'arr',
                hasChildren: false,
                key: key
            }
        }
    }

    // add/remove hosts
    function addHost () {
        var html = self.template.obj.render(params.host);
        $('> ul', self).append(html)
            .find('> li').last().hover(onHoverHost, onOutHost)
            .find('.btn-remove').bt('remove', {preShow: btPreShow}).parent()
            .find('.keys li').bt('add');
    }
    self.on('click', '.btn-remove', function (e) {
        $(this).btOff().parent().remove();
        return false;
    });
    function onHoverHost () {
        $('.btn-remove', this).css({visibility: 'visible'});
    }
    function onOutHost () {
        $('.btn-remove', this).css({visibility: 'hidden'});
    }
    $('> ul > li', self).hover(onHoverHost, onOutHost);

    // add/remove keys
    $('.sr-json').on('click', '.keys li', function (e) {
        var link = $(this);
        link.hasClass('add') ? addKey(link) : removeKey(link);
        return false;
    });
    function addKey (link) {
        switch (link.text()) {
            case 'inject':
                var html = self.template.obj.render(params.inject);
                link.parents('.obj').find('> ul .bool').after(html)
                    .next().find('.keys li').bt('add');
                break;
            case 'watch':
                var html = self.template.obj.render(params.arr(link.text()));
                link.parents('.obj').find('> ul').append(html);
                break;
            case 'css':
                var html = self.template.obj.render(params.arr(link.text()));
                link.parents('.obj').first().find('> ul').prepend(html);
                break;
            case 'js':
                var html = self.template.obj.render(params.arr(link.text()));
                link.parents('.obj').first().find('> ul').append(html);
                break;
        }
        link.removeClass('add').addClass('remove');
        link.btOff().bt('remove').btOn();
    }
    function removeKey (link) {
        switch (link.text()) {
            case 'inject':
                link.parents('.obj').find('> ul > .obj').remove();
                break;
            case 'watch':
                link.parents('.obj').find('> ul > .arr').remove();
                break;
            case 'css':
                link.parents('.obj').first().find('> ul > .arr:eq(0)').remove();
                break;
            case 'js':
                var index = link.prev().hasClass('add') ? 0 : 1;
                link.parents('.obj').first().find('> ul > .arr').eq(index).remove();
                break;
        }
        link.removeClass('remove').addClass('add');
        link.btOff().bt('add').btOn();
    }

    // keys clicked: enabled, css, js, watch and array indexes
    self.on('click', '.key', function (e) {
        var $key = $(this),
            $parent = $key.parent();
        switch (true) {
            // switch enabled
            case $key.text() == 'enabled':
                var $value = $key.next();
                $value.text($value.text() == 'true' ? 'false' : 'true');
                break;
            // add string
            case /^(css|js|watch)$/.test($key.text()):
                var html = self.template.obj.render({
                    type: 'str',
                    key: $key.next().find('li').length,
                    hasChildren: false,
                    hasValue: true,
                    value:  $key.text() == 'watch' ? '/absolute/path' : 'sites/'
                });
                $key.next().append(html).attr('contenteditable', true);
                break;
            // remove string
            case $parent.hasClass('str'):
                $parent.remove();
                break;		
        }
    });
    
    // extended this
    return self;
    };
})(jQuery);