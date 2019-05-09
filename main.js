let baseUrl = 'https://invidio.us/api/v1/';
let rootUrl = getRootUrl();
let defaultRegion = 'US';
let components = [
    'vt-header'
];

$(async function () {
    await loadComponents(components);

    $('#theme-change').on('click', function () {
        toggleTheme();
    });

    initSearchBar();
});

function loadComponents(components) {
    return new Promise((resolve, reject) => {
        components.forEach((element, index) => {
            $.get(`${rootUrl}components/${element}.html`, function (template) {
                $(element).replaceWith(template);

                if (index == components.length - 1) {
                    resolve(true);
                }
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
            let template = $('.video-entry-template').html();

            response.forEach(element => {
                let html = Mustache.to_html(template, element);
                let imgSrc = element.videoThumbnails[4].url;
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
        }
    });
}

function initTheme() {
    if (Cookies.get('theme') == undefined) {
        Cookies.set('theme', 'light-theme', { expires: 365 });
    }
    else {
        $('html').removeClass();
        $('html').addClass(Cookies.get('theme'));
    }
}

function toggleTheme() {
    if ($('html').hasClass('light-theme')) {
        $('html').removeClass('light-theme');
        $('html').addClass('dark-theme');
        Cookies.set('theme', 'dark-theme', { expires: 365 });
    } else if ($('html').hasClass('dark-theme')) {
        $('html').removeClass('dark-theme');
        $('html').addClass('light-theme');
        Cookies.set('theme', 'light-theme', { expires: 365 });
    }
}

function initSearchBar() {
    $('.search-btn').on('click', function () {
        toggleSearch(true);
    });

    $('#search').on('keypress', function (e) {
        if (e.which == 13) {
            let searchValue = $('#search').val();

            searchRedirect(searchValue);
        }
    });

    $('#search').on("focusout", function () {
        if ($(this).val().length <= 0) {
            toggleSearch(false);
        }
    });

    if (typeof insertSearchQuery === "function") { 
        insertSearchQuery();
    }
}

function toggleSearch(value) {
    if (value) {
        $('.search-box').addClass('active');
        $('.search-btn').addClass('searching');
        $('#search').focus();
    } else {
        $('.search-box').removeClass('active');
        $('.search-btn').removeClass('searching');

        $('.search-btn').css('left', '');
    }
}

function searchRedirect(searchValue) {
    let searchUrl = `${rootUrl}results?search_query=${searchValue}`;

    window.location.href = searchUrl;
}

function getRootUrl() {
    let location = window.location.href;
    if (location.match(/^(.*localhost.*)$/)) {
        return 'http://localhost/ViewTube/';
    }
    else {
        return '/';
    }
}

function numberWithSeparators(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formattedTime(seconds) {
    let ms = seconds * 1000;
    let date = new Date(ms);
    if (date.getHours() - 1 > 0) {
        return `${date.getHours() - 1}:${date.getMinutes()}:${addZero(date.getSeconds())}`;
    }
    else {
        return `${date.getMinutes()}:${addZero(date.getSeconds())}`;
    }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}