function loadWebworks(win, device) {
    var builder = require('ripple/platform/builder'),
        platform = device.id === "Playbook" || device.id === "Colt" ? "tablet" : "handset",
        webworks = require('ripple/platform/webworks.' + platform + '/2.0.0/spec');

    builder.build(webworks.objects).into(win);
    builder.build(webworks.objects).into(window);
}

module.exports = {
    id: "cordova",
    version: "2.0.0",
    name: "Apache Cordova",
    type: "platform",
    nativeMethods: {},

    config: require('ripple/platform/cordova/2.0.0/spec/config'),
    device: require('ripple/platform/cordova/2.0.0/spec/device'),
    ui: require('ripple/platform/cordova/2.0.0/spec/ui'),
    events: require('ripple/platform/cordova/2.0.0/spec/events'),

    initialize: function (win) {
        var honeypot = require('ripple/honeypot'),
            devices = require('ripple/devices'),
            device = devices.getCurrentDevice(),
            bridge = require('ripple/platform/cordova/2.0.0/bridge'),
            cordova,
            topCordova = window.top.require('ripple/platform/cordova/2.0.0/spec'),
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
                    allTheThings = window,
                    base = cordova.require('cordova/common'),
                    iosPlugin;

                //HACK: Overwrite all the things, handles when cordova.js executes before we start booting
                builder.build(base.objects).intoAndClobber(allTheThings);
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

        if (device.manufacturer === "Research In Motion") {
            loadWebworks(win, device);
        }

        honeypot.monitor(win, "cordova").andRun(get, set);
    },

    objects: {
        MediaError: {
            path: "cordova/2.0.0/MediaError"
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
