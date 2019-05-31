$(function () {
    loadVideo();

    $('.video-buffer').addClass('buffering');

    let moved = false;
    $('.player-viewport').on('mousemove', (e) => {
        $('.video-player-overlay').addClass('hovering');
        $('.player-viewport').css('cursor', 'auto');
        updateVideoOverlay();

        if (moved == false) {
            setTimeout(() => {
                $('.video-player-overlay').removeClass('hovering');
                $('.player-viewport').css('cursor', 'none');
                moved = false;
            }, 5000);
            moved = true;
        }
    });

    progressBarSelection();

    setInterval(() => {
        updateVideoOverlay();
    }, 1000);

    $('.video-play-btn').on('click', (e) => {
        let video = $('#video')[0];
        if (video.playing) {
            video.pause();
            animatePlayButton("paused");
        }
        else {
            video.play();
            animatePlayButton("playing");
        }

    });
});


function loadInfo(data) {
    let template = $('.video-infobox').html();

    let html = Mustache.to_html(template, data);
    let viewCountString = `${numberWithSeparators(data.viewCount)} views`;
    let likeString = numberWithSeparators(data.likeCount);
    let dislikeString = numberWithSeparators(data.dislikeCount);
    let channelUrl = `${rootUrl}channel?id=${data.authorId}`;
    let thumbnailSrc = data.videoThumbnails[2].url;

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
                region: defaultRegion
            },
            dataType: "JSON",
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
                let video = document.getElementById('video');
                let audio = document.getElementById('audio');
                video.load();
                audio.load();
                syncAudioVideo();
            }
        });
    }
}

function progressBarSelection() {
    let progressSelection = false;
    $('.video-seekbar').on('mousedown', function () {
        progressSelection = true;
    });
    $('body').on('mousemove', function (e) {
        if (progressSelection) {
            let video = $('#video')[0];
            let progressPos = ((e.pageX - $('.seekbar-line').offset().left) / $('.seekbar-line').width()) * 100;
            $('.seekbar-line-progress').css('width', `${progressPos}%`);
            video.currentTime = (video.duration / 100) * progressPos;
        }
    });
    $('body').on('mouseup', function () {
        progressSelection = false;
    });
}

function syncAudioVideo() {
    let me = this;
    let playingBefore = false;
    let playingAfter = false;
    let buffering = true;
    let audioBuffering = true;
    let videoWaitingForAudio = false;

    let video = document.getElementById('video');
    let audio = document.getElementById('audio');
    setInterval(() => {
        if (videoWaitingForAudio && !buffering && !audioBuffering) {
            video.play();
            videoWaitingForAudio = false;
            audio.volume = me.audioVolume;
        }
        if (video.playing) {
            if (audioBuffering) {
                videoWaitingForAudio = true;
                video.pause();
                audio.volume = 0;
            }
            else {
                buffering = false;
                playingAfter = true;
                if (playingAfter == playingBefore) { }
                else {
                    audio.play();
                    playingBefore = true;
                    let currentTime = video.currentTime;
                    audio.currentTime = currentTime;
                }
                if (Math.abs(audio.currentTime - video.currentTime) > 0.2) {
                    let currentTime = video.currentTime;
                    audio.currentTime = currentTime;
                }
            }

        }
        else if (!video.playing) {
            playingBefore = false;
            audio.pause();
        }

        if (buffering == true) {
            $('.video-buffer').addClass('buffering');
        }
        else {
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
        }
        let loadedContent = (video.buffered.end(video.buffered.length - 1) / videoLength) * 100;
        $('.seekbar-line-loaded').css('width', `${loadedContent}%`);
    }

}

function animatePlayButton(state) {
    let animationTime = 200;
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
            console.log(i);
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