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
var constants = require('ripple/constants'),
    event = require('ripple/event'),
    platform = require('ripple/platform'),
    exception = require('ripple/exception'),
    utils = require('ripple/utils'),
    fileSystem = require('ripple/fileSystem'),
    _console = require('ripple/console'),
    Exception = require('ripple/platform/wac/1.0/Exception'),
    ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
    _self,
    _state = null,
    _STATES = constants.MULTIMEDIA.AUDIO_STATES,
    _currentAudioFile,
    _audio, _loopCount;

event.on("MultimediaAudioStateChanged", function updateAudioState(state) {
    _state = state;
    if (typeof _self.onStateChange === 'function') {
        _self.onStateChange.apply(_self, arguments);
    }
});

_audio = utils.createElement("audio", {
    "id": "multimedia-audio"
});

_audio.addEventListener('error', function () {
    _console.warn(platform.current().name + " :: AudioPlayer encountered an error: " + _audio.error.code);
    if (_audio.error.code === 4) {
        _console.warn(platform.current().name + " :: AudioPlayer error 4 could be caused by missing codecs");
    }
    _state = null;
    event.trigger("MultimediaAudioStateChanged", [null], true);
});

_audio.addEventListener('ended', function handleAudioEnded() {
    event.trigger("MultimediaAudioStateChanged", [_STATES.COMPLETED], true);
    if (_loopCount > 1) {
        _self.open(_currentAudioFile);
        _self.play(_loopCount--);
    }
});

document.getElementById("ui").appendChild(_audio);

function _validateAndSet(state, validStates, callbackBeforeSuccess) {
    var i, valid = false;

    for (i = 0; i < validStates.length; i++) {
        if (validStates[i] === _state) {
            valid = true;
        }
    }

    if (!valid) {
        _console.warn(platform.current().name +
            " :: Attempted to initiate AudioPlayer." + state +
            " in invalid state. current state: " + _state);
    } else {
        if (typeof(callbackBeforeSuccess) === "function") {
            callbackBeforeSuccess.apply();
        }
        event.trigger("MultimediaAudioStateChanged", [state], true);
    }

    return valid;
}

function _validateAudioType(fileUrl) {
    var matched = fileUrl.match(/\.(\w*)$/),
        type = matched ? matched[1] : "";

    if (_audio && _audio.canPlayType("audio/" + type) === "") {
        _console.warn(platform.current().name +
                                " :: Attempting to load an audio that might not work in the current browser [" + fileUrl + "]");
    }
}

_self = {
    onStateChange: undefined,

    open: function (fileUrl) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER, "Multimedia.js.AudioPlayer.open wrong number of arguments", new Exception());
        utils.validateArgumentType(fileUrl, "string", ExceptionTypes.INVALID_PARAMETER, "Multimedia.js.AudioPlayer.open invalid parameter! expected string, fileUrl: " +
            fileUrl, new Exception());

        if (fileUrl.match(/^rtsp:\/\//)) {
            exception.raise(exception.types.MethodNotImplemented, "rtsp:// scheme not yet supported. sorry :(");
        }

        _validateAndSet(_STATES.OPENED, [_STATES.OPENED, _STATES.STOPPED, _STATES.COMPLETED, null], function () {
            _validateAudioType(fileUrl);
            _currentAudioFile = fileSystem.getURI(fileUrl);
            _audio.setAttribute("src", _currentAudioFile);
            _audio.load();
        });
    },

    play: function (repeatTimes) {
        utils.validateNumberOfArguments(1, 1, arguments.length, ExceptionTypes.INVALID_PARAMETER, "Multimedia.js.AudioPlayer.play wrong number of arguments", new Exception());
        utils.validateArgumentType(repeatTimes, "integer", ExceptionTypes.INVALID_PARAMETER, "Multimedia.js.AudioPlayer.play invalid parameter! expected integer, repeatTimes: " + repeatTimes, new Exception());

        if (repeatTimes < 0) {
            exception.raise(ExceptionTypes.INVALID_PARAMETER, "value of repeatTimes must be greater than 0", new Exception());
        }

        if (repeatTimes !== 0) {
            _validateAndSet(_STATES.PLAYING, [_STATES.OPENED, _STATES.STOPPED, _STATES.COMPLETED], function () {
                _loopCount = repeatTimes;
                _audio.play();
            });
        }
    },

    pause: function () {
        _validateAndSet(_STATES.PAUSED, [_STATES.PLAYING], function () {
            _audio.pause();
        });
    },

    resume: function () {
        _validateAndSet(_STATES.PLAYING, [_STATES.PAUSED], function () {
            _audio.play();
        });
    },

    stop: function () {
        _validateAndSet(_STATES.STOPPED, [_STATES.PAUSED, _STATES.PLAYING], function () {
            try {
                _audio.pause();
                _audio.currentTime = 0;
            } catch (e) {
                //HACK: do nothing, this could throw a dom exception 11 sometimes when playing an mp3 or before the file has loaded.
                //see http://developer.palm.com/distribution/viewtopic.php?f=11&t=7568
            }
        });
    }
};

module.exports = _self;
