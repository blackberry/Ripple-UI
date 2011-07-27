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
var db = require('ripple/db'),
    exception = require('ripple/exception'),
    utils = require('ripple/utils'),
    resizer = require('ripple/resizer'),
    devices = require('ripple/devices'),
    constants = require('ripple/constants'),
    event = require('ripple/event'),
    self;

function _validateLayoutType(layoutType) {
    return (layoutType === constants.ENCAPSULATOR.DISPLAY_LAYOUT.LANDSCAPE || layoutType === constants.ENCAPSULATOR.DISPLAY_LAYOUT.PORTRAIT);
}

function _getContainers() {
    return {
        device: {
            div: document.getElementById(constants.COMMON.DEVICE_CONTAINER),
            containerClass: document.getElementById(constants.COMMON.DEVICE_CONTAINER).getAttribute("class") || ""
        },
        viewport: {
            div: document.getElementById(constants.COMMON.VIEWPORT_CONTAINER),
            containerClass: document.getElementById(constants.COMMON.VIEWPORT_CONTAINER).getAttribute("class") || ""
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
    return {
        deviceWidth: orientation === "portrait" ? device.screen.width : device.screen.height,
        deviceHeight: orientation === "portrait" ? device.screen.height : device.screen.width,
        paddingLeft: device.viewPort[orientation].paddingLeft,
        paddingTop: device.viewPort[orientation].paddingTop,
        viewPort: {
            width: device.viewPort[orientation].width,
            height: device.viewPort[orientation].height
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

self = module.exports = {
    // TODO: redo/refactor this in general, seems bloated, also devices REQUIRE viewport schemas which they shouldnt
    resize: function (device) {
        var layout = db.retrieve(constants.ENCAPSULATOR.LAYOUT),
            orientation = "portrait",
            containers, dimensions;

        if (layout && layout === constants.ENCAPSULATOR.DISPLAY_LAYOUT.LANDSCAPE && device.viewPort.landscape) {
            orientation = "landscape";
        }

        containers = _getContainers();

        _setContainers(containers, device, orientation);

        dimensions = _getDimensions(device, orientation);

        if (!device.skin) {
            _formatSkin(containers, dimensions);
        }

        event.trigger("ScreenChangeDimensions", [dimensions.viewPort.width, dimensions.viewPort.height]);
    },

    changeLayoutType: function (layoutType) {
        if (!_validateLayoutType(layoutType)) {
            exception.raise(exception.types.LayoutType, "unknown layout type requested!");
        }

        db.save(constants.ENCAPSULATOR.LAYOUT, layoutType);

        self.resize(devices.getCurrentDevice());
    }
};
