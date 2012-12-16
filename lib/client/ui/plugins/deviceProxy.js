/*
 *  Copyright 2012 Research In Motion Limited.
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

var RIPPLE_URL = "device-proxy-ripple-url",
    DEVICE_URL = "device-proxy-device-url",
    ready = false,
    utils = ripple('utils'),
    db = ripple('db'),
    serviceURL = db.retrieve(RIPPLE_URL) || "http://localhost:4400",
    socket;

function el(id) {
    return document.getElementById(id);
}

function show(id) {
    utils.forEach(el(id).parentNode.children, function (element) {
        if (element.id === id) {
            element.style.display = "block";
        }
        else {
            if (element.nodeType === 1) {
                element.style.display = "none";
            }
        }
    });
}

function connect() {
    var script = document.createElement("script");

    script.setAttribute("src", serviceURL + "/socket.io/socket.io.js");
    script.onerror = function () {
        show("device-proxy-error");
    };
    script.onload = function () {
        socket = window.io.connect(serviceURL);
        socket.on("connect", function () {
            show("device-proxy-device-not-connected");
            socket.emit("set-role", "ripple");
            socket.on("ready", function (device) {
                ready = true;
                show("device-proxy-device-connected");
                el("device-proxy-connected-device").innerHTML = device;
            });
            socket.on("device-disconnected", function () {
                show("device-proxy-device-not-connected");
            });
        });
        socket.on("disconnect", function () {
            show("device-proxy-error");
        });
    };

    document.body.appendChild(script);
}
module.exports = {
    panel: {
        domId: "device-proxy-container",
        collapsed: true,
        pane: "left"
    },

    initialize: function () {
        var deviceURLSetting = el(DEVICE_URL),
            rippleURLSetting = el(RIPPLE_URL);

        deviceURLSetting.innerHTML = serviceURL;
        rippleURLSetting.value = serviceURL;

        utils.bindAutoSaveEvent(serviceURL, function () {
            serviceURL = rippleURLSetting.value;
            db.save(RIPPLE_URL, serviceURL);
        });

        connect();
    },

    exec: function (success, fail, service, action, args) {
        socket.emit('proxyReq', {
            service: service,
            action: action,
            args: args
        }, function (result) {
            if (result.win) {
                success.apply(null, result.args);
            }
            else {
                fail.apply(null, result.args);
            }
        });
    },

    hasConnectedDevice: function () {
        return ready;
    }
};
