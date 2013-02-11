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

    id: "webworks.tablet",
    version: "2.0.0",
    name: "",

    persistencePrefix: "",

    ui: ripple('platform/webworks.tablet/2.0.0/spec/ui'),
    device: ripple('platform/webworks.tablet/2.0.0/spec/device'),
    config: ripple('platform/webworks.core/2.0.0/spec/config'),
    events: ripple('platform/webworks.tablet/2.0.0/spec/events'),

    initialize: function () {
        // techdebt (event registration timing)
        ripple('platform/webworks.core/2.0.0/fsCache');
        ripple('platform/webworks.core/2.0.0/fs').initialize();
    },

    objects: {
        XMLHttpRequest: {
            path: "webworks.tablet/2.0.0/XMLHttpRequest"
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
                    path: "webworks.tablet/2.0.0/client/app",
                    feature: "blackberry.app",
                    children: {
                        event: {
                            path: "webworks.tablet/2.0.0/client/appEvent",
                            feature: "blackberry.app.event"
                        }
                    }
                },
                invoke: {
                    path: "webworks.tablet/2.0.0/client/invoke",
                    feature: "blackberry.invoke",
                    children: {
                        BrowserArguments: {
                            path: "webworks.tablet/2.0.0/client/BrowserArguments",
                            feature: "blackberry.invoke.BrowserArguments"
                        },
                        CameraArguments: {
                            path: "webworks.tablet/2.0.0/client/CameraArguments",
                            feature: "blackberry.invoke.CameraArguments"
                        }
                    }
                },
                identity: {
                    path: "webworks.tablet/2.0.0/client/identity",
                    feature: "blackberry.identity"
                },
                system: {
                    path: "webworks.tablet/2.0.0/client/system",
                    children: {
                        event: {
                            path: "webworks.tablet/2.0.0/client/systemEvent"
                        }
                    }
                },
                ui: {
                    children: {
                        dialog: {
                            path: "webworks.core/2.0.0/client/dialog",
                            feature: "blackberry.ui.dialog"
                        }
                    }
                },
                utils: {
                    path: "webworks.core/2.0.0/client/utils",
                    feature: "blackberry.utils"
                },
                io: {
                    children: {
                        dir: {
                            path: "webworks.tablet/2.0.0/client/io/dir",
                            feature: "blackberry.io.dir"
                        },
                        file: {
                            path: "webworks.core/2.0.0/client/io/file",
                            feature: "blackberry.io.file"
                        }
                    }
                }
            }
        }
    }
};
