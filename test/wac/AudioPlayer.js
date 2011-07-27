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
describe("wac_AudioPlayer", function () {

    var platform = require('ripple/platform'),
        utils = require('ripple/utils'),
        event = require('ripple/event'),
        _console = require('ripple/console'),
        exception = require('ripple/exception'),
        fileSystem = require('ripple/fileSystem'),
        ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
        AudioPlayer = require('ripple/platform/wac/1.0/AudioPlayer'),
        sinon = require('sinon'),
        s,
        audioNode = document.getElementById("multimedia-audio"),
        AUDIO_FILE = "../../audio.mp3";

    beforeEach(function () {
        s = sinon.sandbox.create();
        spyOn(platform, "current").andReturn({name: "default"});

        audioNode.canPlayType = function () {
            return "probably";
        };

        // think jsdom does not have special methods like play on audio
        audioNode.play = function () {};
        audioNode.pause = function () {};
        audioNode.stop = function () {};
        audioNode.load = function () {};

        //just hack this out since we don't need the functionality for our tests
        audioNode.addEventListener = function () {};
    });

    afterEach(function () {
        s.verifyAndRestore();
        //HACK: this is a hack in that we want to reset the state between tests.
        AudioPlayer.onStateChange = null;
        event.trigger("MultimediaAudioStateChanged", [null], true);
    });

    // -------- open

    it("open throws invalid param when given invalid fileUrl", function () {
        expect(function () {
            AudioPlayer.open(false);
        }).toThrow();
    });

    it("open throws invalid param when given invalid number of arguments", function () {
        expect(function () {
            AudioPlayer.open();
        }).toThrow();
    });

    it("open throws method not implemented when opening rtsp scheme", function () {
        expect(function () {
            AudioPlayer.open("rtsp://some/file.mp3");
        }).toThrow();
    });

    it("open sets audio tag src attribute", function () {
        s.mock(audioNode).expects("load").once();
        AudioPlayer.open(AUDIO_FILE);
        expect(audioNode.getAttribute("src")).toEqual(AUDIO_FILE);
    });

    it("open washes file url for virtual direcories", function () {
        s.mock(fileSystem).expects("getURI").once().withExactArgs(AUDIO_FILE).returns(AUDIO_FILE);
        AudioPlayer.open(AUDIO_FILE);
    });

    // ------- invalid state checks
    // TODO: this could be a lot more tight (test every state case)

    it("open warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.open(AUDIO_FILE);
    });

    it("play warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        s.mock(audioNode).expects("play").never();
        AudioPlayer.play(1);
    });

    it("pause warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        AudioPlayer.open(AUDIO_FILE);
        s.mock(audioNode).expects("pause").never();
        AudioPlayer.pause();
    });

    it("resume warns to console when called from invalid state", function () {
        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        s.mock(audioNode).expects("play").never();
        s.mock(_console).expects("warn").once();
        AudioPlayer.resume();
    });

    it("stop warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        AudioPlayer.open(AUDIO_FILE);
        s.mock(audioNode).expects("pause").never();
        AudioPlayer.stop();
    });

    // -------- play

    it("play throws invalid param when given invalid number of plays (negative integer)", function () {
        expect(function () {
            AudioPlayer.open(AUDIO_FILE);
            AudioPlayer.play(-7);
        }).toThrow();
    });

    it("play throws invalid param when given invalid number of plays (boolean)", function () {
        expect(function () {
            AudioPlayer.open(AUDIO_FILE);
            AudioPlayer.play(false);
        }).toThrow();
    });

    it("play throws invalid param when given invalid number of plays (string)", function () {
        expect(function () {
            AudioPlayer.open(AUDIO_FILE);
            AudioPlayer.play("what up dawg");
        }).toThrow();
    });

    it("play throws invalid param when given invalid number of arguments", function () {

        expect(function () {
            AudioPlayer.open(AUDIO_FILE);
            AudioPlayer.play(1, 2);
        }).toThrow();

        expect(function () {
            AudioPlayer.open(AUDIO_FILE);
            AudioPlayer.play();
        }).toThrow();
    });

    // -------- integration

    it("play initiates play on audio tag", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        s.mock(audioNode).expects("play").once();
        AudioPlayer.play(1);
    });

    it("pause initiates pause on audio tag", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        s.mock(audioNode).expects("pause").once();
        AudioPlayer.pause();
    });

    it("resume initiates pause on audio tag", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.pause();
        s.mock(audioNode).expects("play").once();
        AudioPlayer.resume();
    });

    it("stop initiates pause on audio tag", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        s.mock(audioNode).expects("pause").once();
        AudioPlayer.stop();
    });

    it("open triggers state change event", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.onStateChange = s.mock().once().withExactArgs("opened");
        AudioPlayer.open(AUDIO_FILE);
    });

    it("play triggers state change event", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.onStateChange = s.mock().once().withExactArgs("playing");
        AudioPlayer.play(1);
    });

    it("play does not trigger state change event when give 0 number of play times", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.onStateChange = s.mock().never();
        AudioPlayer.play(0);
    });

    it("pause triggers state change event", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.onStateChange = s.mock().once().withExactArgs("paused");
        AudioPlayer.pause();
    });

    it("resume triggers state change event", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.pause();

        AudioPlayer.onStateChange = s.mock().once().withExactArgs("playing");
        AudioPlayer.resume();
    });

    it("stop triggers state change event", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.pause();
        AudioPlayer.resume();

        AudioPlayer.onStateChange = s.mock().once().withExactArgs("stopped");
        AudioPlayer.stop();
    });

    // TODO: mock fire ended event and mock onStateChange
    //"test triggers completed state change event when audio ends": function () {},

    it("object flow executes without any invalid state warnings", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.pause();
        AudioPlayer.resume();
        AudioPlayer.stop();
    });

    it("object flow is reusable", function () {
        s.mock(_console).expects("warn").never();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.pause();
        AudioPlayer.resume();
        AudioPlayer.stop();

        AudioPlayer.open(AUDIO_FILE);
        AudioPlayer.play(1);
        AudioPlayer.pause();
        AudioPlayer.resume();
        AudioPlayer.stop();
    });

    // -------- codec/container handling

    it("open should warn when given unsupported codecs/containers", function () {
        s.mock(_console).expects("warn").atLeast(1);
        audioNode.canPlayType = function () {
            return "";
        };
        AudioPlayer.open("audio.dude");
    });

    // possibly useless since canPlayType is mocked
    it("open should not raise notification when given supported codecs/containers (flv)", function () {
        s.mock(_console).expects("warn").never();
        AudioPlayer.open("audio.mp3");
    });

});
