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
        _enabled = {},
        _self;

    function isLocalRequest(uri) {
        return !!uri.match(/^https?:\/\/(127\.0\.0\.1|localhost)|^file:\/\//);
    }

    function initialize() {
        // check version info for showing welcome/update views
        var version = window.localStorage["ripple-version"],
            xhr = new window.XMLHttpRequest(),
            //I know this is dirty, so sue me dick
            sleep = function (ms) {
                var date = new Date(), curDate = null;
                do {curDate = new Date();}
                while (curDate - date < ms);
            },
            connected = true,
            lag = 0,
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
            if (request.action === "isEnabled") {
                console.log("isEnabled? ==> " + request.tabURL);
                sendResponse({"enabled": tinyHippos.Background.isEnabled(request.tabURL, sender.tab.id)});
            }
            else if (request.action === "enable") {
                console.log("enabling ==> " + request.tabURL);
                tinyHippos.Background.enable();
                sendResponse();
            }
            else if (request.action === "lag") {
                lag = JSON.parse(request.data) ? 1000 : 0;
                console.log("lagging ==> " + lag);
                sendResponse();
            }
            else if (request.action === "network") {
                connected = JSON.parse(request.data);  
                console.log("network connected ==> " + connected);
            }
            else if (request.action === "userAgent") {
                userAgent = request.data;
                console.log("user agent ==> " + userAgent);
            }
            else {
                throw {name: "MethodNotImplemented", message: "Requested action is not supported!"};
            }
        });

        chrome.webRequest.onBeforeRequest.addListener(function (details) {
                var enabled = tinyHippos.Background.isEnabled(details.url, details.tabId);
                if (enabled) {
                    sleep(lag);
                }
                return {cancel: enabled && !connected && !isLocalRequest(details.url)};
            }, 
            {urls: ["<all_urls>"]}, 
            ["blocking"]);

        chrome.webRequest.onBeforeSendHeaders.addListener(function (details) {
            if (tinyHippos.Background.isEnabled(details.url, details.tabId)) {
                var ua = details.requestHeaders.reduce(function (match, header) {
                    return header.name === 'User-Agent' ? header : match;
                }, null);

                ua.value = userAgent || ua.value;
            }

            return {
                requestHeaders: details.requestHeaders
            };
        }, {urls: ["<all_urls>"]}, ["requestHeaders", "blocking"] );

        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
            if (tinyHippos.Background.isEnabled(tab.url, tabId)) {
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

    function _persistEnabled(url, id) {
        _enabled[id] = url;
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
                _persistEnabled(tab.url, tab.id);
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

                delete _enabled[tab.id];
                console.log(_enabled);

                localStorage["tinyhippos-enabled-uri"] = JSON.stringify(jsonObject);

                chrome.tabs.sendRequest(tab.id, {"action": "disable", "tabURL": tab.url }, function (response) {});
            });
        },

        isEnabled: function (url, tabId, enabledURIs) {
            if (url.match(/enableripple=true/i)) {
                _persistEnabled(url, tabId);
                return true;
            }

            // HACK: I'm sure there's a WAY better way to do this regex
            if ((url.match(/^file:\/\/\//) && url.match(/\/+$/)) || url.match(/(.*?)\.(jpg|jpeg|png|gif|css|js)$/)) {
                return false;
            }

            if (_enabled[tabId]) {
                return true;
            }

            enabledURIs = enabledURIs || _getEnabledURIs();

            if (url.length === 0) {
                return false;
            }
            else if (enabledURIs[url]) {
                return true;
            }

            return tinyHippos.Background.isEnabled(url.replace(/.[^\/]*$/, ""), tabId, enabledURIs);
        }
    };

    initialize();

    return _self;
}());
