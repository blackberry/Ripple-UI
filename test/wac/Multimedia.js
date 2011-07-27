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
describe("wac_Multimedia", function () {

    var Multimedia = require('ripple/platform/wac/1.0/Multimedia'),
        AudioPlayer = require('ripple/platform/wac/1.0/AudioPlayer'),
        VideoPlayer = require('ripple/platform/wac/1.0/VideoPlayer'),
        event = require('ripple/event');

    // -------- getVolume

    it("getVolume should return a number between zero and ten", function () {
        event.trigger("MultimediaVolumeChanged", [7]);
        waits(1);
        runs(function () {
            expect(Multimedia.getVolume()).toEqual(7);
        });
    });

    // -------- stopAll

    it("stopAll stops both audio and video modules", function () {
        spyOn(VideoPlayer, "stop");
        spyOn(AudioPlayer, "stop");
        Multimedia.stopAll();
        expect(VideoPlayer.stop).toHaveBeenCalled();
        expect(AudioPlayer.stop).toHaveBeenCalled();
    });

    // -------- isAudioPlaying

    it("isAudioPlaying returns false when not playing", function () {
        event.trigger("MultimediaAudioStateChanged", ["playing"]);
        waits(1);
        runs(function () {
            expect(Multimedia.isAudioPlaying).toEqual(true);
        });
    });

    // -------- isVideoPlaying

    it("isVideoPlaying returns false when not playing", function () {
        event.trigger("MultimediaVideoStateChanged", ["playing"]);
        waits(1);
        runs(function () {
            expect(Multimedia.isVideoPlaying).toEqual(true);
        });
    });

});
