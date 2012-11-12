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
var utils = ripple('utils'),
    platform = "platform/webworks.handset/2.0.0/server/",
    core = "platform/webworks.core/2.0.0/server/",
    systemEvent = ripple(platform + 'systemEvent'),
    system = {};

// ugh, thanks to the spec...
system.event = systemEvent;
utils.mixin(ripple(core + "system"), system);

module.exports = {
    blackberry: {
        invoke: ripple(platform + "invoke"),
        system: system,
        app: ripple(platform + "app"),
        identity: ripple(platform + "identity"),
        message: {
            sms: ripple(platform + "sms"),
            message: ripple(platform + "message")
        },
        push: ripple(platform + "push"),
        pim: {
            Task: ripple(platform + "Task"),
            category: ripple(platform + "category"),
            memo: ripple(platform + "memo"),
            appointment: ripple(platform + "appointment"),
            contact: ripple(platform + "contact")
        },
        audio: {
            player: ripple(platform + "audioPlayer")
        },
        ui: {
            menu: ripple(platform + "menu"),
            dialog: ripple(core + "dialog")
        },
        phone: ripple(platform + "phone"),
        io: {
            dir: ripple(platform + "io/dir"),
            file: ripple(core + "io/file")
        }
    }
};
