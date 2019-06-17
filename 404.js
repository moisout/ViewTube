function initErrorPage() {
    $('.loading-retry-btn').on('click', (e) => {
        window.location.reload();
        e.preventDefault();
    });
    onSiteLoaded();
}