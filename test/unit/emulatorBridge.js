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
// TODO: make more modular (be able to boot one module at a time)
describeBrowser("emulator_bridge", function () {

    var emulatorBridge = require('ripple/emulatorBridge'),
        sinon = require('sinon'),
        constants = require('ripple/constants'),
        platform = require('ripple/platform'),
        s,
        old_gElById,
        _emulatedBody,
        _emulatedHtml,
        _emulatedDocument,
        _emulatedViewport,
        _emulatedFrame = {
            contentWindow: {
                screen: {}
            }
        };

    beforeEach(function () {
        s = sinon.sandbox.create();

        // TODO: hackish stub for now
        old_gElById = document.getElementById;
        document.getElementById = function (id) {
            if (id === constants.COMMON.VIEWPORT_CONTAINER) {
                return _emulatedViewport;
            }
            else {
                return old_gElById.call(document, id);
            }
        };

        window.tinyHippos = {};

        _emulatedViewport = document.createElement("section");
        _emulatedDocument = document.createElement("section");
        _emulatedHtml = document.createElement("section");
        _emulatedBody = document.createElement("section");

        _emulatedViewport.clientHeight = 480;
        _emulatedViewport.clientWidth = 320;

        _emulatedHtml.appendChild(_emulatedBody);
        _emulatedDocument.appendChild(_emulatedHtml);
        _emulatedViewport.appendChild(_emulatedDocument);

        spyOn(platform, "current").andReturn({objects: {
            foo: {a: 1},
            bar: {b: 1},
            woot: [1, 2, 3, 4, 5]
        }});

        emulatorBridge.link(_emulatedFrame);
    });

    afterEach(function () {
        s.verifyAndRestore();
        delete window.tinyHippos;
        _emulatedViewport = null;
        _emulatedBody = null;
        _emulatedHtml = null;
        _emulatedDocument = null;
        document.getElementById = old_gElById;
    });

    // --------- Tests -------- \\

    it("screen availHeight is overriden properly", function () {
        var viewport = _emulatedViewport;
        expect(viewport.clientHeight).toEqual(screen.availHeight);
    });

    it("screen availWidth is overriden properly", function () {
        var viewport = _emulatedViewport;
        expect(viewport.clientWidth).toEqual(screen.availWidth);
    });

    it("screen height is overriden properly", function () {
        var viewport = _emulatedViewport;
        expect(viewport.clientHeight).toEqual(screen.height);
    });

    it("screen width is overriden properly", function () {
        var viewport = _emulatedViewport;
        expect(viewport.clientWidth).toEqual(screen.availWidth);
    });

    it("window.innerHeight is overriden properly", function () {
        var viewport = _emulatedViewport;
        expect(viewport.clientHeight).toEqual(window.innerHeight);
    });

    it("window.innerWidth is overriden properly", function () {
        var viewport = _emulatedViewport;
        expect(viewport.clientWidth).toEqual(window.innerWidth);
    });

    it("it marshals tinyHippos", function () {
        expect(window.tinyHippos).toBeDefined();
        expect(window.tinyHippos).toBe(_emulatedFrame.contentWindow.tinyHippos);
    });

    it("it marshals XMLHttpRequest", function () {
        expect(window.XMLHttpRequest).toBeDefined();
        expect(window.XMLHttpRequest).toBe(_emulatedFrame.contentWindow.XMLHttpRequest);
    });

    it("it marshals over everything in the sandbox", function () {
        expect(window.foo).toBeDefined();
        expect(window.bar).toBeDefined();
        expect(window.woot).toBeDefined();
        expect(window.foo).toBe(_emulatedFrame.contentWindow.foo);
        expect(window.bar).toBe(_emulatedFrame.contentWindow.bar);
        expect(window.woot).toBe(_emulatedFrame.contentWindow.woot);
    });
});
