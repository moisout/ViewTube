function initPagesManager() {
    $('.video-entry').on('click', openVideoPage);
}

function openVideoPage(e) {
    if (e.target.className !== 'video-entry-channel') {
        $.ajax({
            type: "GET",
            url: `${rootUrl}watch/watch.html`,
            dataType: "html"
        }).done((response) => {
            $('body').append('<div class="video-page"></div>');
            $('.video-page').append(response);
            $('.video-list-container, .results-panel, .channel-videos-container').addClass('hiding');
            loadComponents(components).then(() => {
                loadScripts([
                    'watch/video-main',
                    'watch/video-overlay',
                    'watch/video-player'
                ]).then(() => {
                    let videoId = $(e.target).attr('href');
                    initVideoPlayer(videoId);
                })
            });
        }).fail((jqhxr, settings, exception) => {});
        e.preventDefault();
    }
}