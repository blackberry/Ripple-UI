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
function PushData(data, port) {
    this.port = port;
    this.data = data;

    this.getHeaderField = function (field) {
        if (field === undefined || field === null) {
            throw "no field specified";
        }
        else if (!(typeof field === 'number' && field >= 0) && typeof field !== 'string') {
            throw "field is not valid";
        }

        return data.headerField[field];
    };

    this.getRequestURI =  function () {
        return data.requestURI;
    };

    this.getSource = function () {
        return data.source;
    };

    this.isChannelEncrypted = data.isChannelEncrypted;

    this.payload = data.payload;

    this.__defineGetter__("ACCEPT", function () {
        return 0;
    });
    this.__defineGetter__("DECLINE_USERDCR", function () {
        return 1;
    });
    this.__defineGetter__("DECLINE_USERDCU", function () {
        return 2;
    });
    this.__defineGetter__("DECLINE_USERPND", function () {
        return 3;
    });
    this.__defineGetter__("DECLINE_USERREQ", function () {
        return 4;
    });
    this.__defineGetter__("DECLINE_USERRFS", function () {
        return 5;
    });
}

module.exports = PushData;
