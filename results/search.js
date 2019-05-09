function insertSearchQuery() {
    let url = window.location.search;
    let urlParams = new URLSearchParams(url);
    if (urlParams.has('search_query')) {
        let searchString = urlParams.getAll('search_query');

        toggleSearch(true);

        console.log(searchString);
        $('#search').val(searchString);
    }
}