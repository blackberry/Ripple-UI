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
module.exports = {

    id: "webworks.bb10",
    version: "1.0.0",
    name: "BlackBerry 10 WebWorks",

    persistencePrefix: "rim-bb10-",

    ui: require('ripple/platform/webworks.bb10/1.0.0/spec/ui'),
    device: require('ripple/platform/webworks.bb10/1.0.0/spec/device'),
    config: require('ripple/platform/webworks.bb10/1.0.0/spec/config'),
    events: require('ripple/platform/webworks.bb10/1.0.0/spec/events'),

    initialize: function () {
        var event = require('ripple/event'),
            _console = require('ripple/console'),
            emulatorBridge = require('ripple/emulatorBridge');

        event.on("TinyHipposLoaded", function () {
            var doc = emulatorBridge.document(),
                evt = doc.createEvent("Events");
            evt.initEvent("webworksready", true, true);
            doc.dispatchEvent(evt);
            _console.log("fired webworksready event!");
        });
    },

    objects: {
        Coordinates: {
            path: "w3c/1.0/Coordinates"
        },
        Position: {
            path: "w3c/1.0/Position"
        },
        PositionError: {
            path: "w3c/1.0/PositionError"
        },
        navigator: {
            path: "webworks.bb10/1.0.0/navigator",
            children: {
                geolocation: {
                    path: "w3c/1.0/geolocation"
                }
            }
        },
        blackberry: {
            children: {
                event: {
                    path: "webworks.bb10/1.0.0/event"
                },
                app: {
                    path: "webworks.bb10/1.0.0/app",
                    feature: "blackberry.app"
                },
                invoke: {
                    path: "webworks.bb10/1.0.0/invoke",
                    feature: "blackberry.invoke"
                },
                identity: {
                    path: "webworks.bb10/1.0.0/identity",
                    feature: "blackberry.identity"
                },
                system: {
                    path: "webworks.bb10/1.0.0/system"
                },
                connection: {
                    path: "webworks.bb10/1.0.0/connection"
                },
                ui: {
                    children: {
                        dialog: {
                            path: "webworks.bb10/1.0.0/dialog",
                            feature: "blackberry.ui.dialog"
                        }
                    }
                },
            }
        }
    }
};
