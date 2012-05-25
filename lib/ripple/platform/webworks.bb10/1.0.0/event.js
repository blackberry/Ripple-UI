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
        resume: {
            callbacks: [],
            feature: 'blackberry.app'
        },
        pause: {
            callbacks: [],
            feature: 'blackberry.app'
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

event.on('appResume', function () {
    _apply('resume');
});

event.on('appPause', function () {
    _apply('pause');
});

module.exports = {
    addEventListener: function (type, func) {
        this.removeEventListener(type, func);

        if (!app.getInfo().features || app.getInfo().features[events[type].feature]) {
            events[type].callbacks.push(func);
        }
        else {
            throw("Cannot register a hanlder for the " + type + " event. Please add the '" + 
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
