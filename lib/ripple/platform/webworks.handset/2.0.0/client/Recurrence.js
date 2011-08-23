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
function Recurrence() {
    return {
        //readwrite  property  Number   count
        //readwrite  property  Number   dayInMonth
        //readwrite  property  Number   dayInWeek
        //readwrite  property  Number   dayInYear
        //readwrite  property  Date   end
        //readwrite  property  Number   frequency
        //readwrite  property  Number   interval
        //readwrite  property  Number   monthInYear
        //readwrite  property  Number   weekInMonth

        count: null,
        dayInMonth: null,
        dayInWeek: null,
        dayInYear: null,
        end: null,
        frequency: null,
        interval: null,
        monthInYear: null,
        weekInMonth: null
    };
}

Recurrence.__defineGetter__("NO_REPEAT", function () {
    return 0;
});
Recurrence.__defineGetter__("DAILY", function () {
    return 1;
});
Recurrence.__defineGetter__("WEEKLY", function () {
    return 2;
});
Recurrence.__defineGetter__("MONTHLY", function () {
    return 3;
});
Recurrence.__defineGetter__("YEARLY", function () {
    return 4;
});
Recurrence.__defineGetter__("JANUARY", function () {
    return 0x20000;
});
Recurrence.__defineGetter__("FEBRUARY", function () {
    return 0x40000;
});
Recurrence.__defineGetter__("MARCH", function () {
    return 0x80000;
});
Recurrence.__defineGetter__("APRIL", function () {
    return 0x100000;
});
Recurrence.__defineGetter__("MAY", function () {
    return 0x200000;
});
Recurrence.__defineGetter__("JUNE", function () {
    return 0x400000;
});
Recurrence.__defineGetter__("JULY", function () {
    return 0x800000;
});
Recurrence.__defineGetter__("AUGUST", function () {
    return 0x1000000;
});
Recurrence.__defineGetter__("SEPTEMBER", function () {
    return 0x2000000;
});
Recurrence.__defineGetter__("OCTOBER", function () {
    return 0x4000000;
});
Recurrence.__defineGetter__("NOVEMBER", function () {
    return 0x8000000;
});
Recurrence.__defineGetter__("DECEMBER", function () {
    return 0x10000000;
});
Recurrence.__defineGetter__("FIRST", function () {
    return 0x1;
});
Recurrence.__defineGetter__("SECOND", function () {
    return 0x2;
});
Recurrence.__defineGetter__("THIRD", function () {
    return 0x4;
});
Recurrence.__defineGetter__("FOURTH", function () {
    return 0x8;
});
Recurrence.__defineGetter__("FIFTH", function () {
    return 0x10;
});
Recurrence.__defineGetter__("LAST", function () {
    return 0x20;
});
Recurrence.__defineGetter__("SECONDLAST", function () {
    return 0x40;
});
Recurrence.__defineGetter__("THIRDLAST", function () {
    return 0x80;
});
Recurrence.__defineGetter__("FOURTHLAST", function () {
    return 0x100;
});
Recurrence.__defineGetter__("FIFTHLAST", function () {
    return 0x200;
});
Recurrence.__defineGetter__("SUNDAY", function () {
    return 0x10000;
});
Recurrence.__defineGetter__("MONDAY", function () {
    return 0x8000;
});
Recurrence.__defineGetter__("TUESDAY", function () {
    return 0x4000;
});
Recurrence.__defineGetter__("WEDNESDAY", function () {
    return 0x2000;
});
Recurrence.__defineGetter__("THURSDAY", function () {
    return 0x1000;
});
Recurrence.__defineGetter__("FRIDAY", function () {
    return 0x800;
});
Recurrence.__defineGetter__("SATURDAY", function () {
    return 0x400;
});

module.exports = Recurrence;
