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
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName", "cskPassword", "p12password"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName", "password"]
        },
        launch: {
            "webworks.tablet": ["sdk", "projectPath", "outputPath", "projectName", "playbookIP", "playbookPW"],
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName", "simulator"]
        }
    },
    simulators = null,
    url = "http://127.0.0.1:9900/ripple";

function validate(settings, action) {
    var missing = required[action][platform.current().id].reduce(function (result, field) {
        if (!settings.hasOwnProperty(field)) {
            result.push(field);
        }
        return result;
    }, []);

    return !!missing.length;
}

function table(action) {
    var _table = $("<table class='panel-table'>"),
        _row = {
            row: function (item, desc, opts) {
                var id = "settings-" + action + "-" + item.toLowerCase(),
                    input = "",
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

                return _row;
            },
            appendTo: function (id) {
                var fs = $("<fieldset><legend>" + action + "</legend></fieldset>");

                $(_table).appendTo(fs);
                fs.appendTo($(id));
            }
        };

    return _row;
}
function create() {
    var sign = table('sign'),
        launch = table('launch');

    table('build')
        .row("projectName", "Project Name")
        .row("sdk", "SDK Path")
        .row("projectPath", "Project Root")
        .row("outputPath", "Build Path")
        .appendTo("#settings-tabs-build");

    if (platform.current().id === "webworks.handset") {
        sign.row("password", "Password", {
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
        sign.row("cskPassword", "CSK Password", {
            type: "password"
        });
        sign.row("p12Password", "P12 Password", {
            type: "password"
        });

        launch.row("playbookIP", "Playbook IP");
        launch.row("playbookPW", "Playbook Password");
    }

    sign.appendTo("#settings-tabs-build");
    launch.appendTo("#settings-tabs-build");


    $("#settings-launch-simulator").parent().parent().hide();
}

function populate(settings) {
    var bind = function (action, prop) {
            var id = "#settings-" + action + "-" + prop.toLowerCase(),
                node = $(id),
                save = function () {
                    if (node.val()) {
                        settings[prop] = node.val();
                    }
                    else {
                        delete settings[prop];
                    }
                    db.saveObject("build-settings", settings, platform.getPersistencePrefix());
                };

            node.val(settings[prop]);
            utils.bindAutoSaveEvent(node, save);
            node.change(save);
        };

    bind("build", "sdk");
    bind("build", "projectPath");
    bind("build", "outputPath");
    bind("build", "projectName");

    bind("sign", "password");
    bind("sign", "cskPassword");
    bind("sign", "p12Password");

    bind("launch", "simulator");
    bind("launch", "playbookIP");
    bind("launch", "playbookPW");
}

function _url(action) {
    var target = "";

    switch (platform.current().id) {
    case "webworks.tablet":
        target = "tablet";
        break;
    case "webworks.handset":
        target = "smartphone";
        break;
    }

    return url + "/" + action + "/" + target;
}

function check(id, cb) {
    $.ajax({
        url: url + "/build_status/" + id,
        type: "GET",
        async: true,
        success: cb
    });
}

module.exports = {
    initialize: function (p, baton) {
        $("#settings-dialog").dialog({
            autoOpen: false,
            modal: true,
            width: 700,
            position: 'center'
        }).hide();

        if (platform.current().id === "webworks.handset") {
            $.ajax({
                url: url + "/simulators",
                type: "GET",
                async: true,
                success: function (resp) {
                    var sims = resp.data.simulators;

                    if (sims.length > 0) {
                        $(resp.data.simulators.map(function (sim) {
                            return "<option value='" + sim + "'>" + sim + "</option>";
                        }).join()).appendTo("#settings-launch-simulator");

                        $("#options-menu-launch").removeClass("not-ready");
                        $("#settings-launch-simulatorstatus").parent().parent().hide();
                        $("#settings-launch-simulator").parent().parent().show();
                    }
                    else {
                        $("#settings-launch-simulatorstatus").text("No simulators found :(");
                    }
                },
                error: function () {
                    $("#settings-launch-simulatorstatus").text("Error attempting to get simulators :(");
                }
            });
        }
        else {
            $("#options-menu-launch").removeClass("not-ready");
        }

        create();
        $("#settings-tabs").tabs();
    },

    can: function (action) {
        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {};
        return !validate(settings, action);
    },

    show: function (action) {
        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {};
        populate(settings);
        $("#settings-dialog").dialog("open");
    },

    perform: function (action) {
        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {},
            poll = function (resp) {
                if (resp && resp.data.status === "building") {
                    setTimeout(function () {
                        check(resp.data.id, poll);
                    }, 500);
                }
                else {

                    console.log(resp.data.id + ": " + resp.data.status);
                }
            };

        $.ajax({
            url: _url(action),
            type: "POST",
            data: settings,
            async: true,
            success: function (msg) {
                poll(msg);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
};
