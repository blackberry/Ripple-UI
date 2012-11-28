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
var constants = ripple('constants'),
    event = ripple('event');

module.exports = {
    initialize: function () {
        var videoObj,
            videoProgress = document.getElementById(constants.COMMON.MULTIMEDIA_VIDEO_PROGRESS_ID);

        event.on("MultimediaAppVideoPlayerCreated", function (videoDOMObj) {
            videoObj = videoDOMObj;

            videoObj.addEventListener("timeupdate", function () {
                var s = parseInt(videoObj.currentTime % 60, 10),
                    m = parseInt((videoObj.currentTime / 60) % 60, 10);

                videoProgress.innerText = ((m > 9) ? m  : "0" + m) + ':' + ((s > 9) ? s  : "0" + s);
            }, false);
        });

        event.on("MultimediaVolumeChanged", function (volume) {
            if (videoObj) {
                videoObj.volume = parseFloat(volume / 10);
            }
        });

        event.on("MultimediaVideoStateChanged", function (state) {
            document.getElementById(constants.COMMON.MULTIMEDIA_VIDEO_STATE_FIELD_ID).innerText = state;
            document.getElementById(constants.COMMON.MULTIMEDIA_VIDEO_FILE_FIELD_ID).innerText = videoObj.getAttribute("src");
        });
    }
};
