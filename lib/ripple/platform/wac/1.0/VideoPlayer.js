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
var _self,
    _console = require('ripple/console'),
    event = require('ripple/event'),
    utils = require('ripple/utils'),
    fileSystem = require('ripple/fileSystem'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    exception = require('ripple/exception'),
    _currentlySet,
    _currentVideoFile,
    _state = null,
    _loopCount, _video,
    _STATES = {
        "OPENED": "opened",
        "STOPPED": "stopped",
        "PAUSED": "paused",
        "PLAYING": "playing",
        "COMPLETED": "completed"
    };

function _validateVideoType(fileUrl) {
    var matched = fileUrl.match(/\.(\w*)$/),
        maps = {
            "ogv": "ogg",
            "flv": "mp4"
        },
        type = matched ? matched[1] : "";

    if (_video && _video.canPlayType("video/" + (maps[type] || type)) === "") {
        _console.warn("Attempting to load a video that might not work in the current browser [" + fileUrl + "]");
    }
}

function _validateAndSet(state, validStates, callbackBeforeSuccess) {
    var i, valid = false;

    for (i = 0; i < validStates.length; i++) {
        if (validStates[i] === _state) {
            valid = true;
        }
    }

    if (!valid) {
        _console.warn("Attempted to initiate VideoPlayer." + state +
            " in invalid state. current state: " + _state);
    } else {
        if (typeof(callbackBeforeSuccess) === "function") {
            callbackBeforeSuccess.apply();
        }
        event.trigger("MultimediaVideoStateChanged", [state], true);
    }

    return valid;
}

event.on("MultimediaVideoStateChanged", function (state) {
    _state = state;
    if (typeof _self.onStateChange === "function") {
        _self.onStateChange.apply(_self, [state]);
    }
});

_self = module.exports = {
    onStateChange: undefined,

    open: function (fileUrl) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER,
           "VideoPlayer.open invalid number of arguments", new Exception());
        utils.validateArgumentType(fileUrl, "string", ExceptionTypes.INVALID_PARAMETER,
           "VideoPlayer.open expected valid fileUrl but got ->" + fileUrl, new Exception());

        if (!_video) {
            return;
        }

        _validateAndSet(_STATES.OPENED, [_STATES.OPENED, _STATES.STOPPED, _STATES.COMPLETED, null], function () {
            _validateVideoType(fileUrl);
            _currentVideoFile = fileSystem.getURI(fileUrl);
            _video.setAttribute("src", _currentVideoFile);
            _video.setAttribute("width", "100%");
            _video.addEventListener("ended", function () {
                event.trigger("MultimediaVideoStateChanged", [_STATES.COMPLETED], true);
                if (_loopCount > 1) {
                    _self.open(_currentVideoFile);
                    _self.play(_loopCount--);
                }
            }, false);
        });
    },

    setWindow: function (domObject) {
        utils.validateNumberOfArguments(0, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER,
           "VideoPlayer.setWindow invalid number of arguments", new Exception());

        if (_currentlySet) {
            _currentlySet.removeChild(_video);
            _currentlySet = null;
            _video = null;
        }

        if (domObject !== null) {
            _video = utils.createElement("video", {
                "id": "multimedia-video"
            });
            domObject.appendChild(_video);
            _currentlySet = domObject;
            event.trigger("MultimediaAppVideoPlayerCreated", [_video], true);
        }
    },

    play: function (repeatTimes) {
        utils.validateNumberOfArguments(1, 1, arguments.length,
            ExceptionTypes.INVALID_PARAMETER, "invalid number of arguments (expected one)", new Exception());

        if (typeof repeatTimes !== "number" || repeatTimes < 0) {
            exception.raise(ExceptionTypes.INVALID_PARAMETER, "VideoPlayer.play was passed an invalid number of play times: " + repeatTimes, new Exception());
        }
        if (repeatTimes !== 0) {
            if (!_video) {
                return;
            }
            _loopCount = repeatTimes;
            _validateAndSet(_STATES.PLAYING, [_STATES.OPENED, _STATES.STOPPED, _STATES.COMPLETED], function () {
                _video.play();
            });
        }
    },

    pause: function () {
        if (!_video) {
            return;
        }
        _validateAndSet(_STATES.PAUSED, [_STATES.PLAYING], function () {
            _video.pause();
        });
    },

    resume: function () {
        if (!_video) {
            return;
        }
        _validateAndSet(_STATES.PLAYING, [_STATES.PAUSED], function () {
            _video.play();
        });
    },

    stop: function () {
        if (!_video) {
            return;
        }
        _validateAndSet(_STATES.STOPPED, [_STATES.PAUSED, _STATES.PLAYING], function () {
            _video.pause();
            _video.setAttribute("src", _currentVideoFile); // hack
        });
    }

};
