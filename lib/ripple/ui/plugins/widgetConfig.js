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
    event = require('ripple/event'),
    utils = require('ripple/utils'),
    exception = require('ripple/exception'),
    tooltip = require('ripple/ui/plugins/tooltip'),
    platform = require('ripple/platform'),
    widgetConfig = require('ripple/widgetConfig');

function _buildConfigAccordionNode(node, accordionContainer, counter) {
    var nodeDiv, nodeTitleH3, nodeContentDiv, tableString, attribute, child, result,
        tableClass, nameClass, attributeNameClass, messageClass, nameId, messageId, attributeName, attributeValue, attributeMessage,
        helpText = {},
        nodeCounter = 0,
        attributeCounter = 0,
        moreNodes = node.validationResult,
        createTooltip = function (value, index) {
            tooltip.create("#" +  index, value);
        };

    while (moreNodes) {
        result = node.validationResult[nodeCounter];

        if (!result) {
            // this should never happen
            return;
        }

        // the container of the entire accordion block
        nodeDiv = utils.createElement("div", {
            "id": "config-accordion-node-content-" + counter + "-" + nodeCounter,
            "class": "ui-corner-all"
        });

        // the header bar of the accordion block
        nodeTitleH3 = utils.createElement("h3", {
            "id": "config-accordion-node-title-" + counter + "-" + nodeCounter,
            "class": "config-accordion-node-title"
        });

        nodeTitleH3.appendChild(utils.createElement("a", {
            href: "#",
            innerText: node.nodeName,
            "class": constants.CONFIG.SUCCESS_CSS[(result.valid === undefined) ? "missing" : result.valid.toString()]
        }));
        nodeDiv.appendChild(nodeTitleH3);

        if (node.helpText) {
            helpText[nodeTitleH3.id] = node.helpText;
        }

        nodeContentDiv = utils.createElement("div");

        // display node value (add tool tip if exists)
        if (node.type || (!node.type && result && result.value)) {
            nodeContentDiv.appendChild(utils.createElement("div", {
                "id": "config-accordion-node-content-value-" + counter + "-" + nodeCounter,
                "class": "config-accordion-node-content-value",
                "innerHTML": "<span>Value:</span>" + (result.value || "")
            }));

            if (node.helpValueText) {
                helpText["config-accordion-node-content-value-" + counter + "-" + nodeCounter] = node.helpValueText;
            }
        }

        // display node message if failed validation
        if (result && result.message) {
            nodeContentDiv.appendChild(utils.createElement("div", {
                "id": "config-accordion-node-content-value-message-" + counter + "-" + nodeCounter,
                "class": "config-accordion-node-content-value-message ui-text-fail",
                "innerHTML": "<span>Message:</span>" + result.message
            }));
        }

        // display node attributes with name, value, message if failed validation
        if (result.attributes) {
            nodeContentDiv.appendChild(utils.createElement("div", {
                "id": "config-accordion-node-content-attributes-title-" + counter + "-" + nodeCounter,
                "class": "config-accordion-node-content-attributes-title",
                "innerHTML": "Attributes..."
            }));

            tableClass = "preferences-table";
            nameClass = "config-attributes-name-value";
            attributeNameClass = "ui-text-label";
            messageClass = "config-attributes-message";

            tableString = '<table class="' + tableClass + ' ui-widget-content">';
            for (attribute in result.attributes) {
                if (result.attributes.hasOwnProperty(attribute)) {
                    nameId = "config-accordion-node-content-attributes-table-name-" + counter + "-" + nodeCounter + "-" + attributeCounter;
                    messageId = "config-accordion-node-content-attributes-table-message-" + counter + "-" + nodeCounter + "-" + attributeCounter;
                    attributeName = result.attributes[attribute].attributeName;
                    attributeValue = result.attributes[attribute].value || "&nbsp;";
                    attributeMessage = result.attributes[attribute].message || null;

                    tableString += '<tr class="' + nameClass + '" id="' + nameId + '">' +
                            '<td class="' + attributeNameClass + '">' + attributeName + '</td>' +
                            '<td>' + attributeValue + '</td></tr>';

                    if (node.attributes[attributeName].helpText) {
                        helpText[nameId] = node.attributes[attributeName].helpText;
                    }

                    if (attributeMessage !== null) {
                        tableString += "<tr class=" + messageClass + " id=" + messageId + "><td colspan=\"2\">" +
                                attributeMessage + "</td></tr>";
                    }
                    attributeCounter++;
                }
            }
            tableString += "</table>";

            nodeContentDiv.innerHTML += tableString;
        }


        nodeDiv.appendChild(nodeContentDiv);
        accordionContainer.appendChild(nodeDiv);

        utils.forEach(helpText, createTooltip);

        nodeCounter ++;

        if (!node.validationResult[nodeCounter]) {
            nodeCounter = 0;
            moreNodes = false;
        }
    }

    if (node.children) {
        for (child in node.children) {
            if (node.children.hasOwnProperty(child)) {
                counter ++;
                _buildConfigAccordionNode(node.children[child], accordionContainer, counter);
            }
        }
    }
}

function _initializeConfigResultsView(results) {
    try {
        var rootNode,
            accordionContainer = document.getElementById("widget-config");

        accordionContainer.innerHTML = "";
        if (!results) {
            accordionContainer.appendChild(utils.createElement("div", {
                "class": "config-accordion-node-title " + constants.CONFIG.SUCCESS_CSS["false"],
                "innerHTML": "Expected to find a configuration file for your application, but none is present. Please create" +
                        " a configuration file with the following name in the root directory of your application: " +
                        platform.current().fileName
            }));
            return;
        }

        rootNode = results[results.rootElement];

        _buildConfigAccordionNode(rootNode, accordionContainer, 0);

        jQuery(function () {
            var stop = false;
            jQuery("#widget-config h3").click(function (event) {
                if (stop) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    stop = false;
                }
            });
            jQuery("#widget-config").accordion("destroy").accordion({
                header: "> div > h3",
                autoHeight: false
            });
        });
    } catch (e) {
        exception.handle(e, true);
    }
}

event.on("FrameHistoryChange", function (url) {
    module.exports.initialize();
});

module.exports = {
    panel: {
        domId: "config-container",
        collapsed: true,
        pane: "right"
    },
    initialize: function () {
        var results = widgetConfig.getValidationResults();
        _initializeConfigResultsView(results);
    }
};
