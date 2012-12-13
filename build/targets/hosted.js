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
    path = require('path'),
    _c = require('./../conf'),
    PKG_BUILD_DIR = path.join(_c.DEPLOY, "hosted");

module.exports = function (src, baton) {
    baton.take();

    var copy = 'mkdir ' + PKG_BUILD_DIR + " &&" +
               'cp -r ' + _c.ASSETS + "client/images " + PKG_BUILD_DIR + " &&" +
               'cp -r ' + _c.ASSETS + "client/themes " + PKG_BUILD_DIR;

    childProcess.exec(copy, function (error/*, stdout, stderr*/) {
        if (error) { throw new Error(error); }

        var css = path.join(_c.ASSETS + "client", "ripple.css"),
            cssDeploy = path.join(PKG_BUILD_DIR, "ripple.css"),
            jsDeploy = path.join(PKG_BUILD_DIR, "ripple.js"),
            htmlDeploy = path.join(PKG_BUILD_DIR, "ripple.html"),
            html = src.html.replace(/#OVERLAY_VIEWS#/g, src.overlays)
                          .replace(/#PANEL_VIEWS#/g, src.panels)
                          .replace(/#DIALOG_VIEWS#/g, src.dialogs)
                          .replace(/#URL_PREFIX#/g, "/")
                          .replace(_c.SPACES_AND_TABS, " ");

        fs.writeFileSync(cssDeploy, fs.readFileSync(css, "utf-8") + src.skins);

        fs.writeFileSync(htmlDeploy, html, "utf-8");

        fs.writeFileSync(jsDeploy,
            src.js +
            "ripple('bootstrap').bootstrap();"
        );

        baton.pass(src);
    });
};
