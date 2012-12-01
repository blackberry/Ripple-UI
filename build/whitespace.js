/*
 * Licensed to the Apache Software Foundation (ASF
 * or more contributor license agreements.  See th
 * distributed with this work for additional infor
 * regarding copyright ownership.  The ASF license
 * to you under the Apache License, Version 2.0 (t
 * "License"); you may not use this file except in
 * with the License.  You may obtain a copy of the
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to 
 * software distributed under the License is distr
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * KIND, either express or implied.  See the Licen
 * specific language governing permissions and lim
 * under the License.
 *
 * courtesy of incubator-cordova-js
 * found here: https://github.com/apache/incubator-cordova-js/blob/master/Jakefile
 *
 * - extracted code to auto correct whitespace issues during build
 * - modified to support multiple files/directories to scan
 * - moved code into its own module with a `.fix` method
 * - small syntax changes in various places (based on project specific jshint errors)
 *
 */
var fs = require('fs'),
    path = require("path"),
    rexp_minified = new RegExp("\\.min\\.js$"),
    rexp_src = new RegExp('\\.js$'),
    _targets = ['lib'];

function forEachFile(root, cbFile, cbDone) {
    var count = 0;

    function done() {
        --count;
        if (count === 0 && cbDone) cbDone();
    }

    function scan(name) {
        ++count;

        fs.stat(name, function (err, stats) {
            if (err) cbFile(err);

            if (stats.isDirectory()) {
                fs.readdir(name, function (err, files) {
                    if (err) cbFile(err);

                    files.forEach(function (file) {
                        scan(path.join(name, file));
                    });
                    done();
                });
            } else if (stats.isFile()) {
                cbFile(null, name, stats, done);
            } else {
                done();
            }
        });
    }

    scan(root);
}

function processWhiteSpace(processor, done) {
    _targets.forEach(function (module) {
        forEachFile(module, function (err, file, stats, cbDone) {
            //if (err) throw err;
            if (rexp_minified.test(file) || !rexp_src.test(file)) {
                cbDone();
            } else {
                var src = fs.readFileSync(file, 'utf8'),
                    origsrc = src;

                // tabs -> four spaces
                if (src.indexOf('\t') >= 0) {
                    src = src.split('\t').join('    ');
                }

                // eliminate trailing white space
                src = src.replace(/ +\n/g, '\n');

                if (origsrc !== src) {
                    // write it out yo
                    processor(file, src);
                }
                cbDone();
            }
        }, done);
    });
}

module.exports = {
    fix: processWhiteSpace
};
