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
module.exports = {
    APPNAME: "Ripple Mobile Environment Emulator",
    LICENSE: "LICENSE",
    PACKAGE_JSON: __dirname + "/../package.json",
    ROOT: __dirname + "/../",
    BUILD: __dirname + "/",
    EXT: __dirname + "/../targets/",
    ASSETS: __dirname + "/../assets/",
    LIB: __dirname + "/../lib/client/",
    UI: __dirname + "/../lib/client/ui/",
    DEVICES: __dirname + "/../lib/client/devices/",
    THIRDPARTY: __dirname + "/../thirdparty/",
    DEPLOY: __dirname + "/../pkg/",
    SPACES_AND_TABS: /\n+|\s+|\t{2,}/g,
    ESCAPED_QUOTES: '\'+"\'"+\'',
    thirdpartyIncludes: [
        "almond.js",
        "jquery.js",
        "jquery.ui.js",
        "jquery.tooltip.js",
        "Math.uuid.js",
        "jXHR.js",
        "3d.js",
        "draw.js",
        "../node_modules/jWorkflow/lib/jWorkflow.js",
        "OpenLayers.js"
    ]
};
