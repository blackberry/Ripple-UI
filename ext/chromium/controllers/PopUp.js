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
        backgroundConsole = chrome.extension.getBackgroundPage().console;
        autostart = document.getElementById("popup-autostart"),
        start = document.getElementById("popup-start"),
        stop = document.getElementById("popup-stop");

    autostart.checked = !!background.isAutostart();

    function _handle(func) {
        return function () {
            try {
                func();
            } catch (e) {
                backgroundConsole.log(e.message, e.stack);
            }
        };
    }

    function _manageServices() {
        var running;

        try {
            running = background.serviceIsRunning();
        }
        catch (e) {
            running = false;
        }

        backgroundConsole.log("running: ", running);

        if (running) {
            start.style.display = "none";
            stop.style.display = "";
        }
        else {
            start.style.display = "";
            stop.style.display = "none";
        }
    }

    document.getElementById("popup-enable")
        .addEventListener('click', _handle(background.enable));

    document.getElementById("popup-disable")
        .addEventListener('click', _handle(background.disable));

    if (background.checkEula()) {
        document.getElementById("ripple-services").style.display = "";
    }

    start.addEventListener('click', _handle(function () {
        background.start();
        window.setTimeout(function () {
            _manageServices();
        }, 1000);
    }));

    stop.addEventListener('click', _handle(function () {
        background.stop();
        _manageServices();
    }));

    autostart.addEventListener('change', function () {
        background.autostart(autostart.checked);
    });

    _manageServices();
});
