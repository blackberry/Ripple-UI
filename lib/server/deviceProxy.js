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
            device,
            device_name;

        if (!options) { options = {}; }
        if (!options.port) { options.port = conf.ports.proxy; }
        if (!connection) { connection = server.start(options); }

        app = connection.app;
        io = connection.io;

        io.sockets.on('connection', function (socket) {
            socket.on('set-role', function(role) {
                if (role == 'ripple') {
                    console.log('Ripple for Proxy Connected');
                    ripple = socket;
                    ripple.on('disconnect', function() {
                        console.log('Ripple for Proxy Disconnected');
                    });
                }
                if (device === undefined && role.role === 'device') {
                    device = socket;
                    device_name = role.name;
                    console.log('Device for Proxy Connected: ' + device_name);
                    device.on('disconnect', function() {
                        console.log('Device for Proxy Disconnected');
                        if (ripple) ripple.emit('device-disconnected');
                    });
                }
                if (ripple && device) {
                    ripple.emit('ready', device_name);
                    ripple.on('proxyReq', function (data) {
                        device.emit("exec", {
                           service: data.service,
                           action: data.action,
                           args: data.args
                        }, function(result) {
                            //console.log('got a result from device');
                            ripple.emit('proxyResp', {
                                id: data.id,
                                win: result.win,
                                args: result.args
                            });
                        });
                    });
                }
            });
        });

        console.log("INFO:".green + " Ripple socket services running on: " +
            ("http://localhost:" + connection.port).cyan);

        console.log("INFO:".green + " to connect the Ripple Companion app use this URL: " +
            ("http://localhost:" + connection.port).cyan);
    }
};
