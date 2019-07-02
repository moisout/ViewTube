function loadVideo() {
    let url = window.location.search;
    let urlParams = new URLSearchParams(url);
    if (urlParams.has('v')) {
        let videoId = urlParams.getAll('v');

        apiRequest({
            url: `videos/${videoId}`,
            data: {
                region: defaultRegion,
                fields: 'title,videoId,videoThumbnails,descriptionHtml,viewCount,likeCount,dislikeCount,author,authorId,authorThumbnails,subCountText,lengthSeconds,adaptiveFormats,formatStreams'
            }
        }).then(response => {
            document.title = `${response.title} - ViewTube`;
            $('head').append(`<meta property="og:title" content="${response.title} - ViewTube">`);
            loadInfo(response);

            let currentVideo = response.formatStreams[0].url;

            response.formatStreams.forEach(element => {
                $('.video-quality-selection-combined')
                    .append(`<a href="#" class="quality-combined-entry" video-url="${element.url}">
                    ${element.qualityLabel}${element.fps} - ${element.container}</a>`);
            });

            initQualitySelection();

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
        }, async error => {
            await showLoadingError();

            onSiteLoaded();
        });
    }
}

function switchVideoUrl(url) {
    syncedFormat = false;
    let video = $('#video')[0];
    let audio = $('#audio')[0];

    let currentTime = video.currentTime;

    console.log(url);

    $('.video-mp4').attr('src', url);
    $('#audio').attr('src', '#');

    video.load();
    audio.load();

    video.currentTime = currentTime;
    video.play();
}


let syncedFormat = true;

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
    if (syncedFormat) {
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
    }

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