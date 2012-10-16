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
var event = require('ripple/client/event'),
    app = require('ripple/client/app'),
    _self;

_self = {
    event: require('ripple/client/platform/webworks.tablet/2.0.0/server/appEvent'),

    exit: function () {
        event.trigger("AppExit");
        return {code: 1};
    },

    author: function () {
        return {code: 1, data: app.getInfo().author};
    },

    authorEmail: function () {
        return {code: 1, data: app.getInfo().authorEmail};
    },

    authorURL: function () {
        return {code: 1, data: app.getInfo().authorURL};
    },

    copyright: function () {
        return {code: 1, data: app.getInfo().copyright};
    },

    description: function () {
        return {code: 1, data: app.getInfo().description};
    },

    id: function () {
        return {code: 1, data: app.getInfo().id};
    },

    license: function () {
        return {code: 1, data: app.getInfo().license};
    },

    licenseURL: function () {
        return {code: 1, data: app.getInfo().licenseURL};
    },

    name: function () {
        return {code: 1, data: app.getInfo().name};
    },

    version: function () {
        return {code: 1, data: app.getInfo().version};
    }
};

module.exports = _self;
