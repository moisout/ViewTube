async function loadFrontPage() {

    let sectionsToLoad = [{
            name: 'top'
        },
        // {
        //     name: 'trending',
        //     data: {
        //         type: 'gaming'
        //     }
        // }, {
        //     name: 'trending',
        //     data: {
        //         type: 'music'
        //     }
        // }, {
        //     name: 'trending',
        //     data: {
        //         type: 'news'
        //     }
        // }, {
        //     name: 'trending',
        //     data: {
        //         type: 'movies'
        //     }
        // }, {
        //     name: 'popular'
        // }
    ];

    await Promise.all(sectionsToLoad.map((element, index) => {
        return loadVideoSection(element.name, element.data, index);
    }));

    $('.video-list-container').sort((a, b) => {
        return parseInt(a.id.replace('video-', '')) - parseInt(b.id.replace('video-', ''));
    }).each((index, element) => {
        $(element).remove();
        $(element).appendTo('body');
    });

    $('.spinner').hide();

    $('.video-list-container').removeClass('loading');
    onSiteLoaded();
}

function loadVideoSection(section, sectionData, index) {
    return new Promise((resolve, reject) => {
        let requestData = sectionData !== undefined ? sectionData : {};
        requestData.fields = 'title,videoId,videoThumbnails,lengthSeconds,viewCount,author,authorId,publishedText';

        apiRequest({
            url: section,
            data: requestData
        }).then(async response => {
            let template = await getComponent('vt-video-entry');

            $('body').append(`<div id="video-${index}" class="video-list-container video-list-container-${index} loading"></div>`);

            let titleString = `${section}${sectionData !== undefined ? ' - ' + sectionData.type : ''}`;
            let separatorHtml = `<div class="video-section-title"><h2>${titleString}</h2>
            <span class="video-section-separator"></span></div>`;

            $(`.video-list-container-${index}`).append(separatorHtml);

            response.forEach(element => {
                let html = Mustache.to_html(template, element);
                let imgSrc = `${proxyUrl}${element.videoThumbnails[4].url}`;
                let linkUrl = `watch?v=${element.videoId}`;
                let channelUrl = `${rootUrl}channel?id=${element.authorId}`;
                let viewCountString = `${numberWithSeparators(element.viewCount)} views`;
                let videoLength = formattedTime(element.lengthSeconds);

                let videoEntry = $(html).appendTo(`.video-list-container-${index}`);
                $(videoEntry).find('.video-entry-thmb-image').attr('data-src', imgSrc);
                $(videoEntry).find('.video-entry-thmb').attr('href', linkUrl);
                $(videoEntry).find('.video-entry-thmb-image').attr('href', linkUrl);
                $(videoEntry).find('.video-entry-title').attr('href', linkUrl);
                $(videoEntry).find('.video-entry-channel').attr('href', channelUrl);
                $(videoEntry).find('.video-entry-views').text(viewCountString);
                $(videoEntry).find('.video-entry-length').text(videoLength);
            });
            resolve(true);
        }, async error => {
            await showLoadingError();
            reject(error);
        });
    });
}