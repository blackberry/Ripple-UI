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
var utils = require('ripple/utils'),
    bus = require('ripple/bus');

function _initializeEulaCheck() {
    var width = jQuery(document).width(),
        p = (width / 2) - 277;


    $(".eula-window").show();
    $(".eula-dialog").show().css({left: p + "px"});

    $("#eula-accept").click(function () {
        bus.send("acceptEula", null, function (result) {
            $(".eula-window").hide();
            $(".eula-dialog").hide();
        });
    });

    $("#eula-decline").click(function () {
        bus.send("disable", null, null);
    });
}

module.exports = {
    initialize: function () {
        //HACK: there has to be a better way!!!
        if ($("#extension-url").val().match(/geelfhphabnejjhdalkjhgipohgpdnoc/)) {
            // do nothing, extension was installed from the Chrome Store
            return;
        }

        bus.send("checkEula", null, function (response) {
            console.log("eula response: ", response);
            if (response === false) {
                _initializeEulaCheck();
            }
        });
    }
};
