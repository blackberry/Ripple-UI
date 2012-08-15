/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var event = require('ripple/event'),
    settings = require('ripple/deviceSettings'),
    app = require('ripple/app'),
    cons = require('ripple/console'),
    utils = require('ripple/utils'),
    events = {
        batterystatus: {
            callbacks: [],
            feature: 'blackberry.system' 
        },
        batterylow: {
            callbacks: [],
            feature: 'blackberry.system'
        },
        batterycritical: {
            callbacks: [],
            feature: 'blackberry.system'
        },
        connectionchange: {
            callbacks: [],
            feature: 'blackberry.connection'
        },
        invoked: {
            callbacks: [],
            feature: 'blackberry.invoked'
        },
        swipedown: {
            callbacks: [],
            feature: 'blackberry.app'
        },
        resume: {
            callbacks: [],
            feature: 'blackberry.app'
        },
        pause: {
            callbacks: [],
            feature: 'blackberry.app'
        },
        languagechange: {
            callbacks: [],
            feature: "blackberry.system"
        },
        regionchange: {
            callbacks: [],
            feature: "blackberry.system"
        }
    };

function _apply(eventName, args) {
    events[eventName].callbacks.forEach(function (cb) {
        cb.apply(null, args);
    });
}

event.on('DeviceBatteryStateChanged', function (charging) {
    var info = {
        isPlugged: charging,
        level: parseInt(settings.retrieve('battery.level'), 10)
    };

    _apply('batterystatus', [info]);
});

event.on('DeviceBatteryLevelChanged', function (level) {
    var info = {
        isPlugged: settings.retrieve('battery.state'),
        level: parseInt(level, 10)
    };

    _apply('batterystatus', [info]);
    
    if (level === '14') {
        _apply('batterylow', [info]);
    }

    if (level === '4') {
        _apply('batterycritical', [info]);
    }
});

event.on('DeviceConnectionChanged', function (info) {
    _apply('connectionchange', [info]);
});

event.on("LanguageChanged", function (lang) {
    _apply("languagechange", [lang]);
});

event.on("RegionChanged", function (lang) {
    _apply("regionchange", [lang]);
});

event.on("AppInvoke", function (invokeInfo) {
    var invokeTargets = app.getInfo().invokeTargets;

    if (!invokeTargets) {
        cons.log("The application cannot be invoked, please add a rim:invoke-target node in config.xml");
        return;
    }

    if (invokeTargets.some(function (target) {
        return target.filter.some(function (filter) {
            return (
                (!filter.property ||
                (filter.property && filter.property[0]["@attributes"].var === "exts" && filter.property[0]["@attributes"].value.split(",").some(function (value) {
                    return invokeInfo.extension.match(value);
                })) ||
                (filter.property && filter.property[0]["@attributes"].var === "uris" && filter.property[0]["@attributes"].value.split(",").some(function (value) {
                    return invokeInfo.uri.match(value);
                }))) &&
                filter.action.some(function (action) {
                    return invokeInfo.action.match(action["#text"][0].replace("*", ""));
                }) &&
                filter["mime-type"].some(function (type) {
                    return invokeInfo.type.match(type["#text"][0].replace("*", ""));
                })
            );
        });
    })) {
        _apply('invoked', [invokeInfo]);
    }
    else {
        cons.log("Cannot invoke application, values enter to not match values in rim:invoke-target in config.xml");
    }
});

event.on('AppSwipeDown', function () {
    _apply('swipedown');
});

event.on('AppResume', function () {
    _apply('resume');
});

event.on('AppPause', function () {
    _apply('pause');
});

module.exports = {
    addEventListener: function (type, func) {
        this.removeEventListener(type, func);

        if (!app.getInfo().features || app.getInfo().features[events[type].feature]) {
            events[type].callbacks.push(func);
        }
        else {
            throw ("Cannot register a hanlder for the " + type + " event. Please add the '" + 
                  events[type].feature + "' to your config.xml.");
        }
    },

    removeEventListener: function (type, func) {
        var idx = events[type].callbacks.indexOf(func);
        if (idx >= 0) {
            delete events[type].callbacks[idx];
        }
    }
};
