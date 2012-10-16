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
var event = require('ripple/client/event');

module.exports = {
    panel: {
        domId: "invoke-container",
        collapsed: true,
        pane: "left"
    },
    initialize: function () {
        document.getElementById("invoke-send")
            .addEventListener("click", function () {
                var invokeInfo = {};

                invokeInfo.uri = document.getElementById("invoke-uri-text").value;
                invokeInfo.source = document.getElementById("invoke-source-text").value;
                invokeInfo.target = document.getElementById("invoke-target-text").value;
                invokeInfo.action = document.getElementById("invoke-action-text").value;
                invokeInfo.type = document.getElementById("invoke-mime-type-text").value;
                invokeInfo.extension = document.getElementById("invoke-extension-text").value;
                invokeInfo.data = document.getElementById("invoke-data-text").value;
                if (invokeInfo.data) {
                    invokeInfo.data = window.btoa(invokeInfo.data);
                }

                event.trigger("AppInvoke", [invokeInfo]);
            }, false);
    }
};
