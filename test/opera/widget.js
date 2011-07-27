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
describe("opera_widget", function () {

    var widget = require('ripple/platform/opera/4.0/widget'),
        platform = require('ripple/platform'),
        _console = require('ripple/console'),
        db = require('ripple/db'),
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        spyOn(platform, "current").andReturn({name: "foo"});
        spyOn(_console, "log");
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    // -------- addEventListener

    it("addEventListener is available and works", function () {
        expect(function () {
            widget.addEventListener("resolution", function _resolutionEventTest() {}, false);
        }).not.toThrow();
    });

    // -------- removeEventListener

    it("removeEventListener is available and works", function () {
        expect(function () {
            widget.removeEventListener("resolution", function _resolutionEventTest() {}, false);
        }).not.toThrow();
    });

    // --------- resolution event

    it("resolution event should fire when screen changes dimension with proper args", function () {
        function myEvent() {}
        s.mock(window).expects("addEventListener").once().withExactArgs("resolution", myEvent, false);
        widget.addEventListener("resolution", myEvent);
    });

    // -------- setPreferenceForKey

    it("setPreferenceForKey returns undefined when key is not found", function () {
        spyOn(platform, "getPersistencePrefix").andReturn("");
        spyOn(db, "retrieve");
        expect(widget.preferenceForKey("nonexistentkey")).toEqual(undefined);
    });

    it("setPreferenceForKey saves a key", function () {
        spyOn(platform, "getPersistencePrefix").andReturn("");
        s.stub(db, "retrieve").returns("p value");
        s.mock(db).expects("save").once().withArgs("pstring", "p value");
        widget.setPreferenceForKey("p value", "pstring");
        expect(widget.preferenceForKey("pstring")).toEqual("p value");
    });

    it("setPreferenceForKey removes a key", function () {
        spyOn(platform, "getPersistencePrefix").andReturn("");
        s.stub(db, "retrieve");
        s.stub(db, "save");
        s.mock(db).expects("remove").once().withArgs("removes_key");
        widget.setPreferenceForKey("test", "removes_key");
        widget.setPreferenceForKey(null, "removes_key");
    });

});
