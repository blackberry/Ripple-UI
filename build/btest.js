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
var connect = require('connect'),
    fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    _c = require('./conf'),
    pack = require('./pack');

module.exports = function () {
    var tests = [],
        html = fs.readFileSync(_c.BUILD + "btest/test.html", "utf-8"),
        doc,
        modules,
        specs,
        app = connect()
            .use(connect.static(_c.LIB))
            .use(connect.static(_c.ROOT))
            .use('/', function (req, res) {
                res.writeHead(200, {
                    "Cache-Control": "max-age=0",
                    "Content-Type": "text/html"
                });
                res.end(doc);
            });

    //HACK: Openlayers causes weird stuff with the browser runner, so lets remove it from the list until we fix it
    _c.thirdpartyIncludes = _c.thirdpartyIncludes.filter(function (filename) {
        return !filename.match(/openlayers\.js/i);
    });

    modules = pack({noclosure: true});

    utils.collect(path.join(_c.ROOT, "test", "unit", "client"), tests);

    specs = tests.reduce(function (str, file) {
        str += '<script src="' +
            file.replace(/^.*test/, "test") +
            '" type="text/javascript" charset="utf-8"></script>\n';
        return str;
    }, "");

    doc = html.replace(/<!-- SPECS -->/g, specs).replace(/##FILES##/g, modules.js);

    app.listen(3000);

    process.stdout.write("Test Server running on:");
    process.stdout.write("http://127.0.0.1:3000");
};
