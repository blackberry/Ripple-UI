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
var fs = require('fs'),
    utils = require('./utils'),
    _c = require('./conf');

module.exports = function () {
    var lib = [],
        devicesCSS = [],
        overlays = [],
        panels = [],
        dialogs = [],
        thirdparty = [],
        src = {
            info: JSON.parse(fs.readFileSync(_c.PACKAGE_JSON, "utf-8")),
            js: "",
            injection: "",
            overlays: "",
            panels: "",
            dialogs: "",
            html: "",
            skins: ""
        };

    function matches(type) {
        return function (path) {
            return path.match(new RegExp(type + "$"));
        };
    }

    function compile(files, block) {
        return files.reduce(function (buffer, file) {
            var filestr = fs.readFileSync(file, "utf-8") + "\n";
            return buffer + (block ? block(filestr, file) : filestr);
        }, "");
    }

    src.js += "/*! \n  " + _c.APPNAME +
              " v" + src.info.version + " :: Built On " + new Date() + "\n\n" +
              fs.readFileSync(_c.LICENSE, "utf-8") + "*/\n";

    utils.collect(_c.LIB, lib);
    utils.collect(_c.DEVICES, devicesCSS, matches(".css"));
    utils.collect(_c.UI, overlays, matches("overlay.html"));
    utils.collect(_c.UI, panels, matches("panel.html"));
    utils.collect(_c.UI, dialogs, matches("dialog.html"));

    utils.collect(_c.THIRDPARTY, thirdparty, function (path) {
        return _c.thirdpartyIncludes.some(function (file) {
            return matches(file)(path);
        });
    });

    src.html = fs.readFileSync(_c.ASSETS + "index.html", "utf-8");

    src.skins += compile(devicesCSS);
    src.panels += compile(panels);
    src.dialogs += compile(dialogs);
    src.overlays += compile(overlays);

    src.js += _c.thirdpartyIncludes.reduce(function (buffer, file) {
        return buffer + fs.readFileSync(_c.THIRDPARTY + file, "utf-8");
    }, "");

    src.js += compile(lib, function (file, path) {
        return "require.define('" + path.replace(/^.*ripple/, "ripple").replace(/\.js$/, '') +
               "', function (require, module, exports) {\n" + file + "});\n";
    });

    return src;
};
