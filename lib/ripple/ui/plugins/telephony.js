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
var constants = require('ripple/constants'),
    db = require('ripple/db'),
    utils = require('ripple/utils'),
    _console = require('ripple/console'),
    platform = require('ripple/platform'),
    _optionTemplate = "<option value='[key]' [selected]>[value]</option>",
    _textTemplate = "<td><input class='call-[key] ui-state-default ui-corner-all' type='text' value='[value]'></td>";

function _addRow(calltype, number, name) {
    var row = "<tr class='call-details'>",
        option = function (key) {
            return _optionTemplate.replace("[key]", key)
                         .replace("[selected]", calltype === key ? "selected" : "")
                         .replace("[value]", key.charAt(0).toUpperCase() + key.slice(1));
        },
        text = function (key, value) {
            return _textTemplate.replace("[key]", key)
                                .replace("[value]", value);
        };

    calltype = calltype || "missed";
    number = number || "";
    name = name || "";

    row += text("number", number);
    row += text("name", name);
    row += "</tr><tr>";
    row += "<td></td>";
    row += '<td><button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only">' +
            '<span class="ui-button-text">Call</span></button>';
    row += "<select class='calltype-select ui-state-default ui-corner-all'>";
    row += option("missed");
    row += option("received");
    row += option("outgoing");
    row += "</select></td>";
    row += "</tr>";

    if (jQuery("#calls-list-body tr").length > 0) {
        jQuery("#calls-list-body tr:last").after(row);
    }
    else {
        jQuery("#calls-list-body").append(row);
    }

    jQuery("#calls-list-body tr:last button").bind("click", function () {

        var calltype = jQuery(this).next().val(),
            number = jQuery(this).parent().parent().prev().find(".call-number").val();

        _console.log(platform.current().name + " :: called Widget.Telephony.onCallEvent function [" + calltype + "," + number + "]");

        if (Widget.Telephony.onCallEvent) {
            Widget.Telephony.onCallEvent(calltype, number);
        }
    });
}

function _initializeTelephonyView() {

    var calls = db.retrieveObject(constants.TELEPHONY.CALL_LIST_KEY);

    utils.forEach(calls, function (call) {
        _addRow(call.callRecordType, call.callRecordAddress, call.callRecordName);
    });
}

function _createCall(index, row) {
    var call = new Widget.Telephony.CallRecord();

    call.callRecordId = index;
    call.callRecordType = row.find(".calltype-select").val();
    call.callRecordAddress = row.find(".call-number").val();
    call.callRecordName = row.find(".call-name").val();
    call.startTime = new Date();
    call.durationSeconds = 60;

    return call;
}

module.exports = {
    panel: {
        domId: "telephony",
        collapsed: true,
        pane: "right"
    },
    initialize: function () {
        jQuery("#calls-new-button").bind("click", function () {
            _addRow();
        });

        jQuery("#calls-save-button").bind("click", function () {
            var calls = [];

            jQuery("#calls-list-body tr.call-details").each(function (index) {
                var row = jQuery(this),
                    call = _createCall(index, row);

                if (call.callRecordAddress && call.callRecordName) {
                    calls.push(call);
                }
                else {
                    row.next().remove();
                    row.remove();
                }
            });

            db.saveObject(constants.TELEPHONY.CALL_LIST_KEY, calls);
        });
    }
};
