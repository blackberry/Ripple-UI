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
describe("blackberry.invoke.card", function () {
    var card, camera,
        event = require('ripple/event');

    describe("when invoking the camera", function () {
        var save,
            cancel,
            invoke;

        beforeEach(function () {
            save = jasmine.createSpy("onSave callback");
            cancel = jasmine.createSpy("onCancel callback");
            invoke = jasmine.createSpy("onInvoke callback");

            spyOn(document, "getElementById").andReturn({
                addEventListener: jasmine.createSpy("addEventListener")
            });

            camera = require('ripple/ui/plugins/camera');
            spyOn(camera, "show");
            spyOn(event, "once");

            card = require('ripple/platform/webworks.bb10/1.0.0/card');
        });

        describe("when looking at constents", function () {
            it("has a constant for photo", function () {
                expect(card.CAMERA_MODE_PHOTO).toBe("photo");
            });

            it("has a constant for video", function () {
                expect(card.CAMERA_MODE_VIDEO).toBe("video");
            });

            it("has a constant for full", function () {
                expect(card.CAMERA_MODE_FULL).toBe("full");
            });
        });

        it("calls the invoked callback", function () {
            card.invokeCamera("photo", save, cancel, invoke);

            expect(invoke).toHaveBeenCalledWith("");
            expect(save).not.toHaveBeenCalled();
            expect(cancel).not.toHaveBeenCalled();
        });

        describe("when calling", function () {
            it("can be called with no callbacks", function () {
                expect(card.invokeCamera).not.toThrow();
            });

            it("can be called with just a mode", function () {
                expect(function () {
                    card.invokeCamera("wat");
                }).not.toThrow();
            });

            it("can be called with just success callback", function () {
                expect(function () {
                    card.invokeCamera("wat", save);
                }).not.toThrow();
            });
        });

        describe("when showing the camera", function () {
            it("shows the camera with type image when mode is photo", function () {
                card.invokeCamera("photo", save, cancel, invoke);
                expect(camera.show).toHaveBeenCalledWith('image');
            });

            it("shows the camera with type image mode is full", function () {
                card.invokeCamera("full", save, cancel, invoke);
                expect(camera.show).toHaveBeenCalledWith('image');
            });

            it("shows the camera with type image mode is something else", function () {
                card.invokeCamera("ponies", save, cancel, invoke);
                expect(camera.show).toHaveBeenCalledWith('image');
            });

            it("shows the camera with type video when mode is video", function () {
                card.invokeCamera("video", save, cancel, invoke);
                expect(camera.show).toHaveBeenCalledWith('video');
            });
        });

        describe("when cancelling", function () {
            it("calls the cancel callback with 'done'", function () {
                //TODO: add this in when cancel is added to the UI
            });
        });

        describe("when subscribing to the captured event", function () {
            it("subscribes to captured-image when mode is photo", function () {
                card.invokeCamera("photo", save, cancel, invoke);
                expect(event.once).toHaveBeenCalledWith("captured-image", jasmine.any(Function));
            });

            it("subscribes to captured-video when mode is video", function () {
                card.invokeCamera("video", save, cancel, invoke);
                expect(event.once).toHaveBeenCalledWith("captured-video", jasmine.any(Function));
            });
        });

        it("calls the save callback with the path from the captured event", function () {
            card.invokeCamera("full", save, cancel, invoke);
            event.once.mostRecentCall.args[1]("/foo/bar/duckface.jpg");
            expect(save).toHaveBeenCalledWith("/foo/bar/duckface.jpg");
        });
    });
});
