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
describe("wac_Camera", function () {

    var camera = require('ripple/platform/wac/1.0/Camera'),
        platform = require('ripple/platform'),
        notifications = require('ripple/notifications'),
        utils = require('ripple/utils'),
        fileSystem = require('ripple/fileSystem'),
        _console = require('ripple/console'),
        domNode,
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        spyOn(_console, "log");
        s = sinon.sandbox.create();
        domNode = document.createElement("div");
        domNode.innerHTML = "";
        spyOn(platform, "current").andReturn({name: "default"});

        document.querySelector = function (sel) {
            return document.createElement("div");
        };
        camera.setWindow(domNode);
    });

    afterEach(function () {
        s.verifyAndRestore();
        camera.onCameraCaptured = null;
    });

    it("setWindow does not throw invalid param exception when given null",  function () {
        expect(function () {
            camera.setWindow(null);
        }).not.toThrow();
    });

    it("setWindow sets a img and a button div inside a dom object", function () {
        expect(domNode.childNodes.length).toEqual(2);
        var imageNode = domNode.childNodes[0],
            buttonNode = domNode.childNodes[1];
        expect("img").toEqual(imageNode.tagName.toLowerCase(), "expected img tag name");
        expect("div").toEqual(buttonNode.tagName.toLowerCase(), "expected div tag name");
    });

    it("setWindow only sets one img in the dom object", function () {
        camera.setWindow(domNode);
        expect(domNode.childNodes.length).toEqual(2);
    });

    it("setWindow dissociates canvas from a set dom object", function () {
        camera.setWindow(null);
        expect(domNode.childNodes.length).toEqual(0);
    });

    it("it throws an exception when no file name provided", function () {
        expect(camera.captureImage).toThrow();
    });

    it("when capturing an image it shows a notification", function () {
        s.mock(fileSystem).expects("override").never();
        s.mock(notifications).expects("openNotification").once();
        camera.captureImage("foo.png", false);
    });

    it("when capturing an image it raises the onCameraCaptured event", function () {
        s.stub(notifications, "openNotification");
        camera.onCameraCaptured = s.mock().withExactArgs("foo.png").once();
        camera.captureImage("foo.png", false);
    });

    it("it returns the path of the saved image", function () {
        s.stub(notifications, "openNotification");
        camera.onCameraCaptured = s.mock().withExactArgs("foo.png").once();
        var path = camera.captureImage("foo.png", false);

        expect("foo.png").toEqual(path);
    });

    it("we can call start video capture and it fires the onCameraCaptured event after the max duration seconds", function () {
        //make test teh faster
        spyOn(utils, "validateMultipleArgumentTypes");

        s.stub(notifications, "openNotification");

        var start = new Date(),
            end;

        camera.onCameraCaptured = function (file) {
            end = new Date();
            expect(file).toEqual("foo.avi");
        };

        runs(function () {
            camera.startVideoCapture("foo.avi", false, 0.01, false);
        });
        waits(11);
        runs(function () {
            expect(end - start).toBeGreaterThan(9);
        });
    });

    it("it returns the path when calling startVideoCapture", function () {
        var path = camera.startVideoCapture("videos/hot_date.avi", false, 1, false);
        camera.stopVideoCapture();
        expect("videos/hot_date.avi").toEqual(path);
    });

    it("when capturing a video it overrides the file", function () {
        //make test teh faster
        spyOn(utils, "validateMultipleArgumentTypes");

        s.mock(fileSystem).expects("override").never();
        s.mock(notifications).expects("openNotification").once();

        camera.startVideoCapture("foo.avi", false, 0.01, false);

        waits(11);
    });

    it("we can end capturing a video early and we only get one callback invoked", function () {

        //make test teh faster
        spyOn(utils, "validateMultipleArgumentTypes");
        s.stub(notifications, "openNotification");

        camera.onCameraCaptured = s.mock().once();
        camera.startVideoCapture("foo.avi", false, 0.01, false);
        camera.stopVideoCapture();

        waits(11);

    });

    it("we can call stop video capture without starting", function () {
        camera.onCameraCaptured = s.mock().never();
        camera.stopVideoCapture();
    });

    it("we can call stop video capture twice and it doesn't call the callback twice", function () {
        s.stub(notifications, "openNotification");
        camera.startVideoCapture("foo.avi", false, 10, false);
        camera.stopVideoCapture();
        camera.onCameraCaptured = s.mock().never();
        camera.stopVideoCapture();
    });

    it("it should not show the buttons if we pass in false for showDefaultControls", function () {
        camera.startVideoCapture("foo.avi", false, 10, false);
        expect(domNode.childNodes[1].getAttribute("style")).toBeTruthy();
        camera.stopVideoCapture();
    });

    it("it should show the buttons if we pass in true for showDefaultControls", function () {
        camera.startVideoCapture("foo.avi", false, 10, true);
        expect(domNode.childNodes[1].getAttribute("style")).toBeFalsy();
        camera.stopVideoCapture();
    });

    it("it should hide the buttons when we call stop video capture", function () {
        camera.startVideoCapture("foo.avi", false, 10, true);
        camera.stopVideoCapture();
        expect(domNode.childNodes[1].getAttribute("style")).toBeTruthy();
    });

    it("we can remove the window while recording a video and calling stop doesn't throw an error", function () {
        camera.startVideoCapture("foo.avi", false, 10, true);
        camera.setWindow(null);
        camera.stopVideoCapture();
    });

});
