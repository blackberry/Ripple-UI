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
//create my dom collection node in UI

var utils = require('ripple/utils'),
    constants = require('ripple/constants'),
    notifications = require('ripple/notifications'),
    Player = require('ripple/platform/webworks/2.0.0/client/AudioPlayer'),
    _handlers = {
        loadstart: {},
        canplaythrough: {},
        durationchange: {},
        ended: {},
        error: {},
        play: {},
        pause: {},
        volumechange: {},
        close: {}
    },
    extract = {
        time: function (audio) {
            return audio.currentTime;
        },
        duration: function (audio) {
            return audio.duration;
        },
        error: function (audio) {
            return audio.error;
        },
        nothing: function (audio) {
            return null;
        }
    },
    container;

container = utils.createElement("section", {
    id: "webworks-audio-players"
});

document.getElementById("ui").appendChild(container);

function _errClosed(method) {
    notifications.openNotification(constants.NOTIFICATIONS.TYPES.ERROR,
       "attempted to call " + method + " on a player that is already closed. This is a very bad thing to do :)");
    return false;
}

function _removeHandler(type, id) {
    var audio = document.getElementById(id);

    if (audio && _handlers[type][id]) {
        audio.removeEventListener(type, _handlers[type][id]);
        delete _handlers[type][id];
    }
}

function _addHandler(type, id, callback) {
    var audio = document.getElementById(id);

    if (audio) {
        _removeHandler(type, id);
        audio.addEventListener(type, callback);
        _handlers[type][id] = callback;
    }
}

function proxyEvent(from, map) {
    var audio = document.getElementById(map.id);

    if (audio) {
        map.baton.take();
        _addHandler(from, map.id, function () {
            _removeHandler(from, map.id);
            map.baton.pass({code: 1, data: {
                event: map.target,
                eventData: map.data(this)
            }});
        });
    }
    else {
        return {code: -1, data: {event: "EVENT_ERROR", eventData: 5}};
    }
}

module.exports = {

    create: function (args) {
        var id = Math.uuid(),
            audio = utils.createElement("audio", {
                id: id
            });

        audio.setAttribute("src", args.locator);

        if (args.type) {
            audio.setAttribute("type", args.type);
        }

        container.appendChild(audio);
        audio.load();

        if (audio.error) {
            throw "there was a problem opening the audio file";
        }

        return {code: 1, data: id};
    },

    play: function (args) {
        var audio = document.getElementById(args.id),
            playing;

        if (audio) {
            audio.play();
            audio.rimState = Player.STARTED;
            playing = !!!audio.error;
        }
        else {
            playing = _errClosed("play");
        }

        return {code: 1, data: playing};
    },

    pause: function (args) {
        var audio = document.getElementById(args.id),
            paused;

        if (audio) {
            audio.pause();
            paused = !!!audio.error;
        } else {
            paused = _errClosed("pause");
        }

        return {code: 1, data: paused};
    },

    close: function (args) {
        var audio = document.getElementById(args.id),
            callback = _handlers["close"][args.id],
            closed = true;

        if (audio) {
            if (callback) {
                callback();
            }
            container.removeChild(audio);
        }
        else {
            closed = _errClosed("close");
        }

        return {code: 1, data: closed};
    },

    onStart: function (args, post, baton) {
        return proxyEvent("play", {
            id: args.id,
            baton: baton,
            target: "EVENT_START",
            data: extract.time
        });
    },

    onStopped: function (args, post, baton) {
        return proxyEvent("pause", {
            id: args.id,
            baton: baton,
            target: "EVENT_STOPPED",
            data: extract.time
        });
    },

    onBufferingStarted: function (args, post, baton) {
        return proxyEvent("loadstart", {
            id: args.id,
            baton: baton,
            target: "EVENT_BUFFERING_STARTED",
            data: extract.time
        });
    },

    onBufferingStopped: function (args, post, baton) {
        return proxyEvent("canplaythrough", {
            id: args.id,
            baton: baton,
            target: "EVENT_BUFFERING_STOPPED",
            data: extract.time
        });
    },

    onDurationUpdated: function (args, post, baton) {
        return proxyEvent("durationchange", {
            id: args.id,
            baton: baton,
            target: "EVENT_DURATION_UPDATED",
            data: extract.duration
        });
    },

    onEnd: function (args, post, baton) {
        return proxyEvent("ended", {
            id: args.id,
            baton: baton,
            target: "EVENT_END_OF_MEDIA",
            data: extract.duration
        });
    },

    onError: function (args, post, baton) {
        return proxyEvent("error", {
            id: args.id,
            baton: baton,
            target: "EVENT_ERROR",
            data: extract.error
        });
    },

    onVolumeChange: function (args, post, baton) {
        return proxyEvent("volumechange", {
            id: args.id,
            baton: baton,
            target: "EVENT_VOLUME_CHANGED",
            data: extract.nothing
        });
    },

    onClose: function (args, post, baton) {
        return proxyEvent("close", {
            id: args.id,
            baton: baton,
            target: "EVENT_CLOSED",
            data: extract.nothing
        });
    },

    getDuration: function (args) {
        var audio = document.getElementById(args.id),
            duration;

        if (audio) {
            duration = audio.duration;
        }
        else {
            _errClosed("getDuration");
            duration = -1;
        }

        return {code: 1, data: duration};
    },

    getMediaTime: function (args) {
        var audio = document.getElementById(args.id),
            time;

        if (audio) {
            time = audio.currentTime;
        }
        else {
            _errClosed("getMediaTime");
            time = -1;
        }

        return {code: 1, data: time};
    },

    setMediaTime: function (args) {
        var audio = document.getElementById(args.id);

        if (audio) {
            audio.currentTime = args.value;
        }
        else {
            _errClosed("setMediaTime");
        }

        return {code: 1};
    },

    getVolumeLevel: function (args) {
        var audio = document.getElementById(args.id),
            level;

        if (audio) {
            level = audio.volume * 100;
        }
        else {
            _errClosed("getVolumeLevel");
            level = -1;
        }

        return {code: 1, data: level};
    },

    setVolumeLevel: function (args) {
        var audio = document.getElementById(args.id);

        if (audio) {
            audio.volume = args.value / 100;
        }
        else {
            _errClosed("setVolumeLevel");
        }

        return {code: 1};
    },

    getState: function (args) {
        var audio = document.getElementById(args.id),
            state = audio ? audio.rimState || Player.PREFETCHED : Player.CLOSED;
        return {code: 1, data: state};
    }
};
