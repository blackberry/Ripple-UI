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
var childProcess = require('child_process'),
    path = require('path'),
    packageinfo = require('./../../package'),
    jWorkflow = require('jWorkflow'),
    _c = require('./../conf');

module.exports = function (src, baton) {
    baton.take();

    var altFiles = ["package.json"],
        order = jWorkflow.order();

    order.andThen(function (prev, subbaton) {
        subbaton.take();
        childProcess.exec('mkdir ' + _c.DEPLOY + 'npm', function () {
            childProcess.exec('mkdir ' + _c.DEPLOY + 'npm/thirdparty', function () {
                childProcess.exec('mkdir ' + _c.DEPLOY + 'npm/assets', function () {
                    subbaton.pass();
                });
            });
        });
    });

    packageinfo.files.concat(altFiles).forEach(function (p) {
        order.andThen(function (prev, subbaton) {
            subbaton.take();

            var cmd = 'cp -r ' + path.resolve(path.join(_c.ROOT, p)) +
                ' ' + _c.DEPLOY + 'npm/' + p;

            childProcess.exec(cmd, function () {
                subbaton.pass();
            });
        });
    });

    order.start(function () {
        baton.pass(src);
    });
};
