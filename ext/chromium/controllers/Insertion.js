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
(function () {
    function _subscribeToEnableDisable() {
        chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
            var uri = location.href;
            switch (request.action) {
            case "enable":
                break;
            case "disable":
                localStorage.removeItem("tinyhippos-enabled-uri");
                uri = uri.toLowerCase().replace("?enableripple=true", "").replace("&enableripple=true", "");
                break;

            default:
                throw {name: "MethodNotImplemented", message: "Requested action is not supported!"};
            }

            sendResponse({});
            location.reload();
        });
    }

    function _injectBootstrap() {
        document.addEventListener("bus-init", function (e) {
            var send = document.getElementById("bus-send");
            send.addEventListener("DOMNodeInserted", function (evt) {
                chrome.extension.sendRequest({
                    action: evt.target.id,
                    data: evt.target.textContent
                });
            });
        });

        document.documentElement.appendChild((function () {
            //wrap in a section with id to remove in bootstrap
            var scriptElement = document.createElement("script");

            scriptElement.setAttribute("src", chrome.extension.getURL("bootstrap.js?" + new Date().getTime()));
            scriptElement.setAttribute("id", chrome.extension.getURL(""));
            scriptElement.setAttribute("class", "emulator-bootstrap");
            scriptElement.setAttribute("type", "text/javascript");

            return scriptElement;
        }()));
    }

    _subscribeToEnableDisable();

    chrome.extension.sendRequest({"action": "isEnabled", "tabURL": location.href }, function (response) {
        if (response.enabled) {
            _injectBootstrap();
        }
    });
}());
