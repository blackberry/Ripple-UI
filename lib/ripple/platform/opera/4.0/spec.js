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
module.exports = {
    id: "opera",
    version: "4.0",
    name: "Opera",
    type: "platform",

    persistencePrefix: "opera-",

    config: require('ripple/platform/opera/4.0/spec/config'),
    device: {},
    ui: require('ripple/platform/opera/4.0/spec/ui'),
    events: require('ripple/platform/opera/4.0/spec/events'),

    objects: {
        navigator: {
            path: "w3c/1.0/navigator"
        },
        widget: {
            path: "opera/4.0/widget"
        },
        defaultStatus: {
            path: "opera/4.0/defaultStatus"
        },
        moveBy: {
            path: "opera/4.0/moveBy"
        },
        moveTo: {
            path: "opera/4.0/moveTo"
        },
        resizeBy: {
            path: "opera/4.0/resizeBy"
        },
        resizeTo: {
            path: "opera/4.0/resizeTo"
        },
        status: {
            path: "opera/4.0/status"
        }
    }
};

