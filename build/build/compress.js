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
    _c = require('./conf'),
    utils = require('./utils'),
    childProcess = require('child_process'),
    sys = require('sys'),
    fs = require('fs'),
    jWorkflow = require('jWorkflow');

module.exports = function (prev, baton) {
    var files = [],
        cmd = jWorkflow.order();

    function compress(file) {
        cmd.andThen(function (prev, baton) {
            baton.take();
            childProcess.exec('uglifyjs --overwrite ' + file, function (error, stdout, stdin) {
                if (error) {
                    sys.puts("Something bad happened. Is uglify-js installed?");
                    sys.puts(error);
                    process.exit(1);
                } else {
                    baton.pass();
                }
            });
        });
    }

    sys.puts("compressing...");
    baton.take();

    utils.collect(_c.DEPLOY, files);

    files.forEach(compress);

    cmd.start(baton.pass);
};
