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
var _console = require('ripple/console'),
    platform = require('ripple/platform'),
    event = require('ripple/event'),
    exception = require('ripple/exception'),
    utils = require('ripple/utils');

module.exports = {
    panel: {
        domId: "events-container",
        collapsed: true,
        pane: "right"
    },
    initialize: function () {
        var eventContainer = document.getElementById("event-container"),
            // TODO: modify to platform.getPlatformEvents()
            spec = platform.current(),
            eventSelect, eventArgs, events, fireEventButton;

        if (!spec.events) {
            return;
        }

        utils.forEach(spec.events.contexts, function (eventContext, name) {

            eventSelect = utils.createElement("select", {
                "id": "events-select-" + name,
                "class": "ui-state-default ui-corner-all"
            });

            eventArgs = utils.createElement("select", {
                id: "events-args-" + name,
                "class": "ui-state-default ui-corner-all"
            });

            events = eventContext.events;

            utils.forEach(events, function (event) {
                eventSelect.appendChild(utils.createElement("option", {
                    "innerText": event.description,
                    "value": event.name
                }));
            });

            fireEventButton = utils.createElement("button", {
                "id": "event-button-" + name,
                "class": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"
            });

            fireEventButton.appendChild(utils.createElement("span", {
                "class": "ui-button-text",
                "innerText": "Fire Event"
            }));

            eventContainer.appendChild(utils.createElement("p", {
                "innerText": "Context = " + eventContext.context
            }));
            eventContainer.appendChild(eventSelect);
            eventContainer.appendChild(eventArgs);
            eventContainer.appendChild(utils.createElement("br"));
            eventContainer.appendChild(fireEventButton);

            jQuery(eventArgs).hide();

            jQuery(fireEventButton).click(function () {
                var select = jQuery("#" + eventSelect.id)[0],
                    args = [];

                if (events[select.value].args) {
                    args.push(eventArgs.value);
                }
                _console.log("fired event => " + eventContext.context + "." + select.children[select.selectedIndex].innerText);
                try {
                    event.trigger(select.value, args);
                }
                catch (e) {
                    exception.throwMaskedException(e);
                }
            });

            jQuery(eventSelect).change(function () {
                var args = jQuery(eventArgs);

                args.empty();

                if (events[this.value].args) {

                    utils.forEach(events[this.value].args, function (arg, index) {
                        eventArgs.appendChild(utils.createElement("option", {
                            innerText: arg,
                            value: index
                        }));
                    });

                    args.show();
                }
                else {
                    args.hide();
                }

            });

        });
    }
};
