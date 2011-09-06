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
            "webworks.handset": ["sdk", "projectPath", "outputPath", "projectName", "emulator"]
        }
    },
    url = "http://10.137.42.27:9900/ripple";

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
            row: function (prop, desc, opts) {
                var id = "settings-" + action + "-" + prop.toLowerCase(),
                    input = "",
                    row;

                opts = opts || { type: "text" };

                if (opts.type === "select") {
                    input = "<select id='" + id + "' class='ui-state-default ui-corner-all'>";
                    utils.forEach(opts.values, function (v, k) {
                        input += "<option value='" + k + "'>" + v + "</option>";
                    });
                    input += "</select>";
                }
                else {
                    input = "<input id='" + id + "' type='" + opts.type + "' class='ui-state-default ui-corner-all' />";
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

        launch.row("emulator", "Emulator", {
            type: "select",
            values: {
                "9000-5.0.0.592": "9000-5.0.0.592",
                "9800-6.0.0.141": "9800-6.0.0.141",
                "9930-7.0.0.261": "9930-7.0.0.261"
            }
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

    bind("launch", "emulator");
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
    initialize: function () {
        $("#settings-dialog").dialog({
            autoOpen: false,
            modal: true,
            width: 600,
            position: 'center'
        }).hide();

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
            console.log(action);
        var settings = db.retrieveObject("build-settings", platform.getPersistencePrefix()) || {},
            poll = function (resp) {
                console.log(resp.data.id + ": " + resp.data.status);
                if (resp && resp.data.status === "building") {
                    setTimeout(function () {
                        check(resp.data.id, poll);
                    }, 500);
                }
            };

        $.ajax({
            url: _url(action),
            type: "POST",
            data: settings,
            async: true,
            success: function (msg) {
                console.log(msg);
                poll(msg);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
};
