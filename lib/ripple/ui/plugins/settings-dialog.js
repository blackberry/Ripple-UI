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
    platform = require('ripple/platform'),
    notifications = require('ripple/notifications'),
    transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    required = {
        build: {
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName"]
        },
        sign: {
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName", "csk_password", "p12_password"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName", "signingPassword"]
        },
        launch: {
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName", "device", "devicePassword"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName", "simulator"]
        }
    },
    host = "http://127.0.0.1:9900/ripple",
    _self;

function missing(settings, action) {
    return required[action][platform.current().id].filter(function (field) {
        return !settings.hasOwnProperty(field);
    });
}

function table(action) {
    var _table = $("<table class='panel-table'>"),
        _row = {
            row: function (item, desc, opts) {
                var id = "settings-field-" + item.toLowerCase(),
                    input = "",
                    save = function () {
                        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {};

                        if ($("#" + id).val()) {
                            settings[item] = $("#" + id).val();
                        }
                        else {
                            delete settings[item];
                        }
                        db.saveObject("build-settings", settings, platform.getPersistencePrefix());
                    },
                    row;

                opts = opts || { type: "text" };

                switch (opts.type) {
                case "select":
                    input = "<select id='" + id + "' class='ui-state-default ui-corner-all' style='width:100%'/>";
                    break;
                case "span":
                    input = "<span id = '" + id + "'>" + opts.text + "</span>";
                    break;
                default:
                    input = "<input id='" + id + "' type='" + opts.type + "' class='ui-state-default ui-corner-all' style='width:100%' />";
                    break;
                }

                row = $("<tr>" +
                    "<td><label for='" + id + "' class='ui-text-label'>" + desc + "</label></td>" +
                    "<td>" + input + "</td>" +
                "</tr>");

                row.appendTo(_table);

                //bind save handlers to the row
                utils.bindAutoSaveEvent(row.find("#" + id).change(save), save);

                return _row;
            },
            appendTo: function (id) {
                var fs = $("<fieldset><legend class='cap-text'>" + action + "</legend></fieldset>");

                $(_table).appendTo(fs);
                fs.appendTo($(id));
            }
        };

    return _row;
}

function create() {
    var build = table('build'),
        sign = table('sign'),
        launch = table('launch');

    build
        .row("sdk", "SDK Path")
        .row("projectPath", "Project Root")
        .row("projectName", "Archive Name")
        .row("outputPath", "Output Folder")
        .appendTo("#settings-tabs-build");

    if (platform.current().id === "webworks.handset") {
        sign.row("signingPassword", "Password", {
            type: "password"
        });

        launch.row("simulator", "Simulator", {
            type: "select"
        });

        launch.row("simulatorStatus", "Simulator", {
            type: "span",
            text: "Searching for simulators ..."
        });
    }
    else if (platform.current().id === "webworks.tablet") {
        sign.row("csk_password", "CSK Password", {
            type: "password"
        });
        sign.row("p12_password", "P12 Password", {
            type: "password"
        });

        launch.row("device", "Playbook IP");
        launch.row("devicePassword", "Playbook Password", {
            type: "password"
        });
    }

    sign.appendTo("#settings-tabs-build");
    launch.appendTo("#settings-tabs-build");

    $("#settings-field-simulator").parent().parent().hide();
}

function populate(settings) {
    var fill = function (action, prop) {
        $("#settings-field-" + prop.toLowerCase()).val(settings[prop]);
    };

    fill("build", "sdk");
    fill("build", "projectPath");
    fill("build", "outputPath");
    fill("build", "projectName");

    fill("sign", "signingPassword");
    fill("sign", "csk_password");
    fill("sign", "p12_password");

    fill("launch", "simulator");
    fill("launch", "device");
    fill("launch", "devicePassword");
}

function url(action) {
    var target = "";

    switch (platform.current().id) {
    case "webworks.tablet":
        target = "tablet";
        break;
    case "webworks.handset":
        target = "smartphone";
        break;
    }

    return host + "/" + action + "/" + target;
}

function enable(action) {
    $("#options-menu-" + action).removeClass("not-ready");
    $("#settings-field-simulatorstatus").parent().parent().hide();
    $("#settings-field-simulator").parent().parent().show();
}

function getSimulators() {
    $.ajax({
        url: host + "/simulators",
        type: "GET",
        async: true,
        success: function (resp) {
            var sims = resp.data.simulators;

            if (sims.length > 0) {
                $(resp.data.simulators.map(function (sim) {
                    return "<option value='" + sim + "'>" + sim + "</option>";
                }).join()).appendTo("#settings-field-simulator");

                enable("launch");
            }
            else {
                $("#settings-field-simulatorstatus").text("No simulators found :(");
            }
        },
        error: function () {
            $("#settings-field-simulatorstatus").text("Error attempting to get simulators :(");
        }
    });
}

_self = {
    initialize: function () {
        $("#settings-dialog").dialog({
            autoOpen: false,
            modal: true,
            width: 700,
            title: "Settings",
            position: 'center'
        }).hide();

        $("#settings-tabs").tabs();
        $("#settings-action").button();

        if (platform.current().id === "webworks.handset") {
            enable("build");
            enable("sign");
            enable("settings");
            getSimulators();
        }
        else if (platform.current().id === "webworks.tablet") {
            enable("build");
            enable("sign");
            enable("launch");
            enable("settings");
        }

        create();
    },

    can: function (action) {
        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {};
        return missing(settings, action).length === 0;
    },

    show: function (action) {
        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {};
        populate(settings);
        $("#settings-dialog").dialog("open");
        $("#settings-action").button("option", "label", action || "")[action ? "show" : "hide"]();

        if (action) {
            missing(settings, action).forEach(function (field) {
                $("#settings-field-" + field.toLowerCase()).effect("highlight", {color: "red"}, 1500);
            });

            $("#settings-action").unbind("click").click(function () {
                if (_self.can(action)) {
                    _self.perform(action);
                    $("#settings-dialog").dialog("close");
                }
                else {
                    _self.show(action);
                }
            });
        }
    },

    perform: function (action) {
        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {},
            poll = function (resp) {
                var notifications = require("ripple/notifications");

                if (resp && resp.data.status === "building") {
                    setTimeout(function () {
                        $.ajax({
                            url: host + "/build_status/" + resp.data.id,
                            type: "GET",
                            async: true,
                            success: poll,
                            error: function (error, errorText) {
                                notifications.openNotification("error", "Build request failed with message: " + errorText);
                            }
                        });
                    }, 500);
                }
                else {
                    if (resp.data.code === 1) {
                        notifications.openNotification("error", "Build request failed with message: " + resp.msg);
                    }
                    else {
                        notifications.openNotification("normal", "Build succeded!");
                    }
                }
            };

        //always set debug to true
        settings.debug = true;

        $.ajax({
            url: url(action),
            type: "POST",
            data: settings,
            async: true,
            success: function (msg) {
                poll(msg);
            },
            error: function (xhr, errorText) {
                notifications.openNotification("error", "Build request failed with message: " + errorText);
            }
        });
    }
};

module.exports = _self;
