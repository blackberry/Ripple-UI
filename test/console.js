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
describe("console", function () {
    var _console = require('ripple/console');

    it("is an object", function () {
        expect(typeof _console).toBe("object");
    });

    it("log is a function", function () {
        expect(typeof _console.log).toBe("function");
    });

    it("warn is a function", function () {
        expect(typeof _console.warn).toBe("function");
    });

    it("error is a function", function () {
        expect(typeof _console.error).toBe("function");
    });

    it("clear is a function", function () {
        expect(typeof _console.clear).toBe("function");
    });
});
