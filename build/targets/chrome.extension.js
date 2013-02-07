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
    utils = require('./../utils'),
    _c = require('./../conf');

module.exports = function (src, baton) {
    baton.take();

    var copy = 'cp -r ' + _c.EXT + "chrome.extension " + _c.DEPLOY + "chrome.extension/ && " +
               'cp -r ' + _c.ASSETS + "client/images " + _c.DEPLOY + "chrome.extension/ &&" +
               'cp -r ' + _c.ASSETS + "client/themes " + _c.DEPLOY + "chrome.extension/ &&" +
               'cp ' + _c.EXT + "chrome.extension/manifest.json " + _c.DEPLOY + "chrome.extension/manifest.json &&" +
               'cp ' + _c.EXT + "chrome.extension/controllers/Background.js " + _c.DEPLOY + "chrome.extension/controllers/Background.js &&" + 
               'cp ' + _c.EXT + "chrome.extension/controllers/PopUp.js " + _c.DEPLOY + "chrome.extension/controllers/PopUp.js &&" + 
               'cp ' + _c.EXT + "chrome.extension/views/background.html " + _c.DEPLOY + "chrome.extension/views/background.html &&" + 
               'cp ' + _c.EXT + "chrome.extension/views/popup.html " + _c.DEPLOY + "chrome.extension/views/popup.html";

    childProcess.exec(copy, function () {
        var css = _c.ASSETS + "client/ripple.css",
            cssDeploy = _c.DEPLOY + "chrome.extension/ripple.css",
            manifest = _c.DEPLOY + "chrome.extension/manifest.json",
            manifestJSON = JSON.parse(fs.readFileSync(manifest, "utf-8")),
            js = _c.DEPLOY + "chrome.extension/ripple.js",
            bootstrap = _c.DEPLOY + "chrome.extension/bootstrap.js",
            htmlui = _c.DEPLOY + "chrome.extension/ui.html",
            resourceList = [],
            doc = src.html.replace(/#OVERLAY_VIEWS#/g, src.overlays)
                          .replace(/#PANEL_VIEWS#/g, src.panels)
                          .replace(/#DIALOG_VIEWS#/g, src.dialogs)
                          .replace(_c.SPACES_AND_TABS, " ")
                          .replace(/'/g, _c.ESCAPED_QUOTES);

        fs.writeFileSync(cssDeploy, fs.readFileSync(css, "utf-8") + src.skins);

        fs.writeFileSync(htmlui, doc, "utf-8");

        fs.writeFileSync(bootstrap,
                         "window.th_panel = {" + "LAYOUT_HTML: '" + doc + "'};" +
                         fs.readFileSync(bootstrap, "utf-8"));

        fs.writeFileSync(js,
            src.js +
            "ripple('bootstrap').bootstrap();"
        );

        utils.collect(_c.DEPLOY + "/chrome.extension", resourceList, function () { 
            return true; 
        });

        manifestJSON.version = src.info.version;
        manifestJSON.web_accessible_resources = resourceList.map(function (p) {
            return p.replace(path.normalize(_c.DEPLOY + "/chrome.extension/"), '');
        });

        fs.writeFileSync(manifest, JSON.stringify(manifestJSON), "utf-8");

        baton.pass(src);
    });
};
