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
//blackberry.invoke.AddressBookArguments ( [contact : blackberry.pim.Contact ] )
var _self = function (contact) {
    return {
        contact: contact,
        //readwrite  property  Number   view
        view: 0
    };
};

//const Number  VIEW_NEW  = 0
_self.__defineGetter__("VIEW_NEW", function () {
    return 0;
});
//const Number  VIEW_COMPOSE  = 1
_self.__defineGetter__("VIEW_COMPOSE", function () {
    return 1;
});
//const Number  VIEW_DISPLAY  = 2
_self.__defineGetter__("VIEW_DISPLAY", function () {
    return 2;
});

module.exports = _self;
