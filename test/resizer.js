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

    var sinon = require('sinon'),
        s, _old_gElById,
        _uiDomNode,
        _old_document_querySelector,
        _emulatedBody,
        _emulatedHtml,
        _emulatedViewport,
        _emulatedDevice,
        iPhone3 = require('ripple/devices/iPhone3'),
        devices = require('ripple/devices'),
        event = require('ripple/event'),
        db = require('ripple/db'),
        constants = require('ripple/constants'),
        platform = require('ripple/platform'),
        _console = require('ripple/console'),
        resizer = require('ripple/resizer');

    beforeEach(function () {
        spyOn(devices, "getCurrentDevice").andReturn(iPhone3);
        spyOn(platform, "current").andReturn({name: "default"});
        spyOn(_console, "log");
        // TODO: hackish stub for now
        _old_gElById = document.getElementById;
        document.getElementById = function (id) {
            if (id === constants.COMMON.VIEWPORT_CONTAINER) {
                return _emulatedViewport;
            }
            else if (id === constants.COMMON.DEVICE_CONTAINER) {
                return _emulatedDevice;
            }
            else {
                return _old_gElById.call(document, id);
            }
        };

        s = sinon.sandbox.create();

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
        s.verifyAndRestore();
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
        s.mock(db).expects("retrieve").once().returns(null);

        var w, h;

        resizer.resize(iPhone3);

        w = _emulatedViewport.style.width;
        h = _emulatedViewport.style.height;

        expect(iPhone3.viewPort.portrait.width).toBe(parseInt(w, 10));
        expect(iPhone3.viewPort.portrait.height).toBe(parseInt(h, 10));
    });

    it("resize should NOT invoke window.onresized", function () {
        s.mock(db).expects("retrieve").once().returns(null);

        window.onresize = s.mock().never();

        resizer.resize(iPhone3);

        delete window.onresize;
    });

    it("resize should trigger ScreenChangeDimensions", function () {
        s.mock(db).expects("retrieve").once().returns(null);
        s.mock(event).expects("trigger").once().withExactArgs("ScreenChangeDimensions", [320, 480]);

        resizer.resize(iPhone3);
        waits(1);
    });

    it("changeLayoutType throws exception if no arguments", function () {
        expect(resizer.changeLayoutType).toThrow();
    });

    it("changeLayoutType throws exception if too many arguments", function () {
        expect(function () {
            resizer.changeLayoutType("1", "2", "3", 3, true);
        }).toThrow();
    });

    it("changeLayoutType throws exception if invalid arguments", function () {
        expect(function () {
            resizer.changeLayoutType(true);
        }).toThrow();
    });

    it("changeLayoutType throws LayoutTypeException if invalid layoutType", function () {
        expect(function () {
            resizer.changeLayoutType("blargggg");
        }).toThrow();
    });
});
