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
var _isMouseDown = false,
    platform = require('ripple/platform'),
    builder = require('ripple/platform/builder'),
    constants = require('ripple/constants'),
    utils = require('ripple/utils'),
    exception = require('ripple/exception'),
    _xhr,
    _frame;

function _getEmulatedViewportStyle(attr) {
    var vp = document.getElementById(constants.COMMON.VIEWPORT_CONTAINER);
    return vp["client" + attr];
}

function _screenAvailWidth() {
    return _getEmulatedViewportStyle("Width");
}

function _screenAvailHeight() {
    return _getEmulatedViewportStyle("Height");
}

function _screenWidth() {
    return _getEmulatedViewportStyle("Width");
}

function _screenHeight() {
    return _getEmulatedViewportStyle("Height");
}

function _window_innerWidth() {
    return _getEmulatedViewportStyle("Width");
}

function _window_innerHeight() {
    return _getEmulatedViewportStyle("Height");
}

function _marshalScreen(win) {
    utils.forEach({
        "availWidth": _screenAvailWidth,
        "availHeight": _screenAvailHeight,
        "width": _screenWidth,
        "height": _screenHeight
    }, function (mappedFunc, prop) {
        win.screen.__defineGetter__(prop, mappedFunc);
    });

    utils.forEach({
        "innerWidth": _window_innerWidth,
        "innerHeight": _window_innerHeight
    }, function (mappedFunc, prop) {
        win.__defineGetter__(prop, mappedFunc);
    });
}

module.exports = {
    link: function  (frame) {
        _frame = frame;
        _xhr = frame.contentWindow.XMLHttpRequest;
            require('ripple/widgetConfig').initialize();

        var marshal = function (obj, key) {
                window[key] = _frame.contentWindow[key] = obj;
            },
            sandbox = {};

        marshal(window.tinyHippos, "tinyHippos");
        marshal(window.XMLHttpRequest, "XMLHttpRequest");

        builder.build(platform.current().objects).into(sandbox);

        utils.forEach(sandbox, marshal);

        _marshalScreen(_frame.contentWindow);
        _marshalScreen(window);
    },

    document: function () {
        return _frame.contentDocument;
    },

    window: function () {
        return _frame.contentWindow;
    },

    xhr: function () {
        return _xhr;
    }
};
