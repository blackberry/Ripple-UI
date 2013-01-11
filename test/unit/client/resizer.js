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
describe("resizer", function () {
    var  _old_gElById,
        _uiDomNode,
        _old_document_querySelector,
        _emulatedBody,
        _emulatedHtml,
        _emulatedViewport,
        _emulatedDevice,
        iPhone3 = ripple('devices/iPhone3'),
        devices = ripple('devices'),
        event = ripple('event'),
        db = ripple('db'),
        platform = ripple('platform'),
        _console = ripple('console'),
        resizer = ripple('resizer');

    beforeEach(function () {
        spyOn(devices, "getCurrentDevice").andReturn(iPhone3);
        spyOn(platform, "current").andReturn({name: "default"});
        spyOn(_console, "log");
        spyOn(db, "save");
        // TODO: hackish stub for now
        _old_gElById = document.getElementById;
        document.getElementById = function (id) {
            if (id === "viewport-container") {
                return _emulatedViewport;
            }
            else if (id === "device-container") {
                return _emulatedDevice;
            }
            else {
                return _old_gElById.call(document, id);
            }
        };

        _uiDomNode = document.createElement("section");

        _old_document_querySelector = document.querySelector;
        document.querySelector = function (selector) {
            if (selector === "#ui") {
                return _uiDomNode;
            }
        };

        _emulatedDevice = document.createElement("section");
        _emulatedViewport = document.createElement("section");
        _emulatedHtml = document.createElement("section");
        _emulatedBody = document.createElement("div");

        _emulatedHtml.appendChild(_emulatedBody);
        _emulatedViewport.appendChild(_emulatedHtml);
        _emulatedDevice.appendChild(_emulatedViewport);
    });

    afterEach(function () {
        document.querySelector = _old_document_querySelector;
        _uiDomNode = null;
        _emulatedDevice = null;
        _emulatedViewport = null;
        _emulatedBody = null;
        _emulatedHtml = null;
        document.getElementById = _old_gElById;
    });

    it("resize throws exception if no arguments", function () {
        expect(resizer.resize).toThrow();
    });

    it("resize throws exception if too many arguments", function () {
        expect(function () {
            resizer.resize("1", "2", "3", 3, true);
        }).toThrow();
    });

    it("resize throws error if dom object not found", function () {
        expect(function () {
            resizer.resize("ADSF");
        }).toThrow();
    });

    it("resize resizes device properly", function () {
        spyOn(db, "retrieve").andReturn(null);

        var w, h;

        resizer.resize(iPhone3);

        w = _emulatedViewport.style.width;
        h = _emulatedViewport.style.height;

        expect(db.retrieve.callCount).toBe(1);
        expect(iPhone3.viewPort.portrait.width).toBe(parseInt(w, 10));
        expect(iPhone3.viewPort.portrait.height).toBe(parseInt(h, 10));
    });

    it("resize should trigger ScreenChangeDimensions", function () {
        spyOn(db, "retrieve").andReturn(null);
        spyOn(event, "trigger").andReturn(null);

        resizer.resize(iPhone3);

        expect(db.retrieve.callCount).toBe(1);
        expect(event.trigger.callCount).toBe(1);
        expect(event.trigger).toHaveBeenCalledWith("ScreenChangeDimensions", [320, 480]);
        waits(1);
    });

    describe("when changing the layout type", function () {
        it("throws exception if no arguments", function () {
            expect(resizer.changeLayoutType).toThrow();
        });

        it("throws exception if too many arguments", function () {
            expect(function () {
                resizer.changeLayoutType("1", "2", "3", 3, true);
            }).toThrow();
        });

        it("throws exception if invalid arguments", function () {
            expect(function () {
                resizer.changeLayoutType(true);
            }).toThrow();
        });

        it("throws LayoutTypeException if invalid layoutType", function () {
            expect(function () {
                resizer.changeLayoutType("blargggg");
            }).toThrow();
        });

        it("init sets sets the stage for orientation data", function () {

            var win = {},
                doc = {};

            spyOn(db, "retrieve").andReturn("portrait");

            resizer.init(win, doc);

            expect(win.hasOwnProperty("orientation")).toBe(true);
            expect(win.hasOwnProperty("onorientationchange")).toBe(true);
        });

        describe("it updates window.orientation", function () {
            var win = {
                    dispatchEvent: jasmine.createSpy("win.dispatchEvent")
                },
                evt = {
                    initEvent: function () {}
                },
                doc = {
                    createEvent: function () {
                        return evt;
                    }
                };

            beforeEach(function () {
                resizer.init(win, doc);
                spyOn(resizer, "resize");
                evt.initEvent = jasmine.createSpy("evt.initEvent");
            });

            afterEach(function () {
                delete win.orientation;
                delete window.orientation;
            });
            
            it("sets window.orientation to 0 when portrait", function () {
                resizer.changeLayoutType("portrait");
                expect(window.orientation).toBe(0);
                expect(win.orientation).toBe(0);
            });

            it("sets window.orientation to 90 when landscape", function () {
                resizer.changeLayoutType("landscape");
                expect(window.orientation).toBe(90);
                expect(win.orientation).toBe(90);
            });

            it("triggers the window.onorientationchange function when changed", function () {
                win.onorientationchange = jasmine.createSpy("onorientationchange");
                resizer.changeLayoutType("portrait");
                expect(win.onorientationchange).toHaveBeenCalled();
            });

            it("triggers the orientationchange event off of window", function () {
                resizer.changeLayoutType("landscape");

                expect(evt.initEvent).toHaveBeenCalledWith("orientationchange", true, true);
                expect(win.dispatchEvent).toHaveBeenCalledWith(evt);
            });
        });
    });
});
