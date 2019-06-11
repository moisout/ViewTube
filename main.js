function initMain() {
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
    if (typeof loadTopVideos === "function") {
        loadTopVideos();
    }
}

function onSiteLoaded() {
    initTooltips();
    initRippleEffect();
}

function initTooltips() {
    $('[vt-tooltip]').on('mouseenter', (e) => {
        let tooltip = new Tooltip(e.currentTarget);
        tooltip.show();
    });
}

function Tooltip(target) {
    this.target = target;
    this.tooltipText = $(this.target).attr('vt-tooltip');

    this.show = async () => {
        const me = this;
        const tooltip = await getComponent('vt-tooltip');
        let tooltipHtml = $(tooltip).appendTo('body');
        $(tooltipHtml).find('.tooltip-title').text(this.tooltipText);

        let offsetTop = $(this.target).offset().top + $(tooltipHtml).outerHeight();
        let offsetLeft = $(this.target).offset().left + ($(this.target).outerWidth() / 2) - ($(tooltipHtml).outerWidth() / 2);
        if ((offsetLeft + $(tooltipHtml).outerWidth()) > $(window).width()) {
            offsetLeft = $(window).width() - $(tooltipHtml).outerWidth();
        }
        if (offsetLeft < 0) {
            offsetLeft = 0;
        }
        if ($(tooltipHtml).outerWidth() > $(window).width()) {
            $(tooltipHtml).css('width', `${$(window).width() - 20}px`);
        }

        $(tooltipHtml).css({
            top: offsetTop,
            left: offsetLeft
        });
        setTimeout(() => {
            $(tooltipHtml).addClass('visible');
        }, 600);

        $(target).on('mouseleave', (e) => {
            me.destroy(tooltipHtml);
        });

        $(tooltipHtml).on('click', (e) => {
            me.destroy(e.currentTarget);
        });

        setInterval(() => {
            if (!$(target).is(':hover')) {
                me.destroy(tooltipHtml);
            }
        }, 500);
    }

    this.destroy = (targetHtml) => {
        $(targetHtml).removeClass('visible');
        setTimeout(() => {
            $(targetHtml).remove();
        }, 200);
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