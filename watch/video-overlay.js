function initQualitySelection() {
    $('.quality-combined-entry').on('click', (e) => {

        let url = $(e.target).attr('video-url');

        switchVideoUrl(url);
        $('.video-settings-container').removeClass('opened');

        e.preventDefault();
    });
}

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

function progressBarSelection() {
    let video = $('#video')[0];
    let progressSelection = false;
    $('.video-seekbar').on('mousedown', (e) => {
        progressSelection = true;
        $('.seekbar-timestamp').addClass('visible');
    }).on('click', (e) => {
        seekVideo(e);
    });

    let seekPosition;

    $('body').on('mousemove', (e) => {
        if (progressSelection) {
            seekVideo(e);
        }
    }).on('mouseup', function () {
        if (progressSelection) {
            progressSelection = false;
            video.currentTime = seekPosition;
            $('.seekbar-timestamp').removeClass('visible');
        }
    });

    $('.video-seekbar').on('mousemove', (e) => {
        let progressPos = ((e.pageX - $('.seekbar-line').offset().left) / $('.seekbar-line').width()) * 100;
        $('.seekbar-timestamp').css('left', `${progressPos}%`);
        $('.seekbar-timestamp').text(formattedTime((video.duration / 100) * progressPos));
    });

    function seekVideo(e) {
        let progressPos = ((e.pageX - $('.seekbar-line').offset().left) / $('.seekbar-line').width()) * 100;
        $('.seekbar-line-progress').css('width', `${progressPos}%`);
        $('.seekbar-timestamp').css('left', `${progressPos}%`);
        seekPosition = (video.duration / 100) * progressPos;
        video.currentTime = seekPosition;
    }
}

function volumeSelection() {
    let audio = $('#audio')[0];
    let video = $('#video')[0];

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
            video.volume = previousVolume;
        } else {
            previousVolume = audio.volume;
            audio.volume = 0;
            video.volume = 0;
        }
        refreshAudioDisplay(audio.volume * 100);
    });

    function seekAudio(e) {
        let audioVolume = ((e.pageX - $('.audio-bar').offset().left) / $('.audio-bar').width()) * 100;
        if (audioVolume > 100) {
            audioVolume = 100;
        }
        if (audioVolume < 0) {
            audioVolume = 0;
        }
        audio.volume = audioVolume / 100;
        video.volume = audioVolume / 100;
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