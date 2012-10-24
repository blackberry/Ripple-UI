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
var db = require('ripple/client/db'),
    constants = require('ripple/client/constants'),
    utils = require('ripple/client/utils'),
    PROXY_SETTINGS_LIST = constants.XHR.PROXY_SETTINGS_LIST,
    DEFAULT_LOCAL_PORT = constants.XHR.DEFAULT_LOCAL_PORT,
    DEFAULT_LOCAL_ROUTE = constants.XHR.DEFAULT_LOCAL_ROUTE,
    LOCAL_PROXY_PORT_SETTING = constants.XHR.LOCAL_PROXY_PORT_SETTING,
    LOCAL_PROXY_ROUTE_SETTING = constants.XHR.LOCAL_PROXY_ROUTE_SETTING,
    PROXY_SETTING = constants.XHR.PROXY_SETTING;

function _saveAndReload(key, value) {
    jWorkflow.order(function (prev, baton) {
        baton.take();
        db.save(key, value, null, baton.pass);
    }).start(function () {
        window.tinyHipposReload = true;
        location.reload();
    });
}

function _initialize() {
    var select = document.getElementById("settings-xhr-proxy"),
        about = require('ripple/client/ui/plugins/about-dialog'),
        localProxyRouteSetting,
        localProxyPortSetting,
        route;

    select.value = String(db.retrieve(PROXY_SETTING));

    // default to remote if unknown value is found in db
    if (!Object.keys(PROXY_SETTINGS_LIST).some(function (key) {
        return select.value === PROXY_SETTINGS_LIST[key];
    })) {
        select.value = PROXY_SETTINGS_LIST.remote;
        db.save(select.value);
    }

    if (select.value === PROXY_SETTINGS_LIST.local) {
        localProxyPortSetting = jQuery("#" + LOCAL_PROXY_PORT_SETTING);
        localProxyPortSetting
            .val(db.retrieve(LOCAL_PROXY_PORT_SETTING) || DEFAULT_LOCAL_PORT)
            .parent()
            .parent()
            .css("display", "table-row");

        utils.bindAutoSaveEvent(localProxyPortSetting, function () {
            db.save(LOCAL_PROXY_PORT_SETTING, localProxyPortSetting.val());
        });

        localProxyRouteSetting = jQuery("#" + LOCAL_PROXY_ROUTE_SETTING);
        route = db.retrieve(LOCAL_PROXY_ROUTE_SETTING);
        localProxyRouteSetting
            .val(route || route === "" ? route : DEFAULT_LOCAL_ROUTE)
            .parent()
            .parent()
            .css("display", "table-row");

        utils.bindAutoSaveEvent(localProxyRouteSetting, function () {
            db.save(LOCAL_PROXY_ROUTE_SETTING, localProxyRouteSetting.val());
        });
    }

    select.addEventListener("change", function () {
        _saveAndReload(PROXY_SETTING, this.value);
    }, false);

    $("#options-menu-about").click(function () {
        about.show();
    });
}

module.exports = {
    panel: {
        domId: "settings-container",
        collapsed: true,
        pane: "right"
    },
    initialize: _initialize
};
