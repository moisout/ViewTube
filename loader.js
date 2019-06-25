const baseUrl = `https://invidio.us/api/v1/`;
const rootUrl = getRootUrl();
const defaultRegion = 'US';
const components = [
    'vt-header',
    'vt-loader-overlay',
    'vt-loader',
    'vt-tooltip',
    'vt-play-btn',
    'vt-show-more',
    'vt-error'
];
const proxyUrl = 'https://proxy.mcdn.ch/?q=';
const autocompleteUrl = 'https://autocomplete.mcdn.ch';
const requestTimeout = 10000;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register(`${rootUrl}worker.js`).then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}


$(() => {
    $.ajax({
        url: `${rootUrl}main.js`,
        type: 'GET',
        dataType: "script",
        cache: true
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
        return '/ViewTube/';
    } else if (isProd()) {
        return '/';
    } else {
        return '/ViewTube/'
    }
}

function isLocalhost() {
    return window.location.href.match(/^(.*localhost.*)$/);
}

function isProd() {
    return window.location.href.match(/^(.*viewtube.eu.*)$/);
}