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
describe("cordova media bridge object", function () {
    var media = require('ripple/platform/cordova/1.6/bridge/media'),
        audio = {
            play: jasmine.createSpy("audio.play"),
            pause: jasmine.createSpy("audio.pause")
        };

    beforeEach(function () {
        audio.play.reset();
        global.Audio = window.Audio = jasmine.createSpy().andReturn(audio);
    });

    describe("when creating", function () {
        it("creates an audio object for the src", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.create(success, error, [
                "id", "foo.mp3"
            ]);

            expect(window.Audio).toHaveBeenCalledWith("foo.mp3");
            expect(success).toHaveBeenCalled();
            expect(error).not.toHaveBeenCalled();
        });

        it("calls the error callback when args is empty", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.create(success, error, []);

            expect(success).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalled();
        });

        it("can be called without a success callback", function () {
            expect(function () {
                media.create(null, null, ["1"]);
            }).not.toThrow();
        });

        it("can be called without an error callback", function () {
            expect(function () {
                media.create(jasmine.createSpy(), null, ["1"]);
            }).not.toThrow();
        });
    });

    describe("when starting audio", function () {
        it("creates an audio object", function () {
            media.startPlayingAudio(null, null, ["a", "fred.mp3"]);
            expect(window.Audio).toHaveBeenCalledWith("fred.mp3");
        });

        it("calls play on the audio object", function () {
            media.startPlayingAudio(null, null, ["b", "bar.mp3"]);
            expect(audio.play).toHaveBeenCalled();
            expect(audio.play.callCount).toBe(1);
        });

        it("calls the error callback when no args", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.startPlayingAudio(success, error, []);

            expect(error).toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
        });

        it("calls the error callback when just an id arg", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.startPlayingAudio(success, error, ["larry"]);

            expect(error).toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
        });

        it("calls the pause method when id exists (as well as the play method)", function () {
            media.startPlayingAudio(null, null, ["c", "crownRoyal.mp3"]);
            media.startPlayingAudio(null, null, ["c", "wisers.mp3"]);
            expect(audio.pause).toHaveBeenCalled();
            expect(audio.play).toHaveBeenCalled();
            expect(audio.pause.callCount).toBe(1);
            expect(audio.play.callCount).toBe(2);
        });

        it("calls the success callback when things are all rainbows and ponies", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.startPlayingAudio(success, error, ["chimay", "trios pistolues"]);

            expect(success).toHaveBeenCalled();
            expect(error).not.toHaveBeenCalled();
        });
    });

    describe("when stopping audio", function () {
        it("calls the error callback when no args", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.stopPlayingAudio(success, error, []);

            expect(error).toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
        });

        it("calls the error callback when it can't find the audio obj", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.stopPlayingAudio(success, error, ['lamb_burger']);

            expect(error).toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
        });

        it("calls pause on the audio object when things are 20% cooler", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.startPlayingAudio(success, error, ['milk_duds', 'yum.mp3']);
            audio.pause.reset();
            media.stopPlayingAudio(success, error, ['milk_duds']);

            expect(audio.pause).toHaveBeenCalled();
        });

        it("calls pause on the success callback when things are 20% cooler", function () {
            var success = jasmine.createSpy("success"),
                error = jasmine.createSpy("error");

            media.startPlayingAudio(success, error, ['nomnomnom', 'yum.mp3']);
            audio.pause.reset();
            media.stopPlayingAudio(success, error, ['nomnomnom']);

            expect(success).toHaveBeenCalled();
        });
    });
});
