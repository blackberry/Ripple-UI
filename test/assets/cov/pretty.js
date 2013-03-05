window.addEventListener('load', function () {
    var filedata = [];

    function asc(a, b) {
        return a.h1.innerHTML < b.h1.innerHTML ? -1 :
            (a.h1.innerHTML > b.h1.innerHTML ? 1 : 0);
    }

    Array.prototype.forEach
        .call(document.querySelectorAll('h1'), function (el) {
            filedata.push({
                h1: el,
                // This is pretty hacky.. might break at some point
                pre: el.nextSibling.nodeName === "#text" ?
                    el.nextSibling.nextSibling : el.nextSibling
            });
        });

    filedata = filedata.sort(asc);

    filedata.forEach(function (el) {
        var frag = document.createDocumentFragment();

        frag.appendChild(el.h1);
        frag.appendChild(el.pre);

        document.body.appendChild(frag);
    });

    setTimeout(function () {
        filedata.forEach(function (el) {
            el.h1.addEventListener('click', function () {
                var klass = el.pre.getAttribute('class') !== 'viewable' ? 'viewable' : '';
                el.pre.setAttribute('class', klass);
            });
        });

        document.body.setAttribute("style", "display: block;");
    }, 100);
});
