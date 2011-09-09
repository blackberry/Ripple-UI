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
var exception = require('ripple/exception'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    constants = require('ripple/constants'),
    _console = require('ripple/console'),
    utils = require('ripple/utils'),
    notifications = require('ripple/notifications'),
    _currentlySet,
    _img,
    _buttons,
    _self,
    _videoCapture;


function _populateWindow(domObject) {
    var record = document.createElement("button"),
        pause = document.createElement("button"),
        stop = document.createElement("button");

    _img = document.createElement("img");
    _img.setAttribute("id", "jil-camera-window");
    _img.setAttribute("src", document.querySelector("#extension-url").innerHTML + constants.CAMERA.WINDOW_ANIMATION);
    _img.setAttribute("width", "100%");
    _currentlySet = domObject;
    domObject.appendChild(_img);

    _buttons = document.createElement("div");
    _buttons.setAttribute("id", "jil-camera-window-buttons");
    _buttons.setAttribute("style", "display: none");

    record.setAttribute("id", "jil-camera-window-buttons-record");
    record.innerHTML = "Record";
    pause.setAttribute("id", "jil-camera-window-buttons-pause");
    pause.innerHTML = "Pause";
    stop.setAttribute("id", "jil-camera-window-buttons-stop");
    stop.innerHTML = "Stop";
    stop.addEventListener("click", _self.stopVideoCapture);

    _buttons.appendChild(record);
    _buttons.appendChild(pause);
    _buttons.appendChild(stop);

    domObject.appendChild(_buttons);

}

function _verifySetWindow(method) {
    if (!_img) {
        exception.raise(ExceptionTypes.UNKNOWN, "Camera." +
          method + " was (most likely) called before using the setWindow method.", new Exception());
    }
}

_self = {
    onCameraCaptured: undefined, //function (fileName) { }

    captureImage: function (fileName, lowRes) {
        utils.validateNumberOfArguments(2, 2, arguments.length, ExceptionTypes.INVALID_PARAMETER, "captureImage invalid number of parameters", new Exception());
        utils.validateMultipleArgumentTypes([fileName, lowRes], ['string', 'boolean'], ExceptionTypes.INVALID_PARAMETER, "invalid parameter type", new Exception());

        _verifySetWindow("captureImage");
        var msg = constants.CAMERA.WARNING_TEXT;
        msg = msg.replace("{file}", fileName);
        notifications.openNotification("normal", msg);
        _console.log("simulated saved image as: " + fileName);
        if (_self.onCameraCaptured) {
            _self.onCameraCaptured.apply(_self, [fileName]);
        }

        return fileName;
    },
    setWindow: function (domObject) {

        if (_currentlySet) {
            _currentlySet.removeChild(_img);
            _currentlySet.removeChild(_buttons);
            _currentlySet = null;
            _img = null;
            _buttons = null;
        }
        if (domObject !== null) {
            _populateWindow(domObject);
        }
    },
    startVideoCapture: function (fileName, lowRes, maxDurationSeconds, showDefaultControls) {
        _verifySetWindow("startVideoCapture");
        utils.validateNumberOfArguments(1, 4, arguments.length, ExceptionTypes.INVALID_PARAMETER, "startVideoCapture invalid number of parameters", new Exception());
        utils.validateMultipleArgumentTypes(
            [fileName, lowRes, maxDurationSeconds, showDefaultControls],
            ['string', 'boolean', 'integer', 'boolean'],
            ExceptionTypes.INVALID_PARAMETER,
            "invalid parameter type", new Exception());
        _console.log("started recording video");
        var interval = window.setTimeout(function () {
            _self.stopVideoCapture();
        }, maxDurationSeconds * 1000);

        if (showDefaultControls) {
            _buttons.removeAttribute("style");
        }

        _videoCapture = {
            fileName: fileName,
            stop: function () {
                window.clearInterval(interval);
                var msg = constants.CAMERA.WARNING_TEXT;
                msg = msg.replace("{file}", fileName);
                notifications.openNotification("normal", msg);
                if (_self.onCameraCaptured) {
                    _self.onCameraCaptured.apply(_self, [fileName]);
                }
            }
        };

        return fileName;
    },
    stopVideoCapture: function () {
        utils.validateNumberOfArguments(0, 0, arguments.length, ExceptionTypes.INVALID_PARAMETER, "stopVideoCapture invalid number of parameters", new Exception());
        if (_videoCapture) {
            _console.log("simulated saving a video as: " + _videoCapture.fileName);
            if (_buttons) {
                _buttons.setAttribute("style", "display: none");
            }
            _videoCapture.stop();
            _videoCapture = null;
        }
    }

};

module.exports = _self;
