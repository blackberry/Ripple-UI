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
    VideoPlayer = require('ripple/platform/wac/1.0/VideoPlayer'),
    AudioPlayer = require('ripple/platform/wac/1.0/AudioPlayer'),
    constants = require('ripple/constants'),
    _volume = 5,
    _audioState,
    _videoState,
    _self;

event.on("MultimediaVolumeChanged", function updateVolume(volume) {
    _volume = volume;
});

event.on("MultimediaAudioStateChanged", function updateAudioState(state) {
    _audioState = state;
});

event.on("MultimediaVideoStateChanged", function updateVideoState(state) {
    _videoState = state;
});

_self = {

    isAudioPlaying: undefined,
    isVideoPlaying: undefined,

    getVolume: function () {
        return _volume;
    },

    stopAll: function () {
        VideoPlayer.stop();
        AudioPlayer.stop();
    }
};

_self.__defineGetter__("isAudioPlaying", function () {
    return _audioState === constants.MULTIMEDIA.AUDIO_STATES.PLAYING;
});

_self.__defineGetter__("isVideoPlaying", function () {
    return _videoState === "playing";
});

module.exports = _self;
