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
    _console = require('ripple/console'),
    db = require('ripple/db'),
    _CURRENT_URL = "current-url";

function _bindObjects(frame) {
    if (!frame.contentWindow.tinyHippos) {
        require('ripple/emulatorBridge').link(frame);
        require('ripple/touchEventEmulator').mask(frame);
        require('ripple/deviceMotionEmulator').init(frame);
        _bound = true;
    }
}

function _createFrame(src) {
    var frame = document.createElement("iframe");
    frame.setAttribute("id", "document");
    frame.src = src;

    frame.addEventListener("beforeload", function () {
        _bound = false;
        _bindObjects(frame);
        var id = window.setInterval(function () {
            if (_bound) {
                window.clearInterval(id);
            } else {
                _bindObjects(frame);
            }
        }, 1);
    });

    return frame;
}

function _cleanBody() {
    require('ripple/utils').forEach(document.body.children, function (child) {
        if (child && child.id && !child.id.match(/ui|tooltip/)) {
            document.body.removeChild(child);
        }

        document.body.removeAttribute("style");
        document.body.removeAttribute("id");
        document.body.removeAttribute("class");
    });
}

function _post(src) {
    var event = require('ripple/event'),
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

        //reset the onload function so that when navigating we can destroy
        //the iframe and create a new one so we can reinject the platform by
        //calling post again.
        frame.onload = function () {
            var url = frame.contentWindow.location.href;
            document.getElementById("viewport-container").removeChild(frame);
            event.trigger("FrameHistoryChange", [url]);
            _console.log("-----------------------------------------------------------");
            _console.log("Pay no attention to that man behind the curtain.");
            _console.log("Environment Warning up again (Set main batteries to auto-fire cycle)");
            _post(url);
        };
    };

    // append frame
    document.getElementById("viewport-container").appendChild(frame);

    delete tinyHippos.boot;
}

function _bootstrap() {
    // TODO: figure this out for web and ext
    //_console.log("-----------------------------------------------------------");
    //_console.log("There be dragons above here!");
    _console.log("Ripple :: Environment Warming Up (Tea. Earl Gray. Hot.)");

    window.tinyHippos = require('ripple');

    tinyHippos.boot(function () {
        //var src = document.documentURI.replace(/enableripple=true[&]/i, "").replace(/[\?&]$/, "");
        _post(db.retrieve(_CURRENT_URL) || "about:blank");
        delete tinyHippos.boot;
    });
}

module.exports = {
    bootstrap: _bootstrap
};
