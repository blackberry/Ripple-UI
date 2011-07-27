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
function Attendee() {
    return {
        //readwrite  property  String   address
        //readwrite  property  Number   type

        address: null,
        type: null
    };
}

Attendee.__defineGetter__("ORGANIZER", function () {
    return 0;
});

Attendee.__defineGetter__("INVITED", function () {
    return 1;
});

Attendee.__defineGetter__("ACCEPTED", function () {
    return 2;
});

Attendee.__defineGetter__("DECLINED", function () {
    return 3;
});

Attendee.__defineGetter__("TENTATIVE", function () {
    return 4;
});

module.exports =  Attendee;
