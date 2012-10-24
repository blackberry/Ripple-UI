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
    fs = require('fs'),
    _c = require('./../conf');

function create(path) {
    return function (prev, baton) {
        baton.take();
        var cmd = 'mkdir ' + _c.DEPLOY + path;
        childProcess.exec(cmd, baton.pass);
    };
}

function copy(from, to) {
    return function (prev, baton) {
        baton.take();
        var cmd = 'cp -r ' + from + ' ' + _c.DEPLOY + to;
        childProcess.exec(cmd, baton.pass);
    };
}

function write(src) {
    return function () {
        var css = _c.ASSETS + "ripple.css",
            cssDeploy = _c.DEPLOY + "cordova/www/ripple.css",
            index = _c.DEPLOY + "cordova/www/index.html",
            js = _c.DEPLOY + "cordova/www/ripple.js",
            doc = src.html.replace(/#URL_PREFIX#/g, "")
                          .replace(/#OVERLAY_VIEWS#/g, src.overlays)
                          .replace(/#DIALOG_VIEWS#/g, src.dialogs)
                          .replace(/#PANEL_VIEWS#/g, src.panels);

        fs.writeFileSync(cssDeploy, fs.readFileSync(css, "utf-8") + src.skins);

        fs.writeFileSync(index, doc);
        fs.writeFileSync(js, src.js +
            "require('ripple/client/ui').register('omnibar');" +
            "require('ripple/client/bootstrap').bootstrap();");
    };
}

module.exports = function (src, baton) {
    var jWorkflow = require("jWorkflow");
    baton.take();

    jWorkflow.order(create('cordova'))
             .andThen(create('cordova/www'))
             .andThen(copy(_c.EXT + "cordova", ""))
             .andThen(copy(_c.ASSETS, "cordova/www"))
             .andThen(copy(_c.PACKAGE_JSON, "cordova/www"))
             .andThen(write(src))
             .start(baton.pass);
};
