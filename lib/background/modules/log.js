
function log () {
    var disabled = true;
    if (disabled) return;

    var header = 'color: #fd971f; font-weight: bold;',
        tab = 'color: #1a770f;',
        url = 'color: #ae81ff;',
        sep = 'color: #7c7c7b;',
        rem = 'color: #af033f;';

    switch (arguments[0]) {
        case 'tabs.onUpdated':
            console.log('%ctabs.onUpdated', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, url);
            break;
        case 'tabs.onReplaced':
            console.log('%ctabs.onReplaced', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, rem);
            break;
        case 'tabs.onRemoved':
            console.log('%ctabs.onRemoved', header);
            console.log('%c'+arguments[1], rem);
            break;
        case 'webNavigation.onBeforeNavigate':
            console.log('%cwebNavigation.onBeforeNavigate', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, url);
            break;
        case 'webNavigation.onCommitted':
            console.log('%cwebNavigation.onCommitted', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, url);
            break;
        case 'webNavigation.onDOMContentLoaded':
            console.log('%cwebNavigation.onDOMContentLoaded', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, url);
            break;
        case 'webNavigation.onCompleted':
            console.log('%cwebNavigation.onCompleted', header);
            console.log('%c'+arguments[1]+' %c'+arguments[2], tab, url);
            break;
    }
    console.log('%c---------------------------------', sep);
}
