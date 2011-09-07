function _fires(name, data) {
    return function () {
        var evt = document.createEvent("Events");
        evt.initEvent(name, true, false);
        document.dispatchEvent(evt);
    };
}

module.exports = {
    "deviceready": {
        callback: _fires("deviceready")
    },
    "backbutton": {
        callback: _fires("backbutton")
    },
    "menubutton": {
        callback: _fires("menubutton")
    },
    "pause": {
        callback: _fires("pause")
    },
    "resume": {
        callback: _fires("resume")
    },
    "searchbutton": {
        callback: _fires("searchbutton")
    },
    "online": {
        callback: _fires("online")
    },
    "offline": {
        callback: _fires("offline")
    }
};
