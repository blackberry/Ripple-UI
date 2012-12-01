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
    utils = require('./../utils'),
    fs = require('fs'),
    path = require('path'),
    _c = require('./../conf'),
    _EXT_DIR = "rim.chrome.extension";

module.exports = function (src, baton) {
    baton.take();

    var copy = 'cp -r ' + _c.EXT + "chrome.extension " + _c.DEPLOY + _EXT_DIR + " && " +
               'cp -rf ' + _c.EXT + _EXT_DIR + " " + _c.DEPLOY + " && " +
               'cp -r ' + _c.ASSETS + "client/images " + _c.DEPLOY + _EXT_DIR + "/ &&" +
               'cp -r ' + _c.ASSETS + "client/themes " + _c.DEPLOY + _EXT_DIR + "/" +
               'cp -r ' + _c.ROOT + "services " + _c.DEPLOY + _EXT_DIR + "/" +
               'cp -r ' + _c.ROOT + "plugins " + _c.DEPLOY + _EXT_DIR + "/";

    childProcess.exec(copy, function () {
        var css = _c.ASSETS + "client/ripple.css",
            cssDeploy = _c.DEPLOY + _EXT_DIR + "/ripple.css",
            manifest = _c.DEPLOY + _EXT_DIR + "/manifest.json",
            updatesSrc = _c.EXT + _EXT_DIR + "/updates.xml",
            updatesDeploy = _c.DEPLOY + _EXT_DIR + "/updates.xml",
            js = _c.DEPLOY + _EXT_DIR + "/ripple.js",
            bootstrap = _c.DEPLOY + _EXT_DIR + "/bootstrap.js",
            manifestJSON = JSON.parse(fs.readFileSync(manifest, "utf-8")),
            resourceList = [],
            doc = src.html.replace(/#OVERLAY_VIEWS#/g, src.overlays)
                          .replace(/#PANEL_VIEWS#/g, src.panels)
                          .replace(/#DIALOG_VIEWS#/g, src.dialogs)
                          .replace(_c.SPACES_AND_TABS, " ")
                          .replace(/'/g, _c.ESCAPED_QUOTES);

        fs.writeFileSync(cssDeploy, fs.readFileSync(css, "utf-8") + src.skins);

        fs.writeFileSync(updatesDeploy, fs.readFileSync(updatesSrc, "utf-8")
                         .replace(new RegExp('version=""', 'g'), 'version="' + src.info.version + '"'));

        fs.writeFileSync(bootstrap,
                         "window.th_panel = {" + "LAYOUT_HTML: '" + doc + "'};" +
                         fs.readFileSync(bootstrap, "utf-8"));

        fs.writeFileSync(js,
            src.js +
            "ripple('bootstrap').bootstrap();"
        );

        utils.collect(_c.DEPLOY + _EXT_DIR, resourceList, function () {
            return true;
        });

        manifestJSON.version = src.info.version;
        manifestJSON.web_accessible_resources = resourceList.map(function (p) {
            return p.replace(path.normalize(_c.DEPLOY + _EXT_DIR + "/"), '');
        });

        fs.writeFileSync(manifest, JSON.stringify(manifestJSON), "utf-8");

        baton.pass(src);
    });
};
