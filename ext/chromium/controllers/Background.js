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
if (!window.tinyHippos) {
    window.tinyHippos = {};
}

tinyHippos.Background = (function () {
    var _wasJustInstalled = false,
        _self;

    function isLocalRequest(uri) {
        return !!uri.match(/^https?:\/\/(127\.0\.0\.1|localhost)|^file:\/\//);
    }

    function initialize() {
        // check version info for showing welcome/update views
        var version = window.localStorage["ripple-version"],
            xhr = new window.XMLHttpRequest(),
            userAgent,
            requestUri = chrome.extension.getURL("manifest.json");

        _self.bindContextMenu();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var manifest = JSON.parse(xhr.responseText),
                    currentVersion = manifest.version;

                if (!version) {
                    _wasJustInstalled = true;
                }

                if (version !== currentVersion) {
                    webkitNotifications.createHTMLNotification('/views/update.html').show();
                }

                window.localStorage["ripple-version"] = currentVersion;
            }
        };

        xhr.open("GET", requestUri, true);

        xhr.send();

        chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
            switch (request.action) {
            case "isEnabled":
                console.log("isEnabled? ==> " + request.tabURL);
                sendResponse({"enabled": tinyHippos.Background.isEnabled(request.tabURL)});
                break;
            case "enable":
                console.log("enabling ==> " + request.tabURL);
                tinyHippos.Background.enable();
                sendResponse();
                break;
            case "userAgent":
                console.log("user agent ==> " + userAgent);
                userAgent = request.data;
                break;
            case "version":
                sendResponse(version);
                break;
            case "xhr":
                var xhr = new XMLHttpRequest(),
                    postData = new FormData(),
                    data = JSON.parse(request.data);

                console.log("xhr ==> " + data.url);

                $.ajax({
                    type: data.method,
                    url: data.url,
                    async: true,
                    data: data.data,
                    success: function (data, status) {
                        sendResponse({
                            code: 200,
                            data: data
                        });
                    },
                    error: function (xhr, status, errorMessage) {
                        sendResponse({
                            code: xhr.status,
                            data: status
                        });
                    }
                });
                break;
            default:
                throw {name: "MethodNotImplemented", message: "Requested action is not supported!"};
                break;
            };
        });

        chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
            if (tinyHippos.Background.isEnabled(details.url)) {
                var ua = details.requestHeaders.reduce(function (match, header) {
                    return match || header.name === 'User-Agent' || match;
                });

                ua.value = userAgent || ua.value;
            }

            return {
                requestHeaders: details.requestHeaders
            };
        }, {urls: ["<all_urls>"]}, ["requestHeaders", "blocking"] );

        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (tinyHippos.Background.isEnabled(tab.url)) {
                chrome.tabs.executeScript(tabId, {
                    code: "rippleExtensionId = '" + chrome.extension.getURL('') + "';",
                    allFrames: false
                }, function () {
                    chrome.tabs.executeScript(tabId, {
                        file: "bootstrap.js",
                        allFrames: false
                    });
                });
            }
        });
    }

    function _getEnabledURIs() {
        var parsed = localStorage["tinyhippos-enabled-uri"];
        return parsed ? JSON.parse(parsed) : {};
    }

    function _persistEnabled(url) {
        var jsonObject = _getEnabledURIs();
        jsonObject[url.replace(/.[^\/]*$/, "")] = "widget";
        localStorage["tinyhippos-enabled-uri"] = JSON.stringify(jsonObject);
    }

    _self = {
        metaData: function () {
            return {
                justInstalled: _wasJustInstalled,
                version: window.localStorage["ripple-version"]
            };
        },

        bindContextMenu: function () {
            var id = chrome.contextMenus.create({
                "type": "normal",
                "title": "Emulator"
            });

            // TODO: hack for now (since opened tab is assumed to be page context was called from
            // eventually will be able to pass in data.pageUrl to enable/disable when persistence refactor is done
            chrome.contextMenus.create({
                "type": "normal",
                "title": "Enable",
                "contexts": ["page"],
                "parentId": id,
                "onclick": function (data) {
                        _self.enable();
                    }
            });

            chrome.contextMenus.create({
                "type": "normal",
                "title": "Disable",
                "contexts": ["page"],
                "parentId": id,
                "onclick": function (data) {
                        _self.disable();
                    }
            });
        },

        enable: function () {
            chrome.tabs.getSelected(null, function (tab) {
                console.log("enable ==> " + tab.url);
                _persistEnabled(tab.url);
                chrome.tabs.sendRequest(tab.id, {"action": "enable", "mode": "widget", "tabURL": tab.url }, function (response) {});
            });
        },

        disable: function () {
            chrome.tabs.getSelected(null, function (tab) {
                console.log("disable ==> " + tab.url);

                var jsonObject = _getEnabledURIs(),
                    url = tab.url;

                while (url && url.length > 0) {
                    url = url.replace(/.[^\/]*$/, "");
                    if (jsonObject[url]) {
                        delete jsonObject[url];
                        break;
                    }
                }

                localStorage["tinyhippos-enabled-uri"] = JSON.stringify(jsonObject);

                chrome.tabs.sendRequest(tab.id, {"action": "disable", "tabURL": tab.url }, function (response) {});
            });
        },

        isEnabled: function (url, enabledURIs) {
            if (url.match(/enableripple=true/i)) {
                _persistEnabled(url);
                return true;
            }

            // HACK: I'm sure there's a WAY better way to do this regex
            if ((url.match(/^file:\/\/\//) && url.match(/\/+$/)) || url.match(/(.*?)\.(jpg|jpeg|png|gif|css|js)$/)) {
                return false;
            }

            enabledURIs = enabledURIs || _getEnabledURIs();

            if (url.length === 0) {
                return false;
            }
            else if (enabledURIs[url]) {
                return true;
            }

            return tinyHippos.Background.isEnabled(url.replace(/.[^\/]*$/, ""), enabledURIs);
        }
    };

    initialize();

    return _self;
}());
