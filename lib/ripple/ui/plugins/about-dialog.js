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
var utils = require('ripple/utils');

module.exports = {
    initialize: function () {
        $("#about-dialog").dialog({
            autoOpen: false,
            position: 'center',
            minWidth: '400'
        });
    },
    show: function () {
        //TODO: Restore this line once framework issue is resolved
        //var port =  window.stagewebview ? stagewebview.serverPort : "9900";
        var port = "9910";

        $.ajax({
            url: "http://127.0.0.1:" + port + "/ripple/about",
            async: true,
            success: function (resp) {
                $("#about-dialog-ripple-build-deploy-version").html("(v" + resp.data.version + ")");
            }
        });


        $.ajax({
            url: utils.extensionUrl() + "package.json",
            async: true,
            success: function (resp) {
                $("#about-dialog-ripple-ui-version").html("(v" + resp.version + ")");
            }
        });

        $("#about-dialog").dialog("open");
    }
};
