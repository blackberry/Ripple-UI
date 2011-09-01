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
    _c = require('./conf');

function copy(from, callback) {
    var cmd = 'cp -r ' + from + ' ' + _c.DEPLOY + "web";
    childProcess.exec(cmd, callback);
}

module.exports = function (src, baton) {
    baton.take();

    copy(_c.ASSETS, function () {
        var css = _c.DEPLOY + "web/styles/main.css",
            index = _c.DEPLOY + "web/index.html",
            injection = _c.DEPLOY + "web/ripple.js",
            doc = src.html.replace(/#URL_PREFIX#/g, "")
                          .replace(/#OVERLAY_VIEWS#/g, src.overlays)
                          .replace(/#DIALOG_VIEWS#/g, src.dialogs)
                          .replace(/#PANEL_VIEWS#/g, src.panels);

        fs.writeFileSync(css, fs.readFileSync(css, "utf-8") + src.skins);
        fs.writeFileSync(index, doc);
        fs.writeFileSync(injection, src.js + "require('ripple/bootstrap').bootstrap();");

        copy(_c.PACKAGE_JSON, function () {
            baton.pass(src);
        });
    });
};
