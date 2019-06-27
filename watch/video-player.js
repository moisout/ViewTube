$(async () => {
    loadVideo();

    $('.video-buffer').addClass('buffering');

    $('.video-player-overlay').removeClass('hovering');
    $('.player-viewport').css('cursor', 'none');

    let moved = false;
    let settingsVisible = false;
    let overlayHideTimeout;
    $('.player-viewport').on('mousemove', (e) => {
        $('.video-player-overlay').addClass('hovering');
        $('.player-viewport').css('cursor', 'auto');

        if (!moved && !settingsVisible) {
            console.log(settingsVisible);
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

    $('.video-settings-btn').on('click', (e) => {
        if (settingsVisible) {
            settingsVisible = false;
            $('.video-settings-container').removeClass('opened');
        } else {
            settingsVisible = true;
            clearTimeout(overlayHideTimeout);
            $('.video-settings-container').addClass('opened');
        }
    });

    // $('#video').on('touchstart', (e) => e.preventDefault());
});

function toggleFullScreen() {
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        $('.video-fullscreen-btn-icon').text('fullscreen');
    } else {
        element = $('.player-viewport')[0];
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        $('.video-fullscreen-btn-icon').text('fullscreen_exit');
    }
}

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

function loadVideo() {
    let url = window.location.search;
    let urlParams = new URLSearchParams(url);
    if (urlParams.has('v')) {
        let videoId = urlParams.getAll('v');

        $.ajax({
            type: "GET",
            url: `${baseUrl}videos/${videoId}`,
            data: {
                region: defaultRegion,
                fields: 'title,videoId,videoThumbnails,descriptionHtml,viewCount,likeCount,dislikeCount,author,authorId,authorThumbnails,subCountText,lengthSeconds,adaptiveFormats,formatStreams'
            },
            dataType: "JSON",
            timeout: requestTimeout,
            success: function (response) {
                document.title = `${response.title} - ViewTube`;
                $('head').append(`<meta property="og:title" content="${response.title} - ViewTube">`);
                loadInfo(response);
                let currentVideo = response.formatStreams[0].url;
                if (response.adaptiveFormats != undefined) {
                    let audioUrls = resolveAudioFormats(response.adaptiveFormats);
                    let currentAudio = audioUrls[audioUrls.length - 1].url;
                    $('#audio').attr('src', currentAudio);

                    let videoUrls = resolveVideoFormats(response.adaptiveFormats);
                    currentVideo = videoUrls[0].url;
                }
                $('.video-mp4').attr('src', currentVideo);
                $('.video-buffer').removeClass('buffering');
                onSiteLoaded();
            },
            error: async (jqXHR, textStatus, exception) => {
                await showLoadingError();

                onSiteLoaded();
            }
        });
    }
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
            console.log(audio.volume);
            refreshAudioDisplay(audio.volume * 100);
            e.preventDefault();
        }
    });
}

function progressBarSelection() {
    let progressSelection = false;
    $('.video-seekbar').on('mousedown', (e) => {
        progressSelection = true;
    }).on('click', (e) => {
        seekVideo(e);
    });

    $('body').on('mousemove', (e) => {
        if (progressSelection) {
            seekVideo(e);
        }
    }).on('mouseup', function () {
        progressSelection = false;
    });

    function seekVideo(e) {
        let video = $('#video')[0];
        let progressPos = ((e.pageX - $('.seekbar-line').offset().left) / $('.seekbar-line').width()) * 100;
        $('.seekbar-line-progress').css('width', `${progressPos}%`);
        video.currentTime = (video.duration / 100) * progressPos;
    }
}

function volumeSelection() {
    let audioSelection = false;
    $('.audio-bar').on('mousedown', (e) => {
        audioSelection = true;
    }).on('click', (e) => {
        seekAudio(e);
    });

    $('body').on('mousemove', (e) => {
        if (audioSelection) {
            seekAudio(e);
        }
    }).on('mouseup', () => {
        audioSelection = false;
    });

    let previousVolume = 1;
    $('.video-audio-btn').on('click', (e) => {
        if (audio.volume == 0) {
            audio.volume = previousVolume;
        } else {
            previousVolume = audio.volume;
            audio.volume = 0;
        }
        refreshAudioDisplay(audio.volume * 100);
    });

    function seekAudio(e) {
        let audio = $('#audio')[0];
        let audioVolume = ((e.pageX - $('.audio-bar').offset().left) / $('.audio-bar').width()) * 100;
        if (audioVolume > 100) {
            audioVolume = 100;
        }
        if (audioVolume < 0) {
            audioVolume = 0;
        }
        audio.volume = audioVolume / 100;
        refreshAudioDisplay(audioVolume);
    }
}

