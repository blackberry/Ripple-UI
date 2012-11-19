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
var constants = ripple('constants'),
    db = ripple('db'),
    resizer = ripple('resizer'),
    devices = ripple('devices'),
    event = ripple('event');

function _initializeLayout() {
    var layout = db.retrieve("layout"),
        layoutLandscape = document.getElementById(constants.COMMON.ORIENTATION_SELECT_LANDSCAPE_ID),
        layoutPortrait = document.getElementById(constants.COMMON.ORIENTATION_SELECT_PORTRAIT_ID),
        currentDevice = devices.getCurrentDevice(),
        defaultOrientation =  currentDevice ? currentDevice.defaultOrientation : null,
        layoutTypeChanged = false;

    jQuery("#" + constants.COMMON.ORIENTATION_SELECT_LANDSCAPE_ID).bind("click", function () {
        resizer.changeLayoutType("landscape");
        event.trigger("LayoutChanged", ["landscape"], true);
        layoutLandscape.setAttribute("class", "layout-selected");
        layoutPortrait.setAttribute("class", "layout-not-selected");
    });

    jQuery("#" + constants.COMMON.ORIENTATION_SELECT_PORTRAIT_ID).bind("click", function () {
        resizer.changeLayoutType("portrait");
        event.trigger("LayoutChanged", ["portrait"], true);
        layoutLandscape.setAttribute("class", "layout-not-selected");
        layoutPortrait.setAttribute("class", "layout-selected");
    });

    jQuery("#" + constants.COMMON.MENU_BUTTON).bind("click", function () {
        event.trigger("HardwareKey", [1]);
    });

    jQuery("#" + constants.COMMON.BACK_BUTTON).bind("click", function () {
        event.trigger("HardwareKey", [0]);
    });

    if (!layout) {
        layout = defaultOrientation || "portrait";
        layoutTypeChanged = true;
        resizer.changeLayoutType(layout);
    }

    //Hide the orientation buttons that we don't need for this device
    if (!currentDevice.viewPort.landscape) {
        layoutLandscape.setAttribute("style", "display:none");
    }

    if (!currentDevice.viewPort.portrait) {
        layoutPortrait.setAttribute("style", "display:none");
    }

    if (layout && layout === "portrait") {
        layoutLandscape.setAttribute("class", "layout-not-selected");
        layoutPortrait.setAttribute("class", "layout-selected");
    }
    else if (layout && layout === "landscape") {
        layoutLandscape.setAttribute("class", "layout-selected");
        layoutPortrait.setAttribute("class", "layout-not-selected");
    }

    if (!layoutTypeChanged) {
        resizer.resize(currentDevice);
    }
}

module.exports = {
    initialize: _initializeLayout
};
