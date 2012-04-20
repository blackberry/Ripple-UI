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
        var honeypot = require("ripple/honeypot"),
            bridge = require("ripple/platform/cordova/1.6/bridge"),
            cordova;

        win._nativeReady = true;

        honeypot.monitor(win, "cordova").andRun(function () {
            return cordova;
        },
        function (orig) {
            if (cordova) {
                return cordova;
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
                module.exports = function () {}
            });
        });
    },

    objects: {}
};
