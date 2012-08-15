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
var omgwtf = require('ripple/omgwtf'),
    db = require('ripple/db'),
    xhr = require('ripple/xhr'),
    geo = require('ripple/geo'),
    fs = require('ripple/fs'),
    platform = require('ripple/platform'),
    emulatorBridge = require('ripple/emulatorBridge'),
    devices = require('ripple/devices'),
    widgetConfig = require('ripple/widgetConfig'),
    deviceSettings = require('ripple/deviceSettings'),
    ui = require('ripple/ui'),
    appcache = require('ripple/appcache'),
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
                    window.tinyHipposReload = true;
                    emulatorBridge.window().location.reload();
                }

                if (key === 116) { // F5
                    event.preventDefault();
                    window.tinyHipposReload = true;
                    emulatorBridge.window().location.reload();
                }
            });

            // TODO: this should be somewhere else (such as ripple/bootstrap).
            window.onbeforeunload = function () {
                if (!window.tinyHipposReload) {
                    return "Are you sure you want to exit Ripple?";
                }
            };

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
