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
// TODO: could use a bit of refactoring sugar
var db = require('ripple/client/db'),
    _LEFT_PANEL_COLLAPSE = ".left-panel-collapse",
    _RIGHT_PANEL_COLLAPSE = ".right-panel-collapse",
    _LEFT_PANEL = ".left",
    _RIGHT_PANEL = ".right",
    _SAVE_KEY = "panel-collapsed",
    _leftEngaged, _rightEngaged, _store;

function _persist() {
    db.saveObject(_SAVE_KEY, _store);
}

function _updateLayout() {
    var node = document.querySelector("#device-container"),
        leftPanelClosed = document.querySelector(_LEFT_PANEL).style.opacity === "0.1",
        rightPanelClosed = document.querySelector(_RIGHT_PANEL).style.opacity === "0.1";

    if (leftPanelClosed && rightPanelClosed) {
        node.style.margin = "0 auto 0 auto";
    } else if (rightPanelClosed) {
        jQuery(node).animate({
            "marginRight": "3%"
        });
    } else if (leftPanelClosed) {
        jQuery(node).animate({
            "marginLeft": "3%"
        });
    } else {
        node.style.margin = "0 auto 0 auto";
    }
}

function _process(collapseNode, panelNode, side, callback) {
    var jNode = collapseNode.children("span"),
        jPanelNode = jQuery(panelNode),
        properties = {},
        collapseProperties = {},
        options = {
            duration: 600,
            complete: callback
        },
        oldIcon, newIcon;

    if (_store[side] === true) {
        _store[side] = false;

        oldIcon = (side === "left" ? "ui-icon-arrowthick-1-e" : "ui-icon-arrowthick-1-w");
        newIcon = (side === "left" ? "ui-icon-arrowthick-1-w" : "ui-icon-arrowthick-1-e");

        properties[side] = "0px";
        collapseProperties[side] = "345px";
        properties.opacity = "1";
    }
    else {
        _store[side] = true;

        oldIcon = (side === "left" ? "ui-icon-arrowthick-1-w" : "ui-icon-arrowthick-1-e");
        newIcon = (side === "left" ? "ui-icon-arrowthick-1-e" : "ui-icon-arrowthick-1-w");

        properties[side] = "-340px";
        collapseProperties[side] = "5px";
        properties.opacity = "0.1";
    }

    jNode.removeClass(oldIcon).addClass(newIcon);

    jPanelNode.animate(properties, options);
    collapseNode.animate(collapseProperties, 600);

    _persist();
}

module.exports = {
    initialize: function () {
        var rightCollapseNode = jQuery(_RIGHT_PANEL_COLLAPSE),
            leftCollapseNode = jQuery(_LEFT_PANEL_COLLAPSE);

        _store = db.retrieveObject(_SAVE_KEY) || {
            left: false,
            right: false
        };

        if (_store.left === true) {
            jQuery(_LEFT_PANEL).css({
                left: "-340px",
                opacity: "0.1"
            });

            leftCollapseNode.css({
                left: "5px"
            }).children("span").removeClass("ui-icon-arrowthick-1-w").addClass("ui-icon-arrowthick-1-e");
        }

        if (_store.right === true) {
            jQuery(_RIGHT_PANEL).css({
                right: "-340px",
                opacity: "0.1"
            });

            rightCollapseNode.css({
                right: "5px"
            }).children("span").removeClass("ui-icon-arrowthick-1-e").addClass("ui-icon-arrowthick-1-w");
        }

        leftCollapseNode.bind("click", function () {
            if (!_leftEngaged) {
                _leftEngaged = true;
                _process(leftCollapseNode, _LEFT_PANEL, "left", function () {
                    _leftEngaged = false;
                    _updateLayout();
                });
            }
        });

        rightCollapseNode.bind("click", function () {
            if (!_rightEngaged) {
                _rightEngaged = true;
                _process(rightCollapseNode, _RIGHT_PANEL, "right", function () {
                    _rightEngaged = false;
                    _updateLayout();
                });
            }
        });

        _updateLayout();
    }
};
