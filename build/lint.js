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
var childProcess = require('child_process'),
    sys = require('sys'),
    fs = require('fs');

function _spawn(proc, args, done) {
    var cmd = childProcess.spawn(proc, args);
    cmd.stdout.on('data', sys.print);
    cmd.stderr.on('data', sys.print);
    if (done) {
        cmd.on('exit', done);
    }
}

function _lintJS(files, done) {
    var options = ["--reporter", "build/lint/reporter.js", "--show-non-errors"];
    _spawn('jshint', files.concat(options), done);
}

function _lintCSS(files, done) {
    var rules = JSON.parse(fs.readFileSync(__dirname + "/../.csslintrc", "utf-8")),
        options = ["--rules=" + rules, "--format=compact"];
    _spawn('csslint', files.concat(options), done);
}

module.exports = function (done, files) {
    var cssDirs = ["ext/assets/ripple.css", "ext/chromium/styles", "lib", "test"];
    _lintJS(files && files.length > 0 ? files : ["."], function () {
        _lintCSS(files && files.length > 0 ? files : cssDirs, done);
    });
};
