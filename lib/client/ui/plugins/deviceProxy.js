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

var ready = false,
    socket;

module.exports = {
    panel: {
        domId: "device-proxy-container",
        collapsed: true,
        pane: "left"
    },

    initialize: function () {
        var script = document.createElement("script");

        script.setAttribute("src", location.origin + "/socket.io/socket.io.js");
        script.onerror = function () {
            fail();
        };
        script.onload = function () {
            socket = io.connect(location.origin);
            socket.on("connect", function () {
                socket.emit("set-role", "ripple");
                socket.on("ready", function (device) {
                    ready = true;
                    document.getElementById("device-proxy-connected").innerHtml = device;
                });
            });
        };
        

        document.body.appendChild(script);
        
        document.getElementById("device-proxy-connect").addEventListener("click", function () {
            //do stuff
        });
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
    
    isAwesome: function () {
        return ready;
    }
};
