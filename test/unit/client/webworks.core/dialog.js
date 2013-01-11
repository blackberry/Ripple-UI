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
describe("webworks dialog", function () {

    var dialog = ripple('platform/webworks.core/2.0.0/server/dialog'),
        dialogClient = ripple('platform/webworks.core/2.0.0/client/dialog'),
        transport = ripple('platform/webworks.core/2.0.0/client/transport'),
        MockBaton = function () {
            this.take = jasmine.createSpy("baton.take");
            this.pass = jasmine.createSpy("baton.pass");
        },
        ui = ripple('ui');

    describe("using server", function () {
        it("exposes the dialog module", function () {
            var webworks = ripple('platform/webworks.tablet/2.0.0/server');
            expect(webworks.blackberry.ui.dialog).toEqual(dialog);
        });
    });

    describe("in spec", function () {
        it("includes ui module according to proper object structure", function () {
            var spec = ripple('platform/webworks.tablet/2.0.0/spec');
            expect(spec.objects.blackberry.children.ui.children.dialog.path)
                .toEqual("webworks.core/2.0.0/client/dialog");
        });
    });

    describe("client", function () {
        describe("customAskAsync", function () {
            it("calls the transport appropriately", function () {
                spyOn(transport, "call").andReturn("data");

                expect(dialogClient.customAskAsync("msg", "choices")).toEqual("data");
                expect(transport.call.argsForCall[0][0]).toEqual("blackberry/ui/dialog/ask");
                expect(transport.call.argsForCall[0][1]).toEqual({
                    async: true,
                    get: {
                        message: "msg",
                        buttons: "choices"
                    }
                });
            });

            it("passes response data to callback when complete", function () {
                var callback = jasmine.createSpy();

                spyOn(transport, "call").andCallFake(function (a, b, callback) {
                    var response = "data";
                    if (callback) {
                        callback(response);
                    }
                    return response;
                });

                dialogClient.customAskAsync("msg", "choices", callback);
                expect(callback).toHaveBeenCalledWith("data");
            });
        });

        describe("customAskAsync", function () {
            it("calls the transport appropriately", function () {
                spyOn(transport, "call").andReturn("data");

                expect(dialogClient.standardAskAsync("msg", dialogClient.D_YES_NO)).toEqual("data");
                expect(transport.call.argsForCall[0][0]).toEqual("blackberry/ui/dialog/ask");
                expect(transport.call.argsForCall[0][1]).toEqual({
                    async: true,
                    get: {
                        message: "msg",
                        buttons: ["Yes", "No"]
                    }
                });
            });

            it("passes response data to callback when complete", function () {
                var callback = jasmine.createSpy();

                spyOn(transport, "call").andCallFake(function (a, b, callback) {
                    var response = "data";
                    if (callback) {
                        callback(response);
                    }
                    return response;
                });

                dialogClient.standardAskAsync("msg", dialogClient.D_YES_NO, callback);
                expect(callback).toHaveBeenCalledWith("data");
            });
        });
    });

    describe("dialog", function () {
        it("Ask can be called", function () {
            dialog.ask({
                buttons: ["Button1", "Button2"],
                message: "Test Dialog"
            }, null, new MockBaton());
        });

        it("throws error when called without arguments", function () {
            expect(function () {
                dialog.ask();
            }).toThrow();
        });

        it("throws error when called without buttons", function () {
            expect(function () {
                dialog.ask({
                    message: "Test Dialog"
                }, null, new MockBaton());
            }).toThrow();
        });

        it("throws error when called without message", function () {
            expect(function () {
                dialog.ask({
                    buttons: ["Button1", "Button2"]
                }, null, new MockBaton());
            }).toThrow();
        });
    });

    describe("dialog events", function () {
        it("ask request shows the dialog overlay", function () {
            spyOn(ui, "showOverlay");
            dialog.ask({
                buttons: ["Button1", "Button2"],
                message: "Test Dialog"
            }, null, new MockBaton());
            expect(ui.showOverlay.mostRecentCall.args[0]).toBe("dialog-window");
            expect(ui.showOverlay.callCount).toBe(1);
        });

        it("takes the baton", function () {
            var baton = {
                take: jasmine.createSpy("baton.take")
            };

            dialog.ask({
                buttons: ["b1", "b2"],
                message: "your momma wears army boots"
            }, null, baton);

            expect(baton.take).toHaveBeenCalled();
        });
    });
});
