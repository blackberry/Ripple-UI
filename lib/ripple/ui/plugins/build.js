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
var tooltip = require('ripple/ui/plugins/tooltip'),
    settings = require('ripple/ui/plugins/settings-dialog'),
    bus = require('ripple/bus');

function handleBuild() {
    var node = $(this),
        action = node.attr('id').split("-")[2];

    if (node.hasClass("not-ready")) {
        return;
    }

    if (!settings.can(action)) {
        settings.show(action);
    }
    else {
        settings.perform(action);
    }
}

function areServicesRunning(success, fail) {
    bus.ajax(
        "GET",
        "http://127.0.0.1:9910/ripple/about",
        null,
        function () {
            success();
        },
        function (error) {
            fail();
        }
    );
}

function manageServices(action, callBack) {
    bus.send("services", action, function () {
        if (typeof callBack === "function") {
            callBack();
        }
    });
}

module.exports = {
    panel: {
        domId: "build-container",
        collapsed: true,
        pane: "right"
    },

    initialize: function () {
        $("#options-menu-run").click(handleBuild);
        $("#options-menu-build").click(handleBuild);
        $("#options-menu-sign").click(handleBuild);
        $("#options-menu-launch").click(handleBuild);

        $('#options-menu-start-service').click(function () {
            manageServices("start", function (result) {
                $('#options-menu-services-stop').show();
                $('#options-menu-services-start').hide();
            });
        });

        $('#options-menu-stop-service').click(function () {
            manageServices("stop", function (result) {
                $('#options-menu-services-stop').hide();
                $('#options-menu-services-start').show();
            });
        });

        $("#options-menu-settings").click(function () {
            settings.show();
        });

        if (settings.value("remoteInspector")) {
            $("#options-menu-build-warning").show();
            tooltip.create("#options-menu-build-warning", "Remote Web Inspector should be disabled when packaging for App World release");
        }

        areServicesRunning(
            function () {
                $('#options-menu-services-stop').show();
                $('#options-menu-services-start').hide();
            },
            function () {
                $('#options-menu-services-stop').hide();
                $('#options-menu-services-start').show();
            }
        );
    }
};
