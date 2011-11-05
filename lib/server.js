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
var connect = require('connect');

module.exports = {
    boot: function (opts) {
        opts = opts || {};

        var port = opts.port || process.env.PORT || 4040;

        // TODO: support app cache (https://github.com/podviaznikov/connect-app-cache)
        connect(
            connect.static(__dirname + '/../pkg/web'),
            connect.router(function (app) {
                app.get('/', function (req, res, next) {
                    res.writeHead(200, {"Location": "index.html"});
                    res.end();
                });
            })
        ).listen(port, function () {
            process.stdout.write('listening on: http://127.0.0.1:' + port + '\n');
        });
    }
};
