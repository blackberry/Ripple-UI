function loadWebworks(win, device) {
    var builder = require('ripple/platform/builder'),
        platform = device.id === "Playbook" || device.id === "Colt" ? "tablet" : "handset",
        webworks = require('ripple/platform/webworks.' + platform + '/2.0.0/spec');

    builder.build(webworks.objects).into(win);
    builder.build(webworks.objects).into(window);
}

module.exports = {
    id: "cordova",
    version: "1.6",
    name: "Apache Cordova",
    type: "platform",

    config: require('ripple/platform/phonegap/1.0/spec/config'),
    device: require('ripple/platform/phonegap/1.0/spec/device'),
    ui: require('ripple/platform/phonegap/1.0/spec/ui'),
    events: require('ripple/platform/phonegap/1.0/spec/events'),

    initialize: function (win) {
        var honeypot = require('ripple/honeypot'),
            devices = require('ripple/devices'),
            device = devices.getCurrentDevice(),
            bridge = require('ripple/platform/cordova/1.6/bridge'),
            cordova,
            get = function () {
                return cordova;
            },
            set = function (orig) {
                if (cordova) {
                    return;
                }
                console.log("w00t");
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
            };

        if (device.manufacturer === "Research In Motion") {
            loadWebworks(win, device);
        }

        honeypot.monitor(win, "cordova").andRun(get, set);
        win._nativeReady = true;
    },

    objects: {
        org: {
            children: {
                apache: {
                    children: {
                        cordova: {
                            children: {
                                Logger: {
                                    path: "cordova/1.6/logger"
                                },
                                JavaPluginManager: {
                                    path: "cordova/1.6/JavaPluginManager"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
