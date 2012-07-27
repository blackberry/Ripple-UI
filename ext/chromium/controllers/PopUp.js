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
window.addEventListener('load', function () {
    var background = chrome.extension.getBackgroundPage().tinyHippos.Background,
        autostart = document.getElementById("popup-autostart");

    autostart.checked = !!background.isAutostart();

    function _handle(func) {
        return function () {
            try {
                func();
            } catch (e) {
                alert(e.message + "\n" + e.stack);
            }
        };
    }

    document.getElementById("popup-enable")
        .addEventListener('click', _handle(background.enable));

    document.getElementById("popup-disable")
        .addEventListener('click', _handle(background.disable));

    document.getElementById("popup-start")
        .addEventListener('click', _handle(background.start));

    document.getElementById("popup-stop")
        .addEventListener('click', _handle(background.stop));

    autostart.addEventListener('change', function () {
        background.autostart(autostart.checked);
    });
});
