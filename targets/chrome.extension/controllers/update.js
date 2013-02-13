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
window.addEventListener("load", function () {
    var metaData = chrome.extension.getBackgroundPage().tinyHippos.Background.metaData(),
        title = metaData.justInstalled ? "Welcome to Emulator" : "Emulator has been updated",
        body = "";

    document.getElementById("title").innerText = title;
        
    if (metaData.justInstalled) {
        body = "Visit our <a href=\"http://developer.blackberry.com/html5/documentation\" target=\"_blank\">documentation site</a> to get started.";
    } else {
        body = "See what's new in <a href=\"https://github.com/blackberry/Ripple-UI/blob/master/doc/CHANGELOG.md\"" +
            " target=\"_blank\">v" + metaData.version + "</a>.";
    }

    document.getElementById("body").innerHTML = body;
});
