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
    _console = require('ripple/console');

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
            }, 1),
            ael = frame.contentWindow.addEventListener;
            handlers = [];

        //HACK: This is to get around a bug in webkit where it doesn't seem to 
        //      fire the load handlers when we readd the iframe back into the DOM
        //      https://github.com/blackberry/Ripple-UI/issues/190
        frame.contentWindow.addEventListener = function (event, handler) {
            if (event === "load") {
                handlers.push(handler);
            }
            else {
                ael.apply(this, arguments);
            }
        };

        frame.fireHandlers = function () {
            handlers.forEach(function (handler) {
                return handler && handler();
            });
        };
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

    _console.log("Ripple :: Initialization Finished (Make it so.)");

    frame.onload = function () {
        var bootLoader = document.querySelector("#emulator-booting"),
            id;
        if (bootLoader) {
            document.querySelector("#ui").removeChild(bootLoader);
        }

        frame.fireHandlers();
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
    _console.log("-----------------------------------------------------------");
    _console.log("There be dragons above here!");
    _console.log("Ripple :: Environment Warming Up (Tea. Earl Gray. Hot.)");


    window.tinyHippos = require('ripple');

    tinyHippos.boot(function () {
        var src = document.documentURI.replace(/enableripple=true[&]/i, "").replace(/[\?&]$/, "");
        _post(src);
        delete tinyHippos.boot;
    });
}

module.exports = {
    bootstrap: _bootstrap
};
