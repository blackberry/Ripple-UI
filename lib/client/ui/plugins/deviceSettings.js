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
    deviceSettings = ripple('deviceSettings'),
    utils = ripple('utils'),
    exception = ripple('exception'),
    platform = ripple('platform'),
    event = ripple('event'),
    _CONST = {
        "CONTENT_CONTAINER_ID": "devicesettings-content-container",
        "UKNOWN_CONTROL_MESSAGE": "Unknown device control type"
    },
    _contentContainer,
    _CONTAINER_ID = _CONST.CONTENT_CONTAINER_ID;

event.on("DeviceSettingsUpdated", function (inputKey, value) {
    var node = $(document.getElementById("device-settings-" + inputKey));
    node.val(value);
});

function _appendSettingNode(labelNode, inputNode, label) {
    var frag = document.createDocumentFragment(),
        rowNode = frag.appendChild(utils.createElement("tr")),
        tempTdNode;

    rowNode.appendChild(utils.createElement("td"))
           .appendChild(labelNode);

    tempTdNode = rowNode.appendChild(utils.createElement("td"));

    if (label) {
        tempTdNode.appendChild(label);
    }

    tempTdNode.appendChild(inputNode);

    return frag;
}

function _buildDOMNode(setting, settingType, key) {
    var settingsNode, tagName, jNode,
        fullKey = settingType + "." + key,
        savedSetting = deviceSettings.retrieve(fullKey),
        // TODO: move this into Utils (isSet method)
        currentSetting = (savedSetting || savedSetting === false || savedSetting === "" || savedSetting === 0) ? savedSetting : setting.control.value,
        domNode,
        domNodeLabel = null;


    switch (setting.control.type) {
    case "text":
    case "number":
    case "range":
    case "checkbox":
        tagName = "input";
        break;
    case "textarea":
        tagName = "textarea";
        break;
    case "select":
        tagName = "select";
        break;
    default:
        exception.raise(exception.types.Application, _CONST.UKNOWN_CONTROL_MESSAGE);
    }

    settingsNode = utils.createElement(tagName, setting.control.type === "select" ? null : setting.control);

    // TODO: this should really be part of utils.createControl? add element of type "range" with label?
    if (setting.control.type === "range") {
        domNodeLabel = utils.createElement("label", {
            "class": constants.UI.LEFT_RANGE_LABEL_CLASS
        });
    }

    domNode = _appendSettingNode(utils.createElement("span", {"innerHTML": setting.name, "class": constants.UI.TEXT_LABEL_CLASS}), settingsNode, domNodeLabel);

    jNode = jQuery(settingsNode);
    jNode.addClass(constants.UI.JQUERY_UI_INPUT_CLASSES);
    jNode.attr("id", "device-settings-" + fullKey);

    switch (setting.control.type) {
    case "checkbox":
        jNode.bind("click", function () {
            var checked = this.checked ? true : false;
            deviceSettings.persist(fullKey, checked);
            if (typeof setting.callback === "function") {
                setting.callback(checked);
            }
        });

        if (currentSetting === true) {
            jNode.attr("checked", "checked");
        }

        break;

    case "text":
    case "textarea":
    case "number":
        jNode.val(currentSetting);
        utils.bindAutoSaveEvent(jNode, function () {
            deviceSettings.persist(fullKey, jNode.val());
            if (typeof setting.callback === "function") {
                setting.callback(jNode.val());
            }
        });
        break;

    case "select":
    case "range":
        if (setting.control.type === "select") {
            utils.forEach(setting.options,  function (value, option) {
                jNode.append(utils.createElement("option", {
                    "value": option,
                    "innerHTML": value
                }));
            });
        }
        else {
            if (domNodeLabel) {
                domNodeLabel.innerHTML = currentSetting;
            }
        }

        jNode.val(currentSetting)
             .bind("change", function () {
                if (setting.control.type === "range" && domNodeLabel) {
                    domNodeLabel.innerHTML = jQuery(this).val();
                }
                deviceSettings.persist(fullKey, jQuery(this).val());

                if (typeof setting.callback === "function") {
                    setting.callback(jQuery(this).val(), currentSetting);
                }
            }
        );
    }

    // TODO: Brent, do in DeviceSettings on load instead?
    if (currentSetting !== setting.control.value) {
        deviceSettings.register(fullKey, currentSetting);
    }

    return domNode;
}

// goes through current platforms device settings
// adds nodes to panel and binds respective events
// talks to DeviceSettings for persistence
module.exports = {
    panel: {
        domId: "devicesettings-panel-container",
        collapsed: true,
        pane: "right"
    },
    initialize: function () {
        var settings;

        _contentContainer = document.getElementById(_CONTAINER_ID);

        settings = platform.current().device;

        utils.forEach(settings, function (settingSection, settingType) {

            var currentTableNode;

            _contentContainer.appendChild(utils.createElement("h3", { "innerHTML": settingType }));

            currentTableNode = utils.createElement("table", {
                "class": constants.UI.PANEL_TABLE_CLASS
            });

            _contentContainer.appendChild(currentTableNode);

            utils.forEach(settingSection, function (setting, key) {

                currentTableNode.appendChild(_buildDOMNode(setting, settingType, key));

                if (setting.callback) {
                    setting.callback(setting.control.value);
                }
            });
        });
    }
};
