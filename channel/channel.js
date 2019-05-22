function loadChannelContent() {
    let url = window.location.search;
    let urlParams = new URLSearchParams(url);
    if (urlParams.has('id')) {
        let channelId = urlParams.getAll('id');

        document.title = `${channelId[0]} - ViewTube`;
        loadChannel(channelId[0]);
    }
}

function loadChannel(channelId) {
    $.ajax({
        type: "GET",
        url: `${baseUrl}channels/${channelId}`,
        dataType: "JSON",
        success: async function (response) {
            let html = Mustache.to_html($('.channel-panel')[0].outerHTML, response);
            let videoTemplate = await $.get(`${rootUrl}components/vt-video-entry.html`);
            $('.channel-panel').replaceWith(html);

            let channelBanner = `${proxyUrl}${response.authorBanners[0].url}`;
            let channelThmb = `${proxyUrl}${response.authorThumbnails[1].url}`;
            let subCountString = `${numberWithSeparators(response.subCount)} subscribers`;
            let viewCountString = `${numberWithSeparators(response.totalViews)} total views`;

            $('#channel-banner-image').attr('src', channelBanner);
            $('#channel-thmb-image').attr('src', channelThmb);
            $('.channel-info-subcount').text(subCountString);
            $('.channel-info-viewcount').text(viewCountString);

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
                $(searchResultEntry).find('.video-entry-channel').attr('href', channelUrl);
                $(searchResultEntry).find('.video-entry-views').text(viewCountString);
                $(searchResultEntry).find('.video-entry-length').text(videoLength);
            });

            $('.spinner').addClass('invisible');
        }
    });
}