const baseUrl = `https://invidious.snopyta.org/api/v1/`;
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
const requestTimeout = 12000;

let serviceWorkerRegistration;

let date = new Date();
let dbVersion = `${date.getFullYear()}${date.getMonth()}${date.getDay()}${date.getHours()}`;

localforage.config({
    name: 'ViewTube',
    version: dbVersion
});

// if ('serviceWorker' in navigator && !isLocalhost()) {
//     window.addEventListener('load', function () {
//         navigator.serviceWorker.register(`${rootUrl}worker.js`).then(function (registration) {

//             serviceWorkerRegistration = registration;
//             // Registration was successful
//             console.log('ServiceWorker registration successful with scope: ', registration.scope);
//         }, function (err) {
//             // registration failed :(
//             console.log('ServiceWorker registration failed: ', err);
//         });
//     });
// }

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

function loadScripts(scripts) {
    let promisesArray = [];
    scripts.forEach(element => {
        promisesArray.push(new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: `${rootUrl}${element}.js`,
                dataType: "script"
            }).done((response) => {
                resolve(response);
            }).fail((jqhxr, settings, exception) => {
                reject(exception);
            });
        }));
    });
    return Promise.all(promisesArray);
}

async function apiRequest(args) {
    const requestUrl = `${baseUrl}${args.url}`;
    const requestData = args.data;
    let requestKey = requestUrl + JSON.stringify(requestData);

    if (await localforage.getItem(requestKey)) {
        return localforage.getItem(requestKey);
    }

    return new Promise((resolve, reject) => {
        $.ajax({
            type: "GET",
            url: requestUrl,
            dataType: "JSON",
            data: requestData,
            timeout: requestTimeout,
        }).done((response) => {
            localforage.setItem(requestKey, response);
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