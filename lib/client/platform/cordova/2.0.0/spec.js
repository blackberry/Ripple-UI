function loadWebworks(win, device) {
    var builder = ripple('platform/builder'),
        platform = "handset",
        webworks;

    switch (device.id) {
    case "Playbook":
        platform = "tablet/2.0.0";
        break;
    case "Z10":
    case "Q10":
        platform = "bb10/1.0.0";
        break;
    default:
        platform = "handset/2.0.0";
        break;
    }

    webworks = ripple('platform/webworks.' + platform + '/spec');

    builder.build(webworks.objects).into(win);
    builder.build(webworks.objects).into(window);
}

module.exports = {
    id: "cordova",
    version: "2.0.0",
    name: "Apache Cordova",
    type: "platform",
    nativeMethods: {},

    config: ripple('platform/cordova/2.0.0/spec/config'),
    device: ripple('platform/cordova/2.0.0/spec/device'),
    ui: ripple('platform/cordova/2.0.0/spec/ui'),
    events: ripple('platform/cordova/2.0.0/spec/events'),

    initialize: function (win) {
        var honeypot = ripple('honeypot'),
            devices = ripple('devices'),
            device = devices.getCurrentDevice(),
            bridge = ripple('platform/cordova/2.0.0/bridge'),
            cordova,
            topCordova = window.top.ripple('platform/cordova/2.0.0/spec'),
            get = function () {
                return cordova;
            },
            set = function (orig) {
                if (cordova) {
                    return;
                }

                cordova = orig;

                cordova.define.remove("cordova/exec");
                cordova.define("cordova/exec", function (require, exports, module) {
                    module.exports = bridge.exec;
                });

                cordova.UsePolling = true;

                //do nothing here as we will just call the callbacks ourselves
                cordova.define.remove("cordova/plugin/android/polling");
                cordova.define("cordova/plugin/android/polling", function (require, exports, module) {
                    module.exports = function () {};
                });

                var builder = cordova.require('cordova/builder'),
                    allTheThings = win,
                    base = cordova.require('cordova/common'),
                    iosPlugin;

                //HACK: Overwrite all the things, handles when cordova.js executes before we start booting
                if (builder.build) {
                    builder.build(base.objects).intoAndClobber(allTheThings);
                } else {
                    //Support for cordova 2.3 and onward
                    builder.buildIntoAndClobber(base.objects, allTheThings);
                }
                cordova.require('cordova/channel').onNativeReady.fire();
                //  DIRTY HACK: once cordova is cleaned up, we do not
                //  need this.
                // reference issue: https://issues.apache.org/jira/browse/CB-1013
                try {
                    iosPlugin = cordova.require('cordova/plugin/ios/device');
                    bridge.exec(function (info) {
                        iosPlugin.setInfo(info);
                    }, null, 'Device', 'getDeviceInfo', []);
                } catch (e) {
                    cordova.require('cordova/channel').onCordovaInfoReady.fire();
                }
            };

        if (window.FileReader && !topCordova.nativeMethods.FileReader) {
            topCordova.nativeMethods.FileReader = window.FileReader;
        }

        if (device.manufacturer === "BlackBerry") {
            loadWebworks(win, device);
        }

        honeypot.monitor(win, "cordova").andRun(get, set);
    },

    objects: {
        MediaError: {
            path: "cordova/2.0.0/MediaError"
        },
        Acceleration: {
            path: "w3c/1.0/Acceleration"
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
        org: {
            children: {
                apache: {
                    children: {
                        cordova: {
                            children: {
                                Logger: {
                                    path: "cordova/2.0.0/logger"
                                },
                                JavaPluginManager: {
                                    path: "cordova/2.0.0/JavaPluginManager"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
