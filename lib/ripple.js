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
    accelerometer = require('ripple/accelerometer'),
    geo = require('ripple/geo'),
    fileSystem = require('ripple/fileSystem'),
    platform = require('ripple/platform'),
    builder = require('ripple/platform/builder'),
    devices = require('ripple/devices'),
    widgetConfig = require('ripple/widgetConfig'),
    deviceSettings = require('ripple/deviceSettings'),
    ui = require('ripple/ui'),
    _self = {
        boot: function (booted) {
            jWorkflow.order(omgwtf.initialize, omgwtf)
                 .andThen(db.initialize, db)
                 .andThen(xhr.initialize, xhr)
                 .andThen(accelerometer.initialize, accelerometer)
                 .andThen(geo.initialize, geo)
                 .andThen(fileSystem.initialize, fileSystem)
                 .andThen(devices.initialize, devices)
                 .andThen(platform.initialize, platform)
                 .andThen(widgetConfig.initialize, widgetConfig)
                 .andThen(deviceSettings.initialize, deviceSettings)
                 .andThen(ui.initialize, ui)
                 .start(booted);
        }
    };

module.exports = _self;
