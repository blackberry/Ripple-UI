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
var XHR = window.XMLHttpRequest;

function _handle(object, key) {
    return function () {
        return object[key].apply(object, Array.prototype.slice.call(arguments));
    };
}

function _getter(object, key) {
    return function () {
        return object[key];
    };
}

function _setter(object, key) {
    return function (val) {
        object[key] = val;
    };
}

function _writeable(obj) {
    var newObj = {},
        key;

    // need prototypes
    for (key in obj) {
        //HACK: don't even know what to say bout this, resonseBlob can go fly a kite: related to this issue:
        //https://github.com/blackberry/Ripple-UI/issues/394
        if (key !== "responseBlob" && typeof obj[key] === "function") {
            newObj[key] = _handle(obj, key);
        } else {
            newObj.__defineGetter__(key, _getter(obj, key));
            newObj.__defineSetter__(key, _setter(obj, key));
        }
    }

    return newObj;
}

function _XMLHttpRequest() {
    var Xhr = require('ripple/client/emulatorBridge').xhr() || XHR;
    return _writeable(new Xhr());
}

module.exports = _XMLHttpRequest;
