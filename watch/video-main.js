function initVideoPlayer() {
    loadVideo();

    $('.video-buffer').addClass('buffering');

    $('.video-player-overlay').removeClass('hovering');
    $('.player-viewport').css('cursor', 'none');

    let moved = false;
    let overlayHideTimeout;
    $('.player-viewport').on('mousemove', (e) => {
        $('.video-player-overlay').addClass('hovering');
        $('.player-viewport').css('cursor', 'auto');

        if (!moved) {
            updateVideoOverlay();
            overlayHideTimeout = setTimeout(() => {
                $('.video-player-overlay').removeClass('hovering');
                $('.player-viewport').css('cursor', 'none');
                moved = false;
            }, 5000);
            moved = true;
        }
    });

    progressBarSelection();
    volumeSelection();

    setInterval(() => {
        updateVideoOverlay();
    }, 1000);

    $('.video-play-btn').on('click', (e) => {
        setVideo('toggle');
    });

    let videoInitialized = false;
    $('.play-click-area').on('click', (e) => {
        if (!videoInitialized) {
            $('.video-thumbnail').fadeOut(300);
            $('.video-buffer').css('z-index', 200);
            $('.play-click-area').css('z-index', 200);
            let video = $('#video')[0];
            let audio = $('#audio')[0];
            video.load();
            audio.load();
            syncAudioVideo();
            videoInitialized = true;
            initKeyboardControls();
        }
        setVideo('play');
    });

    $('#video').on('click', (e) => {
        if (video.playing) {
            setVideo('pause');
        } else {
            setVideo('play');
        }
    }).on('dblclick', (e) => {
        toggleFullScreen();
    });

    $('.video-fullscreen-btn').on('click', (e) => {
        toggleFullScreen();
    });

    let settingsVisible = false;
    $('.video-settings-btn').on('click', (e) => {
        if (settingsVisible) {
            settingsVisible = false;
            $('.video-settings-container').removeClass('opened');
        } else {
            settingsVisible = true;
            $('.video-settings-container').addClass('opened');
        }
        e.preventDefault();
    });

    // $('#video').on('touchstart', (e) => e.preventDefault());
};

function setVideo(state) {
    let video = $('#video')[0];
    if (state === 'play' || (!video.playing && state === 'toggle')) {
        video.play();
        animatePlayButton("playing");
        $('.play-click-area').addClass('zoom-out');
        setTimeout(() => {
            $('.play-click-area').fadeOut(300);
        }, 300);
    } else if (state === 'pause' || (video.playing && state === 'toggle')) {
        video.pause();
        animatePlayButton("paused");
    }
}

function loadInfo(data) {
    let template = $('.video-infobox').html();

    let html = Mustache.to_html(template, data);
    let viewCountString = `${numberWithSeparators(data.viewCount)} views`;
    let likeString = numberWithSeparators(data.likeCount);
    let dislikeString = numberWithSeparators(data.dislikeCount);
    let channelUrl = `${rootUrl}channel?id=${data.authorId}`;
    let thumbnailSrc = `${proxyUrl}${data.videoThumbnails[2].url}`;

    let video = $('.video-infobox').html(html);
    $(video).find('.infobox-views').text(viewCountString);
    $(video).find('.like-count').text(likeString);
    $(video).find('.dislike-count').text(dislikeString);
    $(video).find('#channel-img').attr('href', channelUrl);
    $(video).find('.infobox-channel-name').attr('href', channelUrl);
    $('.video-thumbnail').css('background-image', `url(${thumbnailSrc})`);

    $(video).find('.video-infobox-description').html(data.descriptionHtml);
    $('#channel-img').attr('src', `${proxyUrl}${data.authorThumbnails[4].url}`);
    $(video).removeClass('loading');

    $(video).find('.video-infobox-description').find('a').each((index, element) => {
        let urlParams = new URLSearchParams($(element).attr('href').split('?')[1]);
        if (urlParams.has('q')) {
            let url = urlParams.get('q')
            $(element).attr('href', url);
            let originalHTML = $(element).html();
            $(element).html(`<img class="favicon-link" src="${proxyUrl}https://www.google.com/s2/favicons?domain=${url}" ></img>${originalHTML}`);
        }
    });
}

function initKeyboardControls() {
    $('body').on('keydown', (e) => {
        let video = $('#video')[0];
        let audio = $('#audio')[0];
        if (e.key === ' ') {
            setVideo('toggle');
            e.preventDefault();
        }
        if (e.key === 'ArrowRight') {
            video.currentTime += 5;
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft') {
            video.currentTime -= 5;
            e.preventDefault();
        }
        if (e.key === 'ArrowUp') {
            if (audio.volume < 1) {
                audio.volume += 0.1;
            }
            refreshAudioDisplay(audio.volume * 100);
            e.preventDefault();
        }
        if (e.key === 'ArrowDown') {
            if (audio.volume > 0) {
                audio.volume -= 0.1;
                audio.volume = Math.floor(audio.volume * 10) / 10;
            }
            refreshAudioDisplay(audio.volume * 100);
            e.preventDefault();
        }
    });
}