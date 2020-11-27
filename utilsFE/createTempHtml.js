export function createTempHtml (data) {
    var newHTMLDocument = document.implementation.createHTMLDocument('temp');
    var el = newHTMLDocument.createElement('div')
    el.innerHTML = data;
    return el
}