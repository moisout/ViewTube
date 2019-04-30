let baseUrl = 'https://invidio.us/api/v1/';
let defaultRegion = 'US';

function loadTopVideos() {
    $.ajax({
        type: "GET",
        url: `${baseUrl}top`,
        dataType: "JSON",
        success: function (response) {
            let template = $('.video-entry-template').html();

            response.forEach(element => {
                let html = Mustache.to_html(template, element);
                let imgSrc = element.videoThumbnails[4].url;
                let linkUrl = `watch?v=${element.videoId}`;
                let channelUrl = element.authorUrl;
                let viewCountString = `${numberWithSeparators(element.viewCount)} Views`;
                let videoLength = formattedTime(element.lengthSeconds);

                let videoEntry = $(html).appendTo('.video-list-container');
                $(videoEntry).find('.video-entry-thmb-image').attr('src', imgSrc);
                $(videoEntry).find('.video-entry-thmb').attr('href', linkUrl);
                $(videoEntry).find('.video-entry-title').attr('href', linkUrl);
                $(videoEntry).find('.video-entry-channel').attr('href', channelUrl);
                $(videoEntry).find('.video-entry-views').text(viewCountString);
                $(videoEntry).find('.video-entry-length').text(videoLength);
            });
        }
    });
}

function initTheme(){
    if(Cookies.get('theme') == undefined){
        Cookies.set('theme', 'light-theme', {expires: 365});
    }
    else{
        $('html').removeClass();
        $('html').addClass(Cookies.get('theme'));
    }
}

function toggleTheme() {
    if ($('html').hasClass('light-theme')) {
        $('html').removeClass('light-theme');
        $('html').addClass('dark-theme');
        Cookies.set('theme', 'dark-theme', { expires: 365 });
    } else if($('html').hasClass('dark-theme')){
        $('html').removeClass('dark-theme');
        $('html').addClass('light-theme');
        Cookies.set('theme', 'light-theme', { expires: 365 });
    }
}

function numberWithSeparators(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formattedTime(seconds){
    let ms = seconds * 1000;
    let date = new Date(ms);
    if(date.getHours() - 1 > 0){
        return `${date.getHours() - 1}:${date.getMinutes()}:${addZero(date.getSeconds())}`;
    }
    else{
        return `${date.getMinutes()}:${addZero(date.getSeconds())}`;
    }
}

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }