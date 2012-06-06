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
var utils = require('ripple/utils'),
    platform = "ripple/platform/webworks.handset/2.0.0/server/",
    core = "ripple/platform/webworks.core/2.0.0/server/",
    systemEvent = require(platform + 'systemEvent'),
    system = {};

// ugh, thanks to the spec...
system.event = systemEvent;
utils.mixin(require(core + "system"), system);

module.exports = {
    blackberry: {
        invoke: require(platform + "invoke"),
        system: system,
        app: require(platform + "app"),
        identity: require(platform + "identity"),
        message: {
            sms: require(platform + "sms"),
            message: require(platform + "message")
        },
        push: require(platform + "push"),
        pim: {
            Task: require(platform + "Task"),
            category: require(platform + "category"),
            memo: require(platform + "memo"),
            appointment: require(platform + "appointment"),
            contact: require(platform + "contact")
        },
        audio: {
            player: require(platform + "audioPlayer")
        },
        ui: {
            menu: require(platform + "menu"),
            dialog: require(core + "dialog")
        },
        phone: require(platform + "phone"),
        io: {
            dir: require(platform + "io/dir"),
            file: require(core + "io/file")
        }
    }
};
