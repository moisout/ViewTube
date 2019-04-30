$(function () {
    initTheme();
    loadTopVideos();

    $('#theme-change').on('click', function () {
        toggleTheme();
    });
});