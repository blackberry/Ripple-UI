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
//blackberry.invoke.CalendarArguments ( )
//blackberry.invoke.CalendarArguments ( date : Date )
//blackberry.invoke.CalendarArguments ( appointment : blackberry.pim.Appointment )
var _self = function () {
    //readonly  property  Appointment   appointment
    //readonly  property  Date   date
    //readwrite  property  Number   view
    return {
        appointment: undefined,
        date: undefined,
        view: 0
    };
};

//const Number  VIEW_NEW  = 0
_self.__defineGetter__("VIEW_NEW", function () {
    return 0;
});
//const Number  VIEW_VIEW  = 1
_self.__defineGetter__("VIEW_VIEW", function () {
    return 1;
});
//const Number  VIEW_AGENDA  = 2
_self.__defineGetter__("VIEW_AGENDA", function () {
    return 2;
});
//const Number  VIEW_DAY  = 3
_self.__defineGetter__("VIEW_DAY", function () {
    return 3;
});
//const Number  VIEW_DEFAULT  = 4
_self.__defineGetter__("VIEW_DEFAULT", function () {
    return 4;
});
//const Number  VIEW_MONTH  = 5
_self.__defineGetter__("VIEW_MONTH", function () {
    return 5;
});
//const Number  VIEW_WEEK  = 6
_self.__defineGetter__("VIEW_WEEK", function () {
    return 6;
});

module.exports = _self;
