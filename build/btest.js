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
module.exports = function () {
    var connect = require('connect'),
        fs = require('fs'),
        sys = require('sys'),
        utils = require('./build/utils'),
        libs = [],
        tests = [],
        app = connect(
            connect.static(__dirname + "/../lib/"),
            connect.static(__dirname + "/../"),
            connect.router(function (app) {
                app.get('/', function (req, res) {
                    res.writeHead(200, {
                        "Cache-Control": "no-cache",
                        "Content-Type": "text/html"
                    });
                    res.end(doc);
                });
            })
        ),
        html = fs.readFileSync(__dirname + "/btest/test.html", "utf-8"),
        doc, modules, specs;

    utils.collect(__dirname + "/../lib", libs);
    utils.collect(__dirname + "/../test", tests);

    modules = libs.reduce(function (str, file) {
        str += '"' + file.replace(/^.*lib\//, "").replace(/\.js$/, "") + '",\n';
        return str;
    }, "").replace(/\,\n$/g, "\n");

    specs = tests.reduce(function (str, file) {
        str += '<script src="' +
            file.replace(/^.*test/, "test") +
            '" type="text/javascript" charset="utf-8"></script>\n';
        return str;
    }, "");

    doc = html.replace(/<!-- SPECS -->/g, specs).replace(/"##FILES##"/g, modules);

    app.listen(3000);

    sys.puts("Test Server running on:");
    sys.puts("http://127.0.0.1:3000");
};
