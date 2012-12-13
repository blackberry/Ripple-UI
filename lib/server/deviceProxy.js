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

var server = require('./index'),
    conf = require('./conf'),
    colors = require('colors');

colors.mode = "console";

module.exports = {
    start: function (options, connection) {
        var io,
            app,
            ripple,
            device;

        if (!options) { options = {}; }
        if (!options.port) { options.port = conf.ports.proxy; }
        if (!connection) { connection = server.start(options); }

        app = connection.app;
        io = connection.io;

        io.of(options.route + '/device_proxy/ripple')
            .on('connection', function (socket) {
                ripple = socket;

                io.of(options.route + '/device_proxy/device')
                    .on('connection', function (socket) {
                        device = socket;
                    });

                socket.on("proxyReq", function (data) {
                    device.emit("exec", {
                               service: "",
                               action: "",
                               args: ""
                    });
                });
            });

        console.log("INFO:".green + " device proxy service running on: " +
            ("http://localhost:" + connection.port + options.route + "/device_proxy").cyan);
    }
};
