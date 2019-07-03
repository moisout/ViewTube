function initMain() {
    initTheme();
}

function initHeader() {
    $('.search-btn').on('click', (e) => {
        let searchValue = $('#search').val();

        if (searchValue.length > 0) {
            searchRedirect(searchValue);
        }

        e.preventDefault();
    });

    let selectedAutocompleteEntry = 0;
    $('#search').on('keydown', (e) => {
        let searchValue = $('#search').val();
        let autocompleteEntryCount = $('.search-autocomplete-container').children().length;
        if (e.key === 'Enter') {
            if (searchValue.length > 0) {
                searchRedirect(searchValue);
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (selectedAutocompleteEntry >= 0 && selectedAutocompleteEntry < autocompleteEntryCount) {
                selectedAutocompleteEntry++;
            }
            selectedAutocompleteEntry = selectAutocompleteEntry(selectedAutocompleteEntry);
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            if (selectedAutocompleteEntry >= 0 && selectedAutocompleteEntry <= autocompleteEntryCount) {
                selectedAutocompleteEntry--;
            }
            selectedAutocompleteEntry = selectAutocompleteEntry(selectedAutocompleteEntry);
            e.preventDefault();
        }
    }).on('input', (e) => {
        let searchValue = $('#search').val();
        $('.search-btn').attr('href', `${rootUrl}results?search_query=${searchValue}`);

        $.ajax({
            type: "GET",
            url: autocompleteUrl,
            data: {
                q: searchValue,
                cl: 'youtube'
            },
            dataType: "JSON",
            success: function (response) {
                $('.search-autocomplete-container').empty();
                let searchValue = $('#search').val().toLowerCase();
                if (searchValue.length > 0) {
                    let firstEntry = `<a href="${rootUrl}results?search_query=${searchValue}" class="search-autocomplete-entry">${searchValue}</a>`;
                    $(firstEntry).appendTo('.search-autocomplete-container');
                }
                response.forEach((value, index) => {
                    let autoCompleteEntry = `<a href="${rootUrl}results?search_query=${value}" class="search-autocomplete-entry">${value}</a>`;
                    $(autoCompleteEntry).appendTo('.search-autocomplete-container');
                });
            },
            error: function (jqXHR, textStatus, exception) {}
        });
    });

    $('body').on('click', (e) => {
        if ($('#search').is(":focus")) {
            $('.search-autocomplete-container').removeClass('hidden');
        } else {
            $('.search-autocomplete-container').addClass('hidden');
        }
    });

    function selectAutocompleteEntry(index) {
        let autocompleteEntryCount = $('.search-autocomplete-container').children().length;
        if (index > autocompleteEntryCount) {
            index = autocompleteEntryCount - 1;
        } else if (index <= 0) {
            index = 1;
        }
        $('.search-autocomplete-entry').removeClass('selected');
        selectedEntry = $(`.search-autocomplete-entry:nth-of-type(${index})`);
        selectedEntry.addClass('selected');
        if (index > 0) {
            $('#search').val(selectedEntry.text());
        }
        return index;
    }

    $('#reload-btn').on('click', async () => {
        localStorage.clear();
        Cookies.remove('theme');
        await localforage.clear();
        await serviceWorkerRegistration.unregister();
        window.location.reload(true);
    });

    $('#theme-change').on('click', (e) => {
        toggleTheme();
        e.preventDefault();
    });

    $('#open-in-yt').on('click', (e) => {
        if (e.altKey) {
            openInInVidious();
        } else {
            openInYoutube();
        }
        e.preventDefault();
    });

    $('.logo-link').attr('href', `${rootUrl}`);
    $('.logo-small').attr('src', `${rootUrl}images/icon-192.png`);
    $('.yt-logo').attr('src', `${rootUrl}images/logos/youtube-icon.svg`);

    if (typeof loadSearchResultPage === "function") {
        loadSearchResultPage();
    }
    if (typeof loadChannelContent === "function") {
        loadChannelContent();
    }
    if (typeof loadFrontPage === "function") {
        loadFrontPage();
    }
    if (typeof initErrorPage === "function") {
        initErrorPage();
    }
    if (typeof initVideoPlayer === "function") {
        initVideoPlayer();
    }

    return true;
}

function onSiteLoaded() {
    const observer = lozad('.lozad', {
        load: (el) => {
            $(el).css('opacity', 0);
            setTimeout(() => {
                el.src = el.getAttribute('data-src');
            }, 200);
            el.onload = () => $(el).css('opacity', 1);
        },
        // loaded: (el) => {
        //     setTimeout(() => {
        //         $(el).css('opacity', 1);
        //     }, 400);
        // }
    });
    observer.observe();
    if (!hasTouch()) {
        initTooltips();
    }
    initRippleEffect();
    initParallax();

    $('.ripple').on('dragstart', (e) => e.preventDefault()).on('contextmenu', (e) => e.preventDefault());;
}

function hasTouch() {
    return 'ontouchstart' in document.documentElement ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
}

function initTooltips() {
    $('[vt-tooltip]').on('mouseenter', (e) => {
        let tooltip = new Tooltip(e.currentTarget);
        tooltip.show();
    });
}

function initParallax() {
    $('.content-container').on('scroll', (e) => {
        $('.parallax').each((index, element) => {
            if (isVisible(element)) {
                let offsetTop = ($(element).parent('.parallax-container').offset().top - 60) / -2;
                $(element).css('transform', `translateY(${offsetTop}px)`);
            }
        });
    });
}

async function loadShowMore(target) {
    let compontent = await getComponent('vt-show-more');
    let showMore = $(compontent).insertAfter(target);
    let defaultHeight = 20;
    let showMoreBtn = $(showMore).find('.show-more-btn');
    let showLessBtn = $(showMore).find('.show-less-btn');

    $(showMoreBtn).on('click', (e) => {
        let height = $(target).children().outerHeight();
        defaultHeight = $(target).height();
        $(target).css('height', `${height}px`);
        setTimeout(() => {
            $(showMoreBtn).addClass('hidden');
            $(showLessBtn).removeClass('hidden');
        }, 300);

        e.preventDefault();
    });

    $(showLessBtn).on('click', (e) => {
        $(target).css('height', `${defaultHeight}px`);
        setTimeout(() => {
            $(showLessBtn).addClass('hidden');
            $(showMoreBtn).removeClass('hidden');
        }, 300);

        e.preventDefault();
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

        let offsetTop = $(this.target).offset().top + $(tooltipHtml).outerHeight() + 15;
        let offsetLeft = $(this.target).offset().left + ($(this.target).outerWidth() / 2) - ($(tooltipHtml).outerWidth() / 2);
        if ((offsetLeft + $(tooltipHtml).outerWidth()) > $(window).width()) {
            offsetLeft = $(window).width() - $(tooltipHtml).outerWidth() - 10;
        }
        if (offsetLeft < 0) {
            offsetLeft = 0;
        }
        if ((offsetTop + $(tooltipHtml).outerHeight()) > $(window).height()) {
            offsetTop = $(this.target).offset().top - $(tooltipHtml).outerHeight() - 15;
        }
        if (offsetTop < 0) {
            offsetTop = 0;
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

async function showLoadingError() {
    let error = await getComponent('vt-error');
    $('.spinner').replaceWith(error);
    $('.loading-retry-btn').on('click', (e) => {
        window.location.reload();
        e.preventDefault();
    });
}

function openInYoutube() {
    let page = parseUrlToYT(window.location);
    window.open(`https://youtube.com/${page}`);
}

function openInInVidious() {
    let page = parseUrlToYT(window.location);
    window.open(`https://invidio.us/${page}`);
}

function parseUrlToYT(location) {
    let url = location.href;
    let page = url.replace(`${location.origin}${rootUrl}`, '');
    if (page.match(/^(.*channel.*)$/)) {
        let channelId = new URLSearchParams(location.search).getAll('id')[0];
        page = `channel/${channelId}`;
    }
    return page;
}

function searchRedirect(searchValue) {
    let searchUrl = `${rootUrl}results?search_query=${searchValue}`;

    window.location.href = searchUrl;
}

function isVisible(element) {
    let rect = element.getBoundingClientRect();
    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
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