function loadSearchResultPage() {
    let url = window.location.search;
    let urlParams = new URLSearchParams(url);
    if (urlParams.has('search_query')) {
        let searchString = urlParams.getAll('search_query');

        $('#search').val(searchString[0]);
        document.title = `${searchString[0]} - ViewTube`;
        let searchParamManager = new SearchParamManager(urlParams);
        let params = searchParamManager.getUrlParams();
        loadSearchResults(params);
    }
}

function SearchParamManager(urlParams) {
    this.urlParams = urlParams;
    this.paramOptions = {
        sort_by: ["relevance", "rating", "upload_date", "view_count"],
        date: ["hour", "today", "week", "month", "year"],
        duration: ["short", "long"],
        type: ["video", "playlist", "channel", "all"],
        features: ["hd", "subtitles", "creative_commons", "3d", "live", "purchased", "4k", "360", "location", "hdr"],
        region: "US",
    }
    this.defaultParams = {
        sort_by: "relevance",
        type: "all",
        region: "US",
    }

    this.getUrlParams = function () {
        let params = this.defaultParams;
        params.q = this.urlParams.getAll('search_query')[0];
        if (urlParams.has('page')) {
            params.page = urlParams.getAll('page')[0];
        } else {
            params.page = 0;
        }

        return params;
    }
}

function loadSearchResults(params) {
    params.fields = 'type,title,videoId,author,authorId,videoThumbnails,viewCount,publishedText,lengthSeconds,videoCount,videos,authorThumbnails,subCount,videoCount'
    $.ajax({
        type: "GET",
        url: `${baseUrl}search`,
        dataType: "JSON",
        data: params,
        success: async function (response) {
            let videoTemplate = await $.get(`${rootUrl}components/vt-video-entry.html`);
            let channelTemplate = await $.get(`${rootUrl}components/vt-channel-entry.html`);
            let playlistTemplate = await $.get(`${rootUrl}components/vt-playlist-entry.html`);

            response.forEach(element => {
                if (element.type === 'video') {
                    let html = Mustache.to_html(videoTemplate, element);

                    let imgSrc = `${proxyUrl}${element.videoThumbnails[4].url}`;
                    let linkUrl = `${rootUrl}watch?v=${element.videoId}`;
                    let channelUrl = `${rootUrl}channel?id=${element.authorId}`;
                    let viewCountString = `${numberWithSeparators(element.viewCount)} Views`;
                    let videoLength = formattedTime(element.lengthSeconds);

                    let searchResultEntry = $(html).appendTo('.results-panel');

                    $(searchResultEntry).find('.video-entry-thmb-image').attr('src', imgSrc);
                    $(searchResultEntry).find('.video-entry-thmb').attr('href', linkUrl);
                    $(searchResultEntry).find('.video-entry-title').attr('href', linkUrl);
                    $(searchResultEntry).find('.video-entry-channel').attr('href', channelUrl);
                    $(searchResultEntry).find('.video-entry-views').text(viewCountString);
                    $(searchResultEntry).find('.video-entry-length').text(videoLength);

                } else if (element.type === 'playlist') {
                    let html = Mustache.to_html(playlistTemplate, element);

                    let imgSrc = `${proxyUrl}${element.videos[0].videoThumbnails[4].url}`;
                    let linkUrl = `${rootUrl}watch?v=${element.videos[0].videoId}&list=${element.playlistId}`;
                    let channelUrl = `${rootUrl}channel?id=${element.authorId}`;

                    let searchResultEntry = $(html).appendTo('.results-panel');

                    $(searchResultEntry).find('.playlist-entry-thmb-image').attr('src', imgSrc);
                    $(searchResultEntry).find('.playlist-entry-thmb').attr('href', linkUrl);
                    $(searchResultEntry).find('.playlist-entry-title').attr('href', linkUrl);
                    $(searchResultEntry).find('.playlist-entry-channel').attr('href', channelUrl);

                } else if (element.type === 'channel') {
                    let html = Mustache.to_html(channelTemplate, element);

                    let imgSrc = `${proxyUrl}${element.authorThumbnails[4].url}`;
                    let linkUrl = `${rootUrl}channel?id=${element.authorId}`;
                    let subCountString = `${numberWithSeparators(element.subCount)} subscribers`;

                    let searchResultEntry = $(html).appendTo('.results-panel');

                    $(searchResultEntry).find('.channel-entry-thmb-image').attr('src', imgSrc);
                    $(searchResultEntry).find('.channel-entry-thmb').attr('href', linkUrl);
                    $(searchResultEntry).find('.channel-entry-title').attr('href', linkUrl);
                    $(searchResultEntry).find('.channel-entry-subcount').text(subCountString);

                }
            });
            initTooltips();
        }
    });
}