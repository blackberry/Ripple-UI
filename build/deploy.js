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
var lint = require('./lint'),
    build = require('./build'),
    childProcess = require('child_process'),
    fs = require('fs'),
    fail = fs.readFileSync(__dirname + "/../thirdparty/fail.txt", "utf-8");

function ok(code) {
    if (code || code === 1) {
        process.stdout.write(fail);
        process.exit(1);
    }
}

function test(callback) {
    var env = process.env,
        lib = process.cwd() + '/lib',
        script = process.cwd() + '/build/scripts/runTestsInNode',
        child;

    env.NODE_PATH = lib;
    child = childProcess.spawn(process.execPath, [script], {'env': env});

    function log(data) {
        process.stdout.write(new Buffer(data).toString('utf-8'));
    }

    child.stdout.on('data', log);
    child.stderr.on('data', log);
    child.on('exit', function (code) {
        callback(code);
    });
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
