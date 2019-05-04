$(function () {
    initTheme();
    loadVideo();
});

function loadInfo(data) {
    let template = $('.video-infobox').html();

    let html = Mustache.to_html(template, data);
    let viewCountString = `${numberWithSeparators(data.viewCount)} Views`;
    let likeString = numberWithSeparators(data.likeCount);
    let dislikeString = numberWithSeparators(data.dislikeCount);

    let video = $('.video-infobox').html(html);
    $(video).find('.infobox-views').text(viewCountString);
    $(video).find('.like-count').text(likeString);
    $(video).find('.dislike-count').text(dislikeString);
    
    $(video).find('.video-infobox-description').html(data.descriptionHtml);
    $('#channel-img').attr('src', data.authorThumbnails[4].url);
    $(video).removeClass('loading');

    $(video).find('.video-infobox-description').find('a').each((index, element) => {
        let urlParams = new URLSearchParams($(element).attr('href').split('?')[1]);
        if (urlParams.has('q')) {
            let url = urlParams.get('q')
            $(element).attr('href', url);
            let originalHTML = $(element).html();
            $(element).html(`<img class="favicon-link" src="https://www.google.com/s2/favicons?domain=${url}" ></img>${originalHTML}`);
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

function syncAudioVideo() {
    let me = this;
    let playingBefore = false;
    let playingAfter = false;
    let buffering = true;
    setInterval(() => {
        let video = document.getElementById('video');
        let audio = document.getElementById('audio');
        if (video.playing) {
            buffering = false;
            playingAfter = true;
            if (playingAfter == playingBefore) { }
            else {
                audio.play();
                playingBefore = true;
                let currentTime = video.currentTime;
                audio.currentTime = currentTime;
            }
            if (Math.abs(audio.currentTime - video.currentTime) > 0.5) {
                let currentTime = video.currentTime;
                audio.currentTime = currentTime;
            }
        }
        else if (!video.playing) {
            playingBefore = false;
            audio.pause();
        }

        if (!audio.readyState < audio.HAVE_FUTURE_DATA || !video.readyState < video.HAVE_FUTURE_DATA) {
            buffering = false;
        }
        else if (audio.readyState < audio.HAVE_FUTURE_DATA || video.readyState < video.HAVE_FUTURE_DATA) {
            buffering = true;
        }

        if (buffering == true) {
            $('.video-buffer').addClass('buffering');
        }
        else {
            $('.video-buffer').removeClass('buffering');
        }
    }, 100);

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