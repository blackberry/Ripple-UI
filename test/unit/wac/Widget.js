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
describe("wac_Widget", function () {
    var Widget = require('ripple/platform/wac/1.0/Widget'),
        Exception = require('ripple/platform/wac/1.0/Exception'),
        event = require('ripple/event'),
        platform = require('ripple/platform'),
        db = require('ripple/db'),
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
        spyOn(platform, "current").andReturn({name: "generic"});
        s.stub(platform, "getPersistencePrefix").returns("default");
        spyOn(console, "log");
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("Exception_can_be_thrown_properly", function () {
        // TODO: look into more, so does this mean you can have race conditions where this Static Exception object is used around the same time?
        var exception = Exception;
        exception.message = "message";
        exception.type = "testype";

        try {
            throw exception;
        }
        catch (e) {
            expect(e.message).toBe("message");
            expect(e.type).toBe("testype");
        }
    });

    it("setPreferenceForKey_throws_INVALID_PARAMETER_exception_when_invalid_argument_types", function () {
        expect(function () {
            Widget.setPreferenceForKey(new Date(), 5);

        }).toThrow();
    });

    it("setPreferenceForKey_throws_INVALID_PARAMETER_exception_when_invalid_argument_lengths", function () {
        expect(function () {
            Widget.setPreferenceForKey({}, false, "");
        }).toThrow();

        expect(function () {
            Widget.setPreferenceForKey();
        }).toThrow();
    });

    it("setPreferenceForKey calls into the db to save", function () {
        s.mock(db).expects("save").once();
        Widget.setPreferenceForKey("p value", "pstring");
    });

    it("setPreferenceForKey raises the StorageUpdatedEvent", function () {
        s.stub(db, "save");
        s.mock(event).expects("trigger").withExactArgs("StorageUpdatedEvent").once();
        Widget.setPreferenceForKey("a", "b");
    });

    it("setPreferenceForKey_adds_and_removes_key_properly", function () {
        s.mock(db).expects("remove").once();
        Widget.setPreferenceForKey(null, "removes_key");
    });

    it("setPreferenceForKey_returns_undefined_with_nonexistent_key", function () {
        expect(Widget.preferenceForKey("nonexistentkey")).not.toBeDefined();
    });

    it("preferenceForKey_throws_INVALID_PARAMETER_exception_when_invalid_argument_types", function () {
        expect(function () {
            Widget.preferenceForKey(5);
        }).toThrow();
    });

    it("preferenceForKey_throws_INVALID_PARAMETER_exception_when_invalid_argument_lengths", function () {
        expect(function () {
            Widget.preferenceForKey(false, new Date());
        }).toThrow();

        expect(function () {
            Widget.preferenceForKey();
        }).toThrow();
    });
});
