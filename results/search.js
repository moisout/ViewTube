function loadSearchResultPage() {
    let url = window.location.search;
    let urlParams = new URLSearchParams(url);
    if (urlParams.has('search_query')) {
        let searchString = urlParams.getAll('search_query');

        toggleSearch(true);

        console.log(searchString);
        $('#search').val(searchString);
    }

    function loadSearchResults() {
        $.ajax({
            type: "GET",
            url: `${baseUrl}top`,
            dataType: "JSON",
            success: function (response) {
                $.get(`${rootUrl}components/vt-video-entry.html`, function (template) {
                    response.forEach(element => {
                        
                    });
                });
            }
        });
    }
}