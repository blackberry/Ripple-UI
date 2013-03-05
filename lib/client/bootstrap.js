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
var _bound,
    _console = ripple('console');

function _bindObjects(win, doc) {
    if (!win.tinyHippos) {
        ripple('emulatorBridge').init(win, doc);
        ripple('touchEventEmulator').init(win, doc);
        ripple('deviceMotionEmulator').init(win, doc);
        ripple('resizer').init(win, doc);
        ripple('cssMediaQueryEmulator').init(win, doc);
        _bound = true;
    }
}

function _createFrame(src) {
    var frame = document.createElement("iframe");
    frame.setAttribute("id", "document");
    frame.src = src;
    return frame;
}

function _cleanBody() {
    ripple('utils').forEach(document.body.children, function (child) {
        if (child && child.id && !child.id.match(/ui|tooltip|bus/)) {
            document.body.removeChild(child);
        }

        document.body.removeAttribute("style");
        document.body.removeAttribute("id");
        document.body.removeAttribute("class");
    });
}

function _post(src) {
    var event = ripple('event'),
        frame = _createFrame(src);

    _console.log("Initialization Finished (Make it so.)");

    frame.onload = function () {
        var bootLoader = document.querySelector("#emulator-booting"),
            id;
        if (bootLoader) {
            document.querySelector("#ui").removeChild(bootLoader);
        }

        event.trigger("TinyHipposLoaded");

        _cleanBody();
        id = window.setInterval(_cleanBody, 20);

        window.setTimeout(function () {
            window.clearInterval(id);
        }, 1200);
    };

    // append frame
    document.getElementById("viewport-container").appendChild(frame);

    delete tinyHippos.boot;
}

function _bootstrap() {
    if (console.clear) {
        console.clear();
    }

    _console.log("Ripple :: Environment Warming Up (Tea. Earl Gray. Hot.)");

    window.tinyHippos = ripple('index');

    tinyHippos.boot(function () {
        var uri = document.documentURI.replace(/enableripple=[^&]*[&]?/i, "").replace(/[\?&]*$/, "");
        _post(uri);
        delete tinyHippos.boot;
    });
}

module.exports = {
    bootstrap: _bootstrap,
    inject: function (frameWindow, frameDocument) {
        _bindObjects(frameWindow, frameDocument);
    }
};
