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
var platform = require('ripple/client/platform'),
    builder = require('ripple/client/platform/builder'),
    utils = require('ripple/client/utils'),
    _xhr, _win, _doc;

function _getEmulatedViewportStyle(attr) {
    var vp = document.getElementById("viewport-container");
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
    init: function  (win, doc) {
        _win = win;
        _doc = doc;
        _xhr = win.XMLHttpRequest;

        require('ripple/client/widgetConfig').initialize();

        var marshal = function (obj, key) {
                window[key] = win[key] = obj;
            },
            currentPlatform = platform.current(),
            sandbox = {};

        marshal(window.tinyHippos, "tinyHippos");
        marshal(window.XMLHttpRequest, "XMLHttpRequest");

        if (currentPlatform.initialize) {
            currentPlatform.initialize(win);
        }

        builder.build(platform.current().objects).into(sandbox);
        utils.forEach(sandbox, marshal);

        _marshalScreen(win);
        _marshalScreen(window);
    },

    document: function () {
        return _doc;
    },

    window: function () {
        return _win;
    },

    xhr: function () {
        return _xhr;
    }
};
