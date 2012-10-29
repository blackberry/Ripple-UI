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
var db = require('ripple/client/db'),
    exception = require('ripple/client/exception'),
    utils = require('ripple/client/utils'),
    devices = require('ripple/client/devices'),
    constants = require('ripple/client/constants'),
    event = require('ripple/client/event'),
    _win,
    _doc,
    _self;

function _validateLayoutType(layoutType) {
    return (layoutType === "landscape" || layoutType === "portrait");
}

function _getContainers() {
    return {
        device: {
            div: document.getElementById("device-container"),
            containerClass: document.getElementById("device-container").getAttribute("class") || ""
        },
        viewport: {
            div: document.getElementById("viewport-container"),
            containerClass: document.getElementById("viewport-container").getAttribute("class") || ""
        },
        "menu-button": {
            div: document.getElementById(constants.COMMON.MENU_BUTTON),
            containerClass: document.getElementById(constants.COMMON.MENU_BUTTON).getAttribute("class") || ""
        },
        "back-button": {
            div: document.getElementById(constants.COMMON.BACK_BUTTON),
            containerClass: document.getElementById(constants.COMMON.BACK_BUTTON).getAttribute("class") || ""
        }
    };
}

function _setContainers(containers, device, orientation) {
    var removalSuffix = orientation === "portrait" ? "landscape" : "portrait",
        suffix = {
            portrait:  "-wrapper" + (device.skin ? "-" + device.skin : ""),
            landscape: "-wrapper-landscape" + (device.skin ? "-" + device.skin : "")
        };

    utils.forEach(containers, function (container, key) {
        container.div.setAttribute("class", container.containerClass.replace(" " + key + suffix[removalSuffix], "") + " " + key + suffix[orientation]);
    });
}

function _getDimensions(device, orientation) {
    var cssPixelRatio = (device.mediaQueryEmulation && device.mediaQueryEmulation["-webkit-device-pixel-ratio"]) ? device.mediaQueryEmulation["-webkit-device-pixel-ratio"] : 1;
    return {
        cssPixelRatio: cssPixelRatio,
        deviceWidth: Math.floor((orientation === "portrait" ? device.screen.width : device.screen.height) / cssPixelRatio),
        deviceHeight: Math.floor((orientation === "portrait" ? device.screen.height : device.screen.width) / cssPixelRatio),
        paddingLeft: device.viewPort[orientation].paddingLeft,
        paddingTop: device.viewPort[orientation].paddingTop,
        viewPort: {
            width: Math.floor((device.viewPort[orientation].width) / cssPixelRatio),
            height: Math.floor((device.viewPort[orientation].height) / cssPixelRatio)
        }
    };
}

function _formatSkin(containers, dimensions) {
    containers.device.div.style.width = (dimensions.deviceWidth + 4) + "px";
    containers.device.div.style.height = (dimensions.deviceHeight + 4) + "px";

    containers.viewport.div.style.width = dimensions.viewPort.width + "px";
    containers.viewport.div.style.height = dimensions.viewPort.height + "px";
    containers.viewport.div.style.padding = dimensions.paddingTop + "px " + (dimensions.deviceWidth - (dimensions.viewPort.width + dimensions.paddingLeft)) + "px " +
        (dimensions.deviceHeight - (dimensions.viewPort.height + dimensions.paddingTop)) + "px " + dimensions.paddingLeft + "px";
}

function _setOrientation(layout) {
    _win.orientation = window.orientation = layout === "portrait" ? 0 : 90;
}

_self = {
    init: function (win, doc) {
        _win = win;
        _doc = doc;

        var layout = db.retrieve("layout") || "portrait";

        _setOrientation(layout);

        _win.onorientationchange = undefined;
        _win.devicePixelRatio = window.devicePixelRatio;
    },
    // TODO: redo/refactor this in general, seems bloated, also devices REQUIRE viewport schemas which they shouldn't
    resize: function (device) {
        var layout = db.retrieve("layout"),
            orientation = "portrait",
            containers, dimensions;

        if (layout && layout === "landscape" && device.viewPort.landscape) {
            orientation = "landscape";
        }

        containers = _getContainers();

        _setContainers(containers, device, orientation);

        dimensions = _getDimensions(device, orientation);

        if (!device.skin) {
            _formatSkin(containers, dimensions);
        }

        window.devicePixelRatio = dimensions.cssPixelRatio;

        event.trigger("ScreenChangeDimensions", [dimensions.viewPort.width, dimensions.viewPort.height]);
    },

    changeLayoutType: function (layoutType) {
        if (!_validateLayoutType(layoutType)) {
            exception.raise(exception.types.LayoutType, "unknown layout type requested!");
        }

        db.save("layout", layoutType);
        _self.resize(devices.getCurrentDevice());


        if (!_win) return;

        _setOrientation(layoutType);

        if (_win.onorientationchange) {
            _win.onorientationchange();
        }

        var evt = _doc.createEvent("Event");
        evt.initEvent("orientationchange", true, true);
        _win.dispatchEvent(evt);
    }
};

module.exports = _self;
