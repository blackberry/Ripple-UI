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
var audioObjects = {},
    noop = function () {};

function createAudio(id, src, error) {
    var a = new Audio();
    a.addEventListener("error", function (e) {
        error(new window.MediaError(1, e.toString()));
    });
    a.addEventListener("durationchange", function () {
        //HACK: I don't like this but best way for us to update the duration
        cordova.require("cordova/plugin/Media").onStatus(id, 2, this.duration);
    });
    a.src = src;

    return a;
}

module.exports = {
    create: function (success, error, args) {
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            src = args[1];

        error = error || noop;
        success = success || noop;

        audioObjects[id] = createAudio(id, src, error);
        success();
    },
    startPlayingAudio: function (success, error, args) {
        error = error || noop;
        success = success || noop;
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            audio = audioObjects[id];

        if (args.length === 1) {
            error("Media source argument not found");
            return;
        }

        if (audio) {
            audio.pause();
            audioObjects[id] = undefined;
        }

        audio = audioObjects[id] = createAudio(id, args[1], error);
        audio.play();

        success();
    },
    stopPlayingAudio: function (success, error, args) {
        error = error || noop;
        success = success || noop;
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            audio = audioObjects[id];

        if (!audio) {
            error("Audio Object has not been initialized");
            return;
        }

        audio.pause();
        audioObjects[id] = undefined;

        success();
    },
    seekToAudio: function (success, error, args) {
        error = error || noop;
        success = success || noop;
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            audio = audioObjects[id];

        if (!audio) {
            error("Audio Object has not been initialized");
            return;
        } else if (args.length === 1) {
            error("Media seek time argument not found");
            return;
        } else {
            try {
                audio.currentTime = args[1];
            } catch (e) {
                error("Error seeking audio: " + e);
            }
        }

        success();
    },
    pausePlayingAudio: function (success, error, args) {
        error = error || noop;
        success = success || noop;
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            audio = audioObjects[id];

        if (!audio) {
            error("Audio Object has not been initialized");
            return;
        }

        audio.pause();
        success();
    },
    getCurrentPositionAudio: function (success, error, args) {
        error = error || noop;
        success = success || noop;
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            audio = audioObjects[id];

        if (!audio) {
            error("Audio Object has not been initialized");
            return;
        }

        success(audio.currentTime);
    },
    getDuration: function (success, error, args) {
        error = error || noop;
        success = success || noop;
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            audio = audioObjects[id];

        if (!audio) {
            error("Audio Object has not been initialized");
            return;
        }

        success(audio.duration);
    },
    startRecordingAudio: function (success, error, args) {
        error = error || noop;
        error("Not supported");
    },
    stopRecordingAudio: function (success, error, args) {
        error = error || noop;
        error("Not supported");
    },
    release: function (success, error, args) {
        error = error || noop;
        success = success || noop;
        if (!args.length) {
            error("Media Object id was not sent in arguments");
            return;
        }

        var id = args[0],
            audio = audioObjects[id];

        if (audio) {
            audioObjects[id] = undefined;
            audio.src = undefined;
            //delete audio;
        }

        success();
    }
};
