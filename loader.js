const baseUrl = `https://invidio.us/api/v1/`;
const rootUrl = getRootUrl();
const defaultRegion = 'US';
const components = [
    'vt-header',
    'vt-loader-overlay',
    'vt-loader',
    'vt-tooltip',
    'vt-play-btn'
];
const proxyUrl = 'https://proxy.mcdn.ch/?q=';

$(() => {
    $.ajax({
        url: `${rootUrl}main.js`,
        crossDomain: true,
        dataType: "script",
    }).done(async () => {
        await loadComponents(components);

        initMain();
    });
});

function loadComponents(components) {
    return new Promise((resolve, reject) => {
        components.forEach(async (element, index) => {
            const component = await getComponent(element);
            $(element).replaceWith(component);
            if (index === components.length - 1) {
                resolve(true);
            }
        });
    });
}

function getComponent(name) {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem(name) !== null) {
            console.log('cached');
            resolve(localStorage.getItem(name));
        }
        $.ajax({
            type: "GET",
            url: `${rootUrl}components/${name}.html`,
            dataType: "html"
        }).done((response) => {
            localStorage.setItem(name, response);
            resolve(response);
        }).fail((jqhxr, settings, exception) => {
            reject(exception);
        });
    });
}

function getRootUrl() {
    if (isLocalhost()) {
        return 'http://localhost/ViewTube/';
    } else {
        return '/';
    }
}

function isLocalhost() {
    return window.location.href.match(/^(.*localhost.*)$/);
}