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
var transport = require('ripple/client/platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/audio/player/";

function Player(locator, type) {
    //we can't use the async prop since we need the ID before we can do anything else.
    var _id = transport.call(_uri + "create", {
            get: {locator: locator, type: type},
            async: false
        }),
        _listener,
        _closed,
        _self,
        _poll = function (path) {
            transport.poll(_uri + path, {
                get: {id: _id}
            }, function (response) {
                if (_listener) {
                    _listener(_self, response.event, response.eventData);
                }

                return !!_listener;
            });
        };

    _self = {
        addPlayerListener: function (callback) {
            if (!_closed && callback) {
                _listener = callback;
                _poll("onStart");
                _poll("onStopped");
                _poll("onBufferingStarted");
                _poll("onBufferingStopped");
                _poll("onDurationUpdated");
                _poll("onEnd");
                _poll("onError");
                _poll("onVolumeChange");
                _poll("onClose");
            }
            else {
                _listener = null;
            }

            return !_closed;
        },

        close: function () {
            _listener = null;
            _closed = true;
            return transport.call(_uri + "close", {get: {id: _id}});
        },

        pause: function () {
            return transport.call(_uri + "pause", {get: {id: _id}});
        },

        play: function () {
            return transport.call(_uri + "play", {get: {id: _id}});
        }
    };

    _self.__defineGetter__("duration", function () {
        return transport.call(_uri + "getDuration", {get: {id: _id}});
    });

    _self.__defineGetter__("mediaTime", function () {
        return transport.call(_uri + "getMediaTime", {get: {id: _id}});
    });

    _self.__defineSetter__("mediaTime", function (val) {
        transport.call(_uri + "setMediaTime", {get: {id: _id, value: val}});
    });

    _self.__defineGetter__("state", function () {
        return transport.call(_uri + "getState", {get: {id: _id}});
    });

    _self.__defineGetter__("volumeLevel", function () {
        return transport.call(_uri + "getVolumeLevel", {get: {id: _id}});
    });

    _self.__defineSetter__("volumeLevel", function (val) {
        transport.call(_uri + "setVolumeLevel", {get: {id: _id, value: val}});
    });

    _self.__defineGetter__("EVENT_BUFFERING_STARTED", function () {
        return "EVENT_BUFFERING_STARTED";
    });
    _self.__defineGetter__("EVENT_BUFFERING_STOPPED", function () {
        return "EVENT_BUFFERING_STOPPED";
    });
    _self.__defineGetter__("EVENT_CLOSED", function () {
        return "EVENT_CLOSED";
    });
    _self.__defineGetter__("EVENT_DEVICE_AVAILABLE", function () {
        return "EVENT_DEVICE_AVAILABLE";
    });
    _self.__defineGetter__("EVENT_DEVICE_UNAVAILABLE", function () {
        return "EVENT_DEVICE_UNAVAILABLE";
    });
    _self.__defineGetter__("EVENT_DURATION_UPDATED", function () {
        return "EVENT_DURATION_UPDATED";
    });
    _self.__defineGetter__("EVENT_END_OF_MEDIA", function () {
        return "EVENT_END_OF_MEDIA";
    });
    _self.__defineGetter__("EVENT_ERROR", function () {
        return "EVENT_ERROR";
    });
    _self.__defineGetter__("EVENT_RECORD_ERROR", function () {
        return "EVENT_ERROR";
    });
    _self.__defineGetter__("EVENT_RECORD_STARTED", function () {
        return "EVENT_RECORD_STARTED";
    });
    _self.__defineGetter__("EVENT_RECORD_STOPPED", function () {
        return "EVENT_RECORD_STOPPED";
    });
    _self.__defineGetter__("EVENT_SIZE_CHANGED", function () {
        return "EVENT_SIZE_CHANGED";
    });
    _self.__defineGetter__("EVENT_STARTED", function () {
        return "EVENT_STARTED";
    });
    _self.__defineGetter__("EVENT_STOPPED", function () {
        return "EVENT_STOPPED";
    });
    _self.__defineGetter__("EVENT_STOPPED_AT_TIME", function () {
        return "EVENT_STOPPED_AT_TIME";
    });
    _self.__defineGetter__("EVENT_VOLUME_CHANGED", function () {
        return "EVENT_VOLUME_CHANGED";
    });

    return _self;
}

Player.__defineGetter__("TIME_UNKNOWN", function () {
    return -1;
});
Player.__defineGetter__("CLOSED", function () {
    return 0;
});
Player.__defineGetter__("UNREALIZED", function () {
    return 100;
});
Player.__defineGetter__("REALIZED", function () {
    return 200;
});
Player.__defineGetter__("PREFETCHED", function () {
    return 300;
});
Player.__defineGetter__("STARTED", function () {
    return 400;
});

module.exports = Player;
