if (window.top.require) {
    //HACK: make this work better and handle iframes in the app!
    window.top.require('ripple/bootstrap').inject(window, document);
    window.top.onbeforeunload = function () { 
        if (!window.top.tinyHipposReload) {
            return "Are you sure you want to exit Ripple?";
        }
    };
}
