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

function exec(func) {
    return function () {
        var val = $("#exec-response").val();

        //TODO: handle multiple args
        func.apply(null, val ? [JSON.parse(val)] : []);
        $("#exec-dialog").dialog("close");
    };
}

module.exports = {
    initialize: function () {
        $("#exec-dialog").dialog({
            autoOpen: false,
            modal: true,
            title: "I Haz Cheeseburger?!?!",
            width: 500,
            position: 'center'
        }).hide();

        $("#exec-success").button();
        $("#exec-fail").button();
    },

    show: function (service, action, success, fail) {
        console.log(service);
        console.log(action);
        $("#exec-service").text(service);
        $("#exec-action").text(action);
        $("#exec-dialog").dialog("open");
        $("#exec-success").unbind().bind('click', exec(success));
        $("#exec-fail").unbind().bind('click', exec(fail));
    }
};
