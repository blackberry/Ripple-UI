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
var proxy = require('ripple/server/proxy'),
    server = require('ripple/server'),
    colors = require('colors'),
    express = require('express');

colors.mode = "console";

module.exports = {
    start: function (options) {
        var app = server.start(options);

        if (!options.path) { options.path = process.cwd(); }

        if (!options.route) {
            options.route = "/ripple";
        } else if (!options.route.match(/^\//)) {
            options.route = "/" + options.route;
        }

        app = proxy.start({route: options.route}, app);

        app.use(express.static(options.path));

        app.use(options.route + "/enable/", express.static(__dirname + "/www/"));

        console.log();
        console.log("INFO:".green + " Load the URL below (in Chrome) to auto-enable Ripple.");
        console.log("      " + ("http://localhost:" + app._port + options.route + "/enable/").cyan);
        console.log();

        return app;
    }
};
