let baseUrl = `https://invidio.us/api/v1/`;
let rootUrl = getRootUrl();
let defaultRegion = 'US';
let components = [
    'vt-header',
    'vt-loader-overlay',
    'vt-loader'
];
let proxyUrl = 'https://proxy.mcdn.ch/?q=';

$(function () {
    loadComponents(components).then(() => {
    });
});

function loadComponents(components) {
    return new Promise((resolve, reject) => {
        components.forEach((element, index) => {
            $.ajax({
                type: "GET",
                url: `${rootUrl}components/${element}.html`,
                dataType: "html"
            }).done((response) => {
                $(element).replaceWith(response);
                if (index === components.length) {
                    console.log($('#theme-change'));
                    resolve(true);
                }
            }).fail((jqhxr, settings, exception) => {
                reject(exception);
            });
        });
    });
}

function loadTopVideos() {
    $.ajax({
        type: "GET",
        url: `${baseUrl}top`,
        dataType: "JSON",
        success: function (response) {
            $.get(`${rootUrl}components/vt-video-entry.html`, function (template) {
                response.forEach(element => {
                    let html = Mustache.to_html(template, element);
                    let imgSrc = `${proxyUrl}${element.videoThumbnails[4].url}`;
                    let linkUrl = `watch?v=${element.videoId}`;
                    let channelUrl = element.authorUrl;
                    let viewCountString = `${numberWithSeparators(element.viewCount)} Views`;
                    let videoLength = formattedTime(element.lengthSeconds);

                    let videoEntry = $(html).appendTo('.video-list-container');
                    $(videoEntry).find('.video-entry-thmb-image').attr('src', imgSrc);
                    $(videoEntry).find('.video-entry-thmb').attr('href', linkUrl);
                    $(videoEntry).find('.video-entry-title').attr('href', linkUrl);
                    $(videoEntry).find('.video-entry-channel').attr('href', channelUrl);
                    $(videoEntry).find('.video-entry-views').text(viewCountString);
                    $(videoEntry).find('.video-entry-length').text(videoLength);
                });
            });
        }
    });
}

function initHeader() {
    $('.search-btn').on('click', function (e) {
        let searchValue = $('#search').val();

        if (searchValue.length > 0) {
            searchRedirect(searchValue);
        }

        e.preventDefault();
    });

    $('#search').on('keypress', function (e) {
        if (e.which == 13) {
            let searchValue = $('#search').val();

            if (searchValue.length > 0) {
                searchRedirect(searchValue);
            }
            e.preventDefault();
        }
    });

    $('#theme-change').on('click', function (e) {
        toggleTheme();
        e.preventDefault();
    });

    $('.logo-link').attr('href', `${rootUrl}`);
    $('.logo-small').attr('src', `${rootUrl}images/icon-192.png`);

    if (typeof loadSearchResultPage === "function") {
        loadSearchResultPage();
    }
}

function initTheme() {
    if (Cookies.get('theme') == undefined) {
        Cookies.set('theme', 'light-theme', {
            expires: 365
        });
    } else {
        $('html').removeClass();
        $('html').addClass(Cookies.get('theme'));
    }
}

function toggleTheme() {
    if ($('html').hasClass('light-theme')) {
        $('html').removeClass('light-theme');
        $('html').addClass('dark-theme');
        Cookies.set('theme', 'dark-theme', {
            expires: 365
        });
    } else if ($('html').hasClass('dark-theme')) {
        $('html').removeClass('dark-theme');
        $('html').addClass('light-theme');
        Cookies.set('theme', 'light-theme', {
            expires: 365
        });
    }
}

function searchRedirect(searchValue) {
    let searchUrl = `${rootUrl}results?search_query=${searchValue}`;

    window.location.href = searchUrl;
}

function getRootUrl() {
    if (isLocalHost()) {
        return 'http://localhost/ViewTube/';
    } else {
        return '/';
    }
}

function isLocalHost() {
    return window.location.href.match(/^(.*localhost.*)$/);
}

function numberWithSeparators(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formattedTime(seconds) {
    let ms = seconds * 1000;
    let date = new Date(ms);
    if (date.getHours() - 1 > 0) {
        return `${date.getHours() - 1}:${date.getMinutes()}:${addZero(date.getSeconds())}`;
    } else {
        return `${date.getMinutes()}:${addZero(date.getSeconds())}`;
    }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}