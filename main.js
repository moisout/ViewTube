function initMain() {
    loadComponents(components);
    initTheme();
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

    $('#reload-btn').on('click', function () {
        localStorage.clear();
        Cookies.remove('theme');
        window.location.reload(true);
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
    if (typeof loadChannelContent === "function") {
        loadChannelContent();
    }
    if(typeof loadTopVideos === "function"){
        loadTopVideos();
    }
}

function initTheme() {
    if (Cookies.get('theme') == undefined) {
        Cookies.set('theme', 'dark-theme', {
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