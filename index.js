function loadTopVideos() {

    apiRequest({
        url: 'top',
        data: {
            fields: 'title,videoId,videoThumbnails,lengthSeconds,viewCount,author,authorId,publishedText'
        }
    }).then(async response => {
        let template = await getComponent('vt-video-entry');
        response.forEach(element => {
            let html = Mustache.to_html(template, element);
            let imgSrc = `${proxyUrl}${element.videoThumbnails[4].url}`;
            let linkUrl = `watch?v=${element.videoId}`;
            let channelUrl = `${rootUrl}channel?id=${element.authorId}`;
            let viewCountString = `${numberWithSeparators(element.viewCount)} views`;
            let videoLength = formattedTime(element.lengthSeconds);

            let videoEntry = $(html).appendTo('.video-list-container');
            $(videoEntry).find('.video-entry-thmb-image').attr('src', imgSrc);
            $(videoEntry).find('.video-entry-thmb').attr('href', linkUrl);
            $(videoEntry).find('.video-entry-title').attr('href', linkUrl);
            $(videoEntry).find('.video-entry-channel').attr('href', channelUrl);
            $(videoEntry).find('.video-entry-views').text(viewCountString);
            $(videoEntry).find('.video-entry-length').text(videoLength);
        });
        onSiteLoaded();
        $('.spinner').hide();
    }, async error => {
        await showLoadingError();

        onSiteLoaded();
    });
}