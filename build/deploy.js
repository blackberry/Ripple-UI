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
var test = require('./test'),
    lint = require('./lint'),
    build = require('./build'),
    sys = require('sys'),
    fs = require('fs'),
    fail = fs.readFileSync(__dirname + "/../thirdparty/fail.txt", "utf-8");

function ok(code) {
    if (code || code === 1) {
        sys.puts(fail);
        process.exit(1);
    }
}

module.exports = function () {
    test(function (code) {
        ok(code, "red tests");
        lint(function (code) {
            ok(code);
            build(null, {compress: true});
        });
    });
};
