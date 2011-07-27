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
    exception = require('ripple/exception'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes');

module.exports = function () {
    this.calendarItemId = undefined;
    this.alarmDate = undefined;
    this.eventStartTime = undefined;
    this.eventEndTime = undefined;
    this.eventName = undefined;
    this.eventNotes = undefined;
    this.alarmed = undefined;

    this.update = function () {
        var events = db.retrieveObject(constants.PIM.CALENDAR_LIST_KEY) || [],
            that = this,
            eventIndex = events.reduce(function (match, value, i) {
                return value.calendarItemId === that.calendarItemId ?
                    i : match;
            }, -1);


        if (eventIndex >= 0) {
            events[eventIndex] = this;
            db.saveObject(constants.PIM.CALENDAR_LIST_KEY, events);
        }
        else {
            exception.raise(ExceptionTypes.INVALID_PARAMETER, "Calendar Item not found: " + (this.calendarItemId || ""), new Exception());
        }
    };
};