function refreshAudioDisplay(volume) {
    $('.audio-bar-volume').removeClass('mute');
    if (volume > 50) {
        $('.video-audio-btn-icon').text('volume_up');
    } else if (volume > 0 && volume < 50) {
        $('.video-audio-btn-icon').text('volume_down');
    } else if (volume == 0) {
        $('.video-audio-btn-icon').text('volume_mute');
        $('.audio-bar-volume').addClass('mute');
    }
    $('.audio-bar-volume').css('width', `${volume}%`);
}

function syncAudioVideo() {
    let me = this;
    let playingBefore = false;
    let playingAfter = false;
    let buffering = true;
    let audioBuffering = true;
    let videoWaitingForAudio = false;
    let audioVolume = 1;

    let video = $('#video')[0];
    let audio = $('#audio')[0];
    setInterval(() => {
        if (videoWaitingForAudio && !buffering && !audioBuffering) {
            videoWaitingForAudio = false;
            audio.volume = audioVolume;
            buffering = false;
        }
        if (audioBuffering) {
            videoWaitingForAudio = true;
            audio.volume = 0;
            buffering = true;
        }
        if (video.playing) {
            buffering = false;
            playingAfter = true;
            if (playingAfter == playingBefore) {} else {
                audio.play();
                playingBefore = true;
                let currentTime = video.currentTime;
                audio.currentTime = currentTime;
            }
            if (Math.abs(audio.currentTime - video.currentTime) > 0.2) {
                let currentTime = video.currentTime;
                audio.currentTime = currentTime;
            }
        } else if (!video.playing && !videoWaitingForAudio) {
            playingBefore = false;
            audio.pause();
        }

        if (buffering == true) {
            $('.video-buffer').addClass('buffering');
        } else {
            $('.video-buffer').removeClass('buffering');
        }
    }, 100);

    video.onwaiting = function () {
        buffering = true;
    }

    video.oncanplay = function () {
        buffering = false;
    }

    audio.onwaiting = function () {
        audioBuffering = true;
    }

    audio.oncanplay = function () {
        audioBuffering = false;
    }
}

function updateVideoOverlay() {
    if ($('.video-player-overlay').hasClass('hovering')) {
        let video = $('#video')[0];
        let videoLength = video.duration;
        let videoProgress = video.currentTime;
        let videoProgressPercentage = (videoProgress / videoLength) * 100;

        if (!isNaN(videoProgressPercentage)) {
            $('.seekbar-line-progress').css('width', `${videoProgressPercentage}%`);
            $('.video-time').text(`${formattedTime(videoProgress)} / ${formattedTime(videoLength)}`);
        }
        if (!isNaN(videoLength)) {
            let loadedContent = (video.buffered.end(video.buffered.length - 1) / videoLength) * 100;
            $('.seekbar-line-loaded').css('width', `${loadedContent}%`);
        }
    }
}

function animatePlayButton(state) {
    let animationTime = 100;
    let animationSteps = 7;
    if (state == "playing") {
        setTimeout(() => {
            $(".video-play-btn-paused")
                .hide();
            $(".video-play-btn-1")
                .show();
        }, animationTime * (1 / animationSteps));

        for (let i = 1; i < animationSteps; i++) {
            setTimeout(() => {
                $(`.video-play-btn-${i}`)
                    .hide();
                $(`.video-play-btn-${i + 1}`)
                    .show();
            }, animationTime * ((i + 1) / animationSteps));
        }

        setTimeout(() => {
            $(`.video-play-btn-${animationSteps - 1}`)
                .hide();
            $(".video-play-btn-playing")
                .show();
        }, animationTime);

    } else if (state == "paused") {
        setTimeout(() => {
            $(".video-play-btn-playing")
                .hide();
            $(`.video-play-btn-${animationSteps - 1}`)
                .show();
        }, animationTime * (1 / animationSteps));

        let index = 2;
        for (let i = animationSteps - 1; i > 1; i--) {
            setTimeout(() => {
                $(`.video-play-btn-${i}`)
                    .hide();
                $(`.video-play-btn-${i - 1}`)
                    .show();
            }, animationTime * (index / animationSteps));
            index++;
        }

        setTimeout(() => {
            $(".video-play-btn-1")
                .hide();
            $(".video-play-btn-paused")
                .show();
        }, animationTime);
    }

}

function resolveAudioFormats(formats) {
    return formats.filter((value, index, array) => {
        if (value.type.match('^(audio.*)$')) {
            return value;
        }
    });
}

function resolveVideoFormats(formats) {
    return formats.filter((value, index, array) => {
        if (value.type.match('^(video.*)$')) {
            return value;
        }
    });
}

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function () {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})