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
var event = require('ripple/event'),
    _bg,
    _fg,
    _exit;

event.on("AppRequestBackground", function () {
    var baton = _bg;
    _bg = null;
    return baton && baton.pass({code: 1});
});

event.on("AppRequestForeground", function () {
    var baton = _fg;
    _fg = null;
    return baton && baton.pass({code: 1});
});

event.on("AppExit", function () {
    var baton = _exit;
    _exit = null;
    return baton && baton.pass({code: 1});
});

module.exports = {
    onBackground: function (get, post, baton) {
        baton.take();
        _bg = baton;
        return {code: 1};
    },

    onForeground: function (get, post, baton) {
        baton.take();
        _fg = baton;
        return {code: 1};
    },

    onExit: function (get, post, baton) {
        baton.take();
        _exit = baton;
        return {code: 1};
    }
};
