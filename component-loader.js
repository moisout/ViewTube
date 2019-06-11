function loadComponents(components) {
    return new Promise((resolve, reject) => {
        components.forEach(async (element, index) => {
            const component = await getComponent(element);
            $(element).replaceWith(component);
            if (index === components.length) {
                resolve(true);
            }
        });
    });
}

function getComponent(name) {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem(name) !== null) {
            console.log('cached');
            resolve(localStorage.getItem(name));
        }
        $.ajax({
            type: "GET",
            url: `${rootUrl}components/${name}.html`,
            dataType: "html"
        }).done((response) => {
            localStorage.setItem(name, response);
            resolve(response);
        }).fail((jqhxr, settings, exception) => {
            reject(exception);
        });
    });
}