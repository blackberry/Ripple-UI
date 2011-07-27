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
module.exports = function (done, files) {
    var args = files && files.length > 0 ? files : ["test/", "lib/", "build/", "ext/"],
        options = ["--reporter", "build/lint/reporter.js"],
        spawn = require('child_process').spawn,
        cmd = spawn('jshint', args.concat(options)),
        sys = require('sys');

    cmd.stdout.on('data', sys.print);
    cmd.stderr.on('data', sys.print);

    if (done) {
        cmd.on('exit', done);
    }
};
