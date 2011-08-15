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
describe("wac_VideoPlayer", function () {

    var video = require('ripple/platform/wac/1.0/VideoPlayer'),
        sinon = require('sinon'),
        platform = require('ripple/platform'),
        fileSystem = require('ripple/fileSystem'),
        _console = require('ripple/console'),
        event = require('ripple/event'),
        videoNode, domNode, s,
        A_VIDEO = "../../short_video.ogv";

    beforeEach(function () {
        s = sinon.sandbox.create();
        domNode = document.createElement("div");
        videoNode = document.createElement("video");
        videoNode.canPlayType = function () {
            return "probably";
        };
        // think jsdom does not have special methods like play on videotag
        videoNode.play = function () {};
        videoNode.pause = function () {};
        videoNode.stop = function () {};

        spyOn(platform, "current").andReturn({name: "generic"});
    });

    afterEach(function () {
        domNode = null;
        videoNode = null;
        s.verifyAndRestore();
        //HACK: this is to clear the state of video player between tests
        video.onStateChange = null;
        event.trigger("MultimediaVideoStateChanged", [null], true);
    });


    // -------- setWindow

    it("setWindow sets a video inside a dom object", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        expect(domNode.childNodes.length).toBe(1);
        expect(videoNode.tagName.toLowerCase()).toBe("video");
    });

    it("setWindow only sets one video in the dom object", function () {
        video.setWindow(domNode);
        video.setWindow(domNode);
        expect(domNode.childNodes.length).toBe(1);
    });

    it("setWindow dissociates video from a set dom object", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.setWindow(null);
        expect(domNode.childNodes.length).toBe(0);
    });

    // -------- open

    it("open throws invalid param when given invalid fileUrl", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        expect(function () {
            video.setWindow(domNode);
            video.open(false);
        }).toThrow();
    });

    it("open throws invalid param when given invalid number of arguments", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        expect(function () {
            video.setWindow(domNode);
            video.open();
        }).toThrow();
    });

    it("open sets video tag src attribute", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open(A_VIDEO);
        expect(videoNode.getAttribute("src")).toBe(A_VIDEO);
    });

    it("open washes file url for virtual direcories", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        s.mock(fileSystem).expects("getURI").once().withExactArgs(A_VIDEO).returns(A_VIDEO);
        video.open(A_VIDEO);
    });

    // ------- invalid state checks
    // TODO: this could be a lot more tight (test every state case)

    it("open warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        s.mock(videoNode).expects("setAttribute").never();
        video.open(A_VIDEO);
    });

    it("play warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        s.mock(videoNode).expects("play").never();
        video.play(1);
    });

    it("pause warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open(A_VIDEO);
        s.mock(videoNode).expects("pause").never();
        video.pause();
    });

    it("resume warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        s.mock(videoNode).expects("play").never();
        video.resume();
    });

    it("stop warns to console when called from invalid state", function () {
        s.mock(_console).expects("warn").once();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open(A_VIDEO);
        s.mock(videoNode).expects("pause").never();
        video.stop();
    });

    // -------- play

    it("play throws invalid param when given invalid number of plays (negative integer)", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        expect(function () {
            video.setWindow(domNode);
            video.open(A_VIDEO);
            video.play(-7);
        }).toThrow();
    });

    it("play throws invalid param when given invalid number of plays (boolean)", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        expect(function () {
            video.setWindow(domNode);
            video.open(A_VIDEO);
            video.play(false);
        }).toThrow();
    });

    it("play throws invalid param when given invalid number of plays (string)", function () {
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);
        expect(function () {
            video.setWindow(domNode);
            video.open(A_VIDEO);
            video.play("what up dawg");
        }).toThrow();
    });

    it("play throws invalid param when given invalid number of arguments", function () {
        s.mock(document).expects("createElement").twice().withExactArgs("video").returns(videoNode);

        expect(function () {
            video.setWindow(domNode);
            video.open(A_VIDEO);
            video.play(1, 2);
        }).toThrow();

        expect(function () {
            video.setWindow(domNode);
            video.open(A_VIDEO);
            video.play();
        }).toThrow();
    });

    // -------- integration

    it("play initiates play on video tag", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        s.mock(videoNode).expects("play").once();
        video.play(1);
    });

    it("pause initiates pause on video tag", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        s.mock(videoNode).expects("pause").once();
        video.pause();
    });

    it("resume initiates pause on video tag", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        video.pause();
        s.mock(videoNode).expects("play").once();
        video.resume();
    });

    it("stop initiates pause on video tag", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        s.mock(videoNode).expects("pause").once();
        video.stop();
    });

    it("stop resets video tag src", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        s.mock(videoNode).expects("setAttribute").once().withExactArgs("src", A_VIDEO);
        video.stop();
    });

    it("open triggers state change event", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.onStateChange = s.mock().once().withExactArgs("opened");
        video.setWindow(domNode);
        video.open(A_VIDEO);
    });

    it("play triggers state change event", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.onStateChange = s.mock().once().withExactArgs("playing");
        video.play(1);
    });

    it("play does not trigger state change event when give 0 number of play times", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.onStateChange = s.mock().never();
        video.play(0);
    });

    it("pause triggers state change event", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        video.onStateChange = s.mock().once().withExactArgs("paused");
        video.pause();
    });

    it("resume triggers state change event", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        video.pause();

        video.onStateChange = s.mock().once().withExactArgs("playing");
        video.resume();
    });

    it("stop triggers state change event", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        video.pause();
        video.resume();

        video.onStateChange = s.mock().once().withExactArgs("stopped");
        video.stop();
    });

    // TODO: mock fire ended event and mock onStateChange
    //it("triggers completed state change event when video ends", function () {},

    it("object flow executes without any invalid state warnings", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        video.pause();
        video.resume();
        video.stop();
    });

    it("object flow is reusable", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").twice().withExactArgs("video").returns(videoNode);

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        video.pause();
        video.resume();
        video.stop();

        video.setWindow(domNode);
        video.open(A_VIDEO);
        video.play(1);
        video.pause();
        video.resume();
        video.stop();
    });

    // -------- codec/container handling

    it("open should raise notification when given unsupported codecs/containers", function () {
        s.mock(_console).expects("warn").atLeast(1);
        videoNode.canPlayType = function () {
            return "";
        };
        s.mock(document).expects("createElement").once().withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open("video.dude");
    });

    it("open should not raise notification when given supported codecs/containers (mp4)", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").once().withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open("video.mp4");
    });

    it("open should not raise notification when given supported codecs/containers (ogg)", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").once().withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open("video.ogg");
    });

    it("open should not raise notification when given supported codecs/containers (ogv)", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").once().withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open("video.ogv");
    });

    it("open should not raise notification when given supported codecs/containers (webm)", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").once().withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open("video.webm");
    });

    it("open should not raise notification when given supported codecs/containers (flv)", function () {
        s.mock(_console).expects("warn").never();
        s.mock(document).expects("createElement").once().withExactArgs("video").returns(videoNode);
        video.setWindow(domNode);
        video.open("video.flv");
    });
});
