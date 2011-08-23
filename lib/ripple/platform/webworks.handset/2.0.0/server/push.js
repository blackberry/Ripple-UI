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
    utils = require('ripple/utils'),
    _handlers = {},
    _self;

function listenersChanged() {
    var ports = utils.map(_handlers, function (handler) {
        return handler.port;
    });
    event.trigger("PushListenersChanged", [ports]);
}

event.on("Push", function (data, port) {
    var handler = _handlers["port_" + port];
    delete _handlers["port_" + port];
    window.setTimeout(function () {
        if (!_handlers["port_" + port]) {
            //doesn't look like they are coming back ;)
            listenersChanged();
        }
    }, 100);
    return handler && handler.baton.pass({code: 1, data: data});
});

_self = {

    onPush: function (args, post, baton) {
        if (!args.port) {
            throw "no port specified";
        }
        else if (typeof args.port !== 'number') {
            throw "port is not a number";
        }
        baton.take();
        _handlers["port_" + args.port] = {
            port: args.port,
            baton: baton
        };
        listenersChanged();
    }
};

module.exports = _self;
