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
    constants = require('ripple/constants'),
    audioObj = document.getElementById("multimedia-audio"),
    audioProgress = document.getElementById(constants.COMMON.MULTIMEDIA_AUDIO_PROGRESS_ID);

module.exports = {
    initialize: function () {
        var audioObj = document.getElementById("multimedia-audio"),
            audioProgress = document.getElementById(constants.COMMON.MULTIMEDIA_AUDIO_PROGRESS_ID);

        if (audioObj) {
            event.on("MultimediaVolumeChanged", function (volume) {
                audioObj.volume = parseFloat(volume / 10);
            });

            audioObj.addEventListener("timeupdate", function () {
                var s = parseInt(audioObj.currentTime % 60, 10),
                    m = parseInt((audioObj.currentTime / 60) % 60, 10);

                audioProgress.innerText = ((m > 9) ? m  : "0" + m) + ':' + ((s > 9) ? s  : "0" + s);
            }, false);

            event.on("MultimediaAudioStateChanged", function (state) {
                document.getElementById(constants.COMMON.MULTIMEDIA_AUDIO_STATE_FIELD_ID).innerText = state;
                document.getElementById(constants.COMMON.MULTIMEDIA_AUDIO_FILE_FIELD_ID).innerText = audioObj.getAttribute("src");
            });
        }
    }
};
