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
var constants = require('ripple/constants'),
    devices = require('ripple/devices'),
    event = require('ripple/event'),
    platform = require('ripple/platform'),
    utils = require('ripple/utils'),
    app = require('ripple/app');

function _updateInformationView() {
    var infoPane = document.getElementById(constants.COMMON.INFO_SECTION),
        infoList = [],
        device = devices.getCurrentDevice(),
        tempString = "",
        widgetInfo = app.getInfo();

    //TODO: refactor this stuff to grab info from API, do this in a loop rather then hardcoded. Better DOM injection approach. This is legacy code

    infoList.push('<section id=\"information-banner\" style=\"display:none\"><img id=\"information-banner-icon\" width=\"16px\" height=\"16px\"/> <span id=\"information-banner-count\"></span></section>');

    if (widgetInfo.icon) {
        infoList.push('<section class="information-widgeticon"><img class="ui-corner-all" width="64" src="' + widgetInfo.icon + '" alt="widget icon"/></section>');
    }
    if (widgetInfo.name) {
        infoList.push('<section class="information-widgetname">' + widgetInfo.name + '</section>');
    }
    if (widgetInfo.version) {
        infoList.push('<section class="information-widgetversion"><label class=\"ui-text-label\">Version: </label>' + widgetInfo.version + '</section>');
    }
    infoList.push("<section><label class=\"ui-text-label\">Platform: </label>" + platform.current().name + "</section>");
    infoList.push("<section><label class=\"ui-text-label\">Device: </label>" + device.name + "</section>");
    infoList.push("<section><label class=\"ui-text-label\">OS: </label>" + device.osName + " " + device.osVersion + "</section>");
    infoList.push("<section><label class=\"ui-text-label\">Manufacturer: </label>" + device.manufacturer + "</section>");
    infoList.push("<section><label class=\"ui-text-label\">Screen: </label>" + device.screen.width + "x" + device.screen.height + "</section>");

    if (device.screen.height !== device.viewPort.portrait.height) {
        infoList.push("<section><label class=\"ui-text-label\">Viewport: </label>" + device.viewPort.portrait.width + "x" + device.viewPort.portrait.height + "</section>");
    }

    infoList.push("<section><label class=\"ui-text-label\">Density: </label>" + device.ppi + " PPI</section>");
    infoList.push("<section><label class=\"ui-text-label\">Browser(s): </label>" + device.browser.join(", ") + "</section>");
    infoList.push("<section><label class=\"ui-text-label\" style=\"float:left; padding-top: 0px; \">User Agent: </label>" +
                    "<div style=\"padding-left: 80px\">" + device.userAgent + "</div></section>");

    if (device.notes) {
        utils.forEach(device.notes, function (note) {
            tempString += "<li>" + note + "</li>";
        });
        infoList.push("<section><div style=\"clear:both;\"></div><label class=\"ui-text-label\">Notes: </label><ul>" + tempString + "</ul></section>");
    }

    infoPane.innerHTML = infoList.join("");
}

function _updateBanner (icon, count) {
    var bannerSection = document.getElementById("information-banner"),
        iconImg  = document.getElementById("information-banner-icon"),
        countSpan = document.getElementById("information-banner-count");

    iconImg.src = icon;
    countSpan.innerHTML = count;

    if (count > 0)
        bannerSection.style.display = "block";
    else
        bannerSection.style.display = "none";

    jQuery("#" + constants.COMMON.INFO_SECTION).effect("highlight", {color: "#62B4C8"}, 1000);
}

module.exports = {
    panel: {
        domId: "information-container",
        collapsed: false,
        pane: "left"
    },
    initialize: function () {
        event.on("BannerUpdated", function (icon, count) {
            _updateBanner(icon, count);
        });

        event.on("PlatformChangedEvent", function () {
            _updateInformationView();
        });

        event.on("WidgetInformationUpdated", function () {
            _updateInformationView();
        });

        _updateInformationView();
    }
};
