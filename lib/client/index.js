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
var omgwtf = ripple('omgwtf'),
    db = ripple('db'),
    xhr = ripple('xhr'),
    geo = ripple('geo'),
    fs = ripple('fs'),
    platform = ripple('platform'),
    emulatorBridge = ripple('emulatorBridge'),
    devices = ripple('devices'),
    widgetConfig = ripple('widgetConfig'),
    deviceSettings = ripple('deviceSettings'),
    ui = ripple('ui'),
    appcache = ripple('appcache'),
    _self;

function checkForRepeatReload() {
    //some pages try to break out of our iFrame, causing an infinit loop
    //This handles that scenario gracefully

    var time = new Date().getTime(),
        lastLoad = JSON.parse(window.localStorage['ripple-last-load'] || null) || {time: time, counter: 0};

    if (time - lastLoad.time < 3000) {
        if (lastLoad.counter >= 3) {
            window.onbeforeunload = function () {
                return "Looks like the page you're on is trying to break out of an iFram. To stop this behaviour, click 'stay on this page'. To continue, click 'leave this page'.";
            };
            lastLoad = {time: time, counter: 0};
        }
        else {
            lastLoad = {time: time, counter: lastLoad.counter + 1};
        }
    }
    else {
        lastLoad = {time: time, counter: 0};
    }

    window.localStorage['ripple-last-load'] = JSON.stringify(lastLoad);
}

_self = {
    boot: function (booted) {

        // TODO: this should not be here (instead, in a UI module).
        window.addEventListener("keydown", function (event) {
            var hasMetaOrAltPressed = (event.metaKey || event.ctrlKey),
                key = parseInt(event.keyCode, 10);

            if (key === 37 && hasMetaOrAltPressed) { // cmd/ctrl + left arrow
                event.preventDefault();
                emulatorBridge.window().history.back();
            }

            if (key === 39 && hasMetaOrAltPressed) { // cmd/ctrl + right arrow
                event.preventDefault();
                emulatorBridge.window().history.forward();
            }

            if (key === 82 && hasMetaOrAltPressed) { // cmd/ctrl + r
                event.preventDefault();
                emulatorBridge.window().location.reload();
            }

            if (key === 116) { // F5
                event.preventDefault();
                emulatorBridge.window().location.reload();
            }
        });

        checkForRepeatReload();

        jWorkflow.order(omgwtf.initialize, omgwtf)
             .andThen(appcache.initialize, appcache)
             .andThen(db.initialize, db)
             .andThen(xhr.initialize, xhr)
             .andThen(geo.initialize, geo)
             .andThen(fs.initialize, fs)
             .andThen(platform.initialize, platform)
             .andThen(devices.initialize, devices)
             .andThen(widgetConfig.initialize, widgetConfig)
             .andThen(deviceSettings.initialize, deviceSettings)
             .andThen(ui.initialize, ui)
             .start(booted);
    }
};

module.exports = _self;
