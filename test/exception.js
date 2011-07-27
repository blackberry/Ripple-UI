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
describe("exception", function () {

    var exception = require('ripple/exception'),
        _console = require('ripple/console'),
        s, sinon = require('sinon');

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("handle throws exception if wrong number of arguments", function () {
        spyOn(_console, "error");
        expect(function () {
            exception.handle("1", "2", "3");
        }).toThrow();
        expect(_console.error).toHaveBeenCalled();
    });

    it("handle logs to console", function () {
        s.mock(_console).expects("error").once();
        try {
            throw {name: "TestExceptionType"};
        } catch (e) {
            exception.handle(e);
        }
    });

    it("handle logs to console and rethrows exception", function () {
        s.mock(_console).expects("error").once();
        try {
            throw {name: "TestExceptionType"};
        } catch (e) {
            try {
                exception.handle(e, true);
            }
            catch (other_e) {
                return;
            }
            throw "Exception was expected, none was thrown";
        }
    });

    it("throwException throws existing object exception", function () {
        var obj = {
            "test": "test property"
        };

        try {
            exception.raise("TestException", "test message", obj);
        } catch (e) {
            expect(e.test).toEqual(obj.test);
            expect(e.name).toEqual("TestException");
            expect(e.message).toEqual("test message");
            return;
        }

        throw "Exception was expected, none was thrown";
    });

    it("throwException throws exception with both name and type properties the same", function () {
        try {
            exception.raise("TestException", "test message");
        } catch (e) {
            expect(e.name).toEqual("TestException", e.name);
            expect(e.type, "TestException");
            expect(e.message).toEqual("test message");
            return;
        }

        throw "Exception was expected, none was thrown";
    });

    it("throwException throws exception if invalid arguments", function () {
        try {
            exception.raise(1, {});
        } catch (e) {
            return;
        }
        throw "Exception was expected, none was thrown";
    });

    it("throwException throws exception if invalid argument", function () {
        try {
            exception.raise(1);
        } catch (e) {
            return;
        }

        throw "Exception was expected, none was thrown";
    });

    it("throwException throws correct exception type with no message", function () {
        try {
            exception.raise("TestExceptionType");
        } catch (e) {
            expect(e.name).toEqual("TestExceptionType");
            return;
        }
        throw "Exception was expected, none was thrown";
    });

    it("throwException throws correct exception type with message", function () {
        try {
            exception.raise("TestExceptionType", "test exception was thrown");
        } catch (e) {
            expect(e.message).toEqual("test exception was thrown");
            return;
        }

        throw "Exception was expected, none was thrown";
    });

    it("throwMaskedException throws custom exception", function () {
        s.mock(_console).expects("error").once();

        try {
            exception.throwMaskedException("TestExceptionType", "test message");
        } catch (e) {
            expect(e.name).toEqual(exception.types.tinyHipposMaskedException);
            expect(e.message).toEqual("tinyhippos terminated your script due to exception");
            return;
        }

        throw "Exception was expected, none was thrown";
    });

    it("throwMaskedException throws custom exception with custom message", function () {
        s.mock(_console).expects("error").once();

        try {
            exception.throwMaskedException("TestExceptionType");
        } catch (e) {
            expect(e.name).toEqual(exception.types.tinyHipposMaskedException);
            expect(typeof e.message).toEqual("string");
            return;
        }

        throw "Exception was expected, none was thrown";
    });
});
