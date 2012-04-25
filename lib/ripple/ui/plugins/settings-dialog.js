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
    tooltip = require('ripple/ui/plugins/tooltip'),
    bus = require('ripple/bus'),
    required = {
        build: {
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName"],
            "webworks.bb10": ["sdk", "projectPath", "outputPath", "projectName"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName"]
        },
        sign: {
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName", "csk_password", "p12_password", "bundle_number"],
            "webworks.bb10": ["sdk", "projectPath", "outputPath", "projectName", "signingPassword", "bundle_number"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName", "signingPassword"]
        },
        launch: {
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName", "device"],
            "webworks.bb10": ["sdk", "projectPath", "outputPath", "projectName", "device"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName", "simulator"]
        }
    },
    _settings = {
        get: function () {
            var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {};
            settings.debug = !!settings["remoteInspector"];

            return settings;
        },
        save: function (settings) {
            db.saveObject("build-settings", settings, platform.getPersistencePrefix());
        }
    },
    port = "9910",
    host = "http://127.0.0.1:" + port + "/ripple",
    progressContainer = jQuery("#options-progress"),
    progressInterval,
    _passwordFields = [
        "signingPassword",
        "devicePassword",
        "csk_password",
        "p12_password"
    ],
    _checkboxFields = [
        "remoteInspector"
    ],
    _passwords = {},
    _self;

function missing(settings, action) {
    return required[action][platform.current().id].filter(function (field) {
        return !settings.hasOwnProperty(field);
    });
}

function _isPasswordField(id) {
    var match = typeof id === "string" && new RegExp("^" + id + "$", "i");
    return match && utils.some(_passwordFields, function (name) {
        return match.test(name);
    });
}

function _isCheckboxField(id) {
    var match = typeof id === "string" && new RegExp("^" + id + "$", "i");
    return match && utils.some(_checkboxFields, function (name) {
        return match.test(name);
    });
}

function table(action) {
    var _table = $("<table class='panel-table'>"),
        _row = {
            row: function (item, desc, opts) {
                var id = "settings-field-" + item.toLowerCase(),
                    input = "",
                    save = function () {
                        var s = _settings.get(),
                            v = $("#" + id).val(),
                            val = opts.type === "number" ? parseInt(v, 10) : v;

                        if (_isCheckboxField(item)) {
                            s[item] = $("#" + id).prop("checked");
                        }
                        else if (val) {
                            (_isPasswordField(item) ? _passwords : s)[item] = val;
                        }
                        else {
                            delete s[item];
                        }
                        _settings.save(s);

                        if (opts.onChanged) {
                            opts.onChanged(s[item]);
                        }
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
                    input = "<input id='" + id + "' type='" + opts.type + "' class='ui-state-default ui-corner-all' style='width:90%' />";
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
                var fs = $("<fieldset class='main'><legend class='cap-text'>" + action + "</legend></fieldset>");

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
        .row("remoteInspector", "Enable Remote Web Inspector", {
            type: "checkbox",
            onChanged: function (enabled) {
                if (enabled) {
                    $("#options-menu-build-warning").show();
                    tooltip.create("#options-menu-build-warning", "Remote Web Inspector should be disabled when packaging for App World release");
                }
                else {
                    $("#options-menu-build-warning").hide();
                }
            }
        })
        .appendTo("#settings-tabs-build");

    switch (platform.current().id) {
    case "webworks.handset":
        sign.row("signingPassword", "Password", {
            type: "password"
        });

        launch.row("simulator", "Simulator", {
            type: "select"
        });

        launch.row("simulatorstatus", "Simulator", {
            type: "span",
            text: "Searching for simulators ..."
        });
        
        break;

    case "webworks.tablet":
        sign.row("csk_password", "CSK Password", {
            type: "password"
        });
        sign.row("p12_password", "P12 Password", {
            type: "password"
        });
        sign.row("bundle_number", "Bundle Number", {
            type: "number"
        });

        launch.row("device", "Playbook IP");
        launch.row("devicePassword", "Playbook Password", {
            type: "password"
        });

        break;

    case "webworks.bb10":
        sign.row("signingPassword", "Signing Password", {
            type: "password"
        });
        sign.row("bundle_number", "Bundle Number", {
            type: "number"
        });

        launch.row("device", "Device IP");
        launch.row("devicePassword", "Device Password", {
            type: "password"
        });

        break;
    }

    sign.appendTo("#settings-tabs-build");
    launch.appendTo("#settings-tabs-build");

    $("#settings-field-simulator").parent().parent().hide();
}

function populate(settings) {
    var fill = function (action, prop) {
        var element = $("#settings-field-" + prop.toLowerCase());

        if (_isPasswordField(prop)) {
            element.val(_passwords[prop]);
        }
        else if (_isCheckboxField(prop)) {
            element.prop("checked", settings[prop]);
        }
        else {
            element.val(settings[prop]);
        }
    };

    fill("build", "sdk");
    fill("build", "projectPath");
    fill("build", "outputPath");
    fill("build", "projectName");
    fill("build", "remoteInspector");

    fill("sign", "signingPassword");
    fill("sign", "csk_password");
    fill("sign", "p12_password");
    fill("sign", "bundle_number");

    fill("launch", "simulator");
    fill("launch", "device");
    fill("launch", "devicePassword");
}

function url(action) {
    var target = "";

    switch (platform.current().id) {
    case "webworks.bb10":
        target = "bb10";
        break;
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
    if (action === "launch") {
        $("#settings-field-simulatorstatus").parent().parent().hide();
        $("#settings-field-simulator").parent().parent().show();
    }
}

function disable(action) {
    $("#options-menu-" + action).addClass("not-ready");
    if (action === "launch") {
        $("#settings-field-simulatorstatus").parent().parent().show();
        $("#settings-field-simulator").parent().parent().hide();
    }
}

function getSimulators() {
    if (!_settings.get().sdk) {
        $("#settings-field-simulatorstatus").text("");
        disable("launch");
        return;
    }

    bus.ajax(
        "POST", 
        host + "/simulators",
        _settings.get(), 
        function (resp) {
            var sims = resp.data.simulators;

            $("#settings-field-simulator").empty();
            if (sims.length > 0) {
                $(resp.data.simulators.map(function (sim) {
                    return "<option value='" + sim + "'>" + sim + "</option>";
                }).join()).appendTo("#settings-field-simulator");

                enable("launch");
            }
            else {
                disable("launch");
                $("#settings-field-simulatorstatus").text("No simulators found :(");
            }
        },
        function () {
            disable("launch");
            $("#settings-field-simulatorstatus").text("Error attempting to get simulators :(");
        }
    );
}

function _startProgress() {
    if (progressInterval) {
        window.clearInterval(progressInterval);
    }
    progressInterval = window.setInterval(function () {
        if (progressContainer.html().length === 5) {
            progressContainer.html(".");
        }
        else {
            progressContainer.html(progressContainer.html() + ".");
        }
    }, 250);
}

function _endProgress() {
    window.clearInterval(progressInterval);
    progressInterval = null;
    progressContainer.html("");
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

        create();

        if (platform.current().id === "webworks.handset") {
            enable("build");
            enable("sign");
            enable("settings");

            getSimulators();
            $("#settings-field-sdk").change(getSimulators);
        }
        else if (platform.current().id === "webworks.tablet") {
            enable("build");
            enable("sign");
            enable("launch");
            enable("settings");
        }
        else if (platform.current().id === "webworks.bb10") {
            enable("build");
            enable("sign");
            enable("launch");
            enable("settings");
        }
    },

    can: function (action) {
        var settings = {};

        utils.mixin(_settings.get(), settings);
        utils.mixin(_passwords, settings);

        return action && missing(settings, action).length === 0;
    },

    value: function (prop) {
        var settings = {};

        utils.mixin(_settings.get(), settings);
        return settings[prop];
    },

    show: function (action) {
        var settings = {};

        utils.mixin(_settings.get(), settings);
        utils.mixin(_passwords, settings);

        populate(settings);

        $("#settings-dialog").dialog("open");
        $("#settings-action").button("option", "label", action || "Close")[action ? "show" : "hide"]();

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
        var settings = _settings.get(),
            data = {},
            poll = function (resp) {
                var notifications = require("ripple/notifications");

                if (resp && resp.code !== 0) {
                    notifications.openNotification("error", "Build request failed with message: " + resp.msg);
                    _endProgress();
                }
                else {
                    if (resp && resp.data.status === "building") {
                        setTimeout(function () {
                            bus.ajax(
                                "GET",
                                host + "/build_status/" + resp.data.id,
                                null,
                                poll,
                                function (error) {
                                    notifications.openNotification("error", "Build request failed with message: " + JSON.stringify(error));
                                    _endProgress();
                                }
                            );
                        }, 500);
                    }
                    else {
                        if (action.match(/sign/)) {
                            settings["bundle_number"] = $("#settings-field-bundle_number").val(parseInt($("#settings-field-bundle_number").val(), 10) + 1).val();
                            _settings.save(settings);
                        }
                        notifications.openNotification("normal", "Build succeeded!");
                        _endProgress();
                    }
                }
            };

        utils.mixin(settings, data);
        utils.mixin(_passwords, data);

        bus.ajax(
            "POST",
            url(action),
            data,
            function (resp) {
                _startProgress();
                poll(resp);
            },
            function (error) {
                var message = "Build request failded with message: " + error.data;

                if (error.code === 0 || error.code === 404) {
                    message += "<br>This could be due to the Build and Deploy services not running or not being installed";
                }

                notifications.openNotification("error", message);
            }
        );
    }
};

module.exports = _self;
