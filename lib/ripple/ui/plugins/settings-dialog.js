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
var db = require('ripple/db'),
    utils = require('ripple/utils'),
    _with = function (data) {
        return {
            check: {
                build: function () {
                    return data.sdkPath &&
                           data.projectRoot &&
                           data.buildPath &&
                           data.projectName;
                },
                sign: function () {
                    return false;
                },
                launch: function () {
                    return false;
                }
            }
        };
    };

function create() {
    var table = function (action) {
            var _table = $("<table>"),
                _row = {
                    row: function (prop, desc) {
                        var id = "settings-" + action + "-" + prop.toLowerCase(),
                            row = $("<tr>" +
                                "<td><label for='" + id + "' class='ui-text-label'>" + desc + "</label></td>" +
                                "<td><input id='" + id + "' type='text' class='ui-state-default ui-corner-all' /></td>" +
                            "</tr>");

                        row.appendTo(_table);

                        return _row;
                    },
                    appendTo: function (id) {
                        $(id).html(_table);
                    }
                };

            return _row;
        };

    table('build')
        .row("sdkPath", "SDK Path")
        .row("projectRoot", "Project Root")
        .row("buildPath", "Build Path")
        .row("projectName", "Project Name")
        .appendTo("#settings-tabs-build");

    table('launch')
        .row("sdkPath", "SDK Path")
        .row("projectRoot", "Project Root")
        .appendTo("#settings-tabs-launch");
}

function populate(config) {
    var bind = function (action, prop) {
            var id = "#settings-" + action + "-" + prop.toLowerCase();
            utils.bindAutoSaveEvent($(id).val(config[prop]), function () {
                config[prop] = $(id).val();
                db.saveObject("build-settings", config);
            });
        };

    bind("build", "sdkPath");
    bind("build", "projectRoot");
    bind("build", "buildPath");
    bind("build", "projectName");
}

module.exports = {
    initialize: function () {
        $("#settings-dialog").dialog({
            autoOpen: false,
            modal: true,
            width: 800,
            height: 600,
            position: 'center'
        }).hide();

        create();
        $("#settings-tabs").tabs();
    },

    can: function(action) {
        var config = db.retrieveObject("build-settings") || {};
        return _with(config).check[action]();
    },

    show: function(action) {
        var config = db.retrieveObject("build-settings") || {};

        populate(config);

        var tab = 0;

        switch (action) {
        case "build":
            tab = 0;
            break;
        case "sign":
            tab = 1;
            break;
        case "launch":
            tab = 2;
            break;
        }

        $("#settings-tabs").tabs("select", tab);
        $("#settings-dialog").dialog("open");
    }
};
