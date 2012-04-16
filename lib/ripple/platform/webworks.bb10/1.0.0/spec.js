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
    version: "2.0.0",
    name: "WebWorks-BlackBerry 10",

    persistencePrefix: "rim-bb10-",

    ui: require('ripple/platform/webworks.bb10/1.0.0/spec/ui'),
    device: require('ripple/platform/webworks.bb10/1.0.0/spec/device'),
    config: require('ripple/platform/webworks.core/2.0.0/spec/config'),
    events: require('ripple/platform/webworks.bb10/1.0.0/spec/events'),

    initialize: function () {
        var event = require('ripple/event'),
            _console = require('ripple/console'),
            emulatorBridge = require('ripple/emulatorBridge');

        event.on("TinyHipposLoaded", function () {
            var doc = emulatorBridge.document(),
                evt = doc.createEvent("Events");
            evt.initEvent("deviceready", true, true);
            doc.dispatchEvent(evt);
            _console.log("fired deviceready event!");
        });
    },

    objects: {
        XMLHttpRequest: {
            path: "webworks.bb10/1.0.0/XMLHttpRequest"
        },
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
            path: "w3c/1.0/navigator",
            children: {
                geolocation: {
                    path: "w3c/1.0/geolocation"
                }
            }
        },
        blackberry: {
            children: {
                transport: {
                    path: "webworks.core/2.0.0/client/transport"
                },
                events: {
                    path: "webworks.core/2.0.0/client/events"
                },
                app: {
                    path: "webworks.bb10/1.0.0/client/app",
                    feature: "blackberry.app",
                    children: {
                        event: {
                            path: "webworks.bb10/1.0.0/client/appEvent",
                            feature: "blackberry.app.event"
                        }
                    }
                },
                invoke: {
                    path: "webworks.bb10/1.0.0/client/invoke",
                    feature: "blackberry.invoke",
                    children: {
                        BrowserArguments: {
                            path: "webworks.bb10/1.0.0/client/BrowserArguments",
                            feature: "blackberry.invoke.BrowserArguments"
                        }
                    }
                },
                identity: {
                    path: "webworks.bb10/1.0.0/client/identity",
                    feature: "blackberry.identity"
                },
                system: {
                    path: "webworks.bb10/1.0.0/client/system",
                    children: {
                        event: {
                            path: "webworks.bb10/1.0.0/client/systemEvent"
                        }
                    }
                }
            }
        }
    }
};
