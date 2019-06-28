function loadChannelContent() {
    let url = window.location.search;
    let urlParams = new URLSearchParams(url);
    if (urlParams.has('id')) {
        let channelId = urlParams.getAll('id');

        loadChannel(channelId[0]);
    }
}

function loadChannel(channelId) {
    apiRequest({
        url: `channels/${channelId}`,
        data: {
            fields: 'author,authorId,authorBanners,authorThumbnails,subCount,totalViews,joined,descriptionHtml,latestVideos'
        },
    }).then(async response => {
        let html = Mustache.to_html($('.channel-panel')[0].outerHTML, response);
        let videoTemplate = await $.get(`${rootUrl}components/vt-video-entry.html`);
        $('.channel-panel').replaceWith(html);

        let channelBanner = `${proxyUrl}${response.authorBanners[0].url}`;
        let channelThmb = `${proxyUrl}${response.authorThumbnails[1].url}`;
        let subCountString = `${numberWithSeparators(response.subCount)} subscribers`;
        let viewCountString = `${numberWithSeparators(response.totalViews)} total views`;
        let descriptionHtml = response.descriptionHtml;

        $('#channel-banner-image').css('background-image', `url(${channelBanner})`);
        $('#channel-thmb-image').attr('src', channelThmb);
        $('.channel-info-subcount').text(subCountString);
        $('.channel-info-viewcount').text(viewCountString);
        $('.channel-description').html(descriptionHtml);
        document.title = `${response.author} - ViewTube`;

        response.latestVideos.forEach((element, index) => {
            let videoHtml = Mustache.to_html(videoTemplate, element);

            let imgSrc = `${proxyUrl}${element.videoThumbnails[4].url}`;
            let linkUrl = `${rootUrl}watch?v=${element.videoId}`;
            let channelUrl = `${rootUrl}channel?id=${element.authorId}`;
            let viewCountString = `${numberWithSeparators(element.viewCount)} Views`;
            let videoLength = formattedTime(element.lengthSeconds);

            let searchResultEntry = $(videoHtml).appendTo('.channel-videos-container');

            $(searchResultEntry).find('.video-entry-thmb-image').attr('src', imgSrc);
            $(searchResultEntry).find('.video-entry-thmb').attr('href', linkUrl);
            $(searchResultEntry).find('.video-entry-title').attr('href', linkUrl);
            $(searchResultEntry).find('.video-entry-channel').css('display', 'none');
            $(searchResultEntry).find('.video-entry-views').text(viewCountString);
            $(searchResultEntry).find('.video-entry-length').text(videoLength);
        });

        $('.loader-buffer').removeClass('buffering');
        $('.channel-panel').removeClass('loading');

        await loadShowMore('.channel-description');

        onSiteLoaded();
    }, async error => {
        await showLoadingError();

        onSiteLoaded();
    });
}