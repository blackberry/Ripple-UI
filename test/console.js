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

    describe("when logging", function () {
        it("calls the log method", function () {
            spyOn(console, "log");
            _console.log("beavers!!!");
            expect(console.log).toHaveBeenCalledWith("beavers!!!");
        });
    });

    describe("when erroring", function () {
        it("calls the error method", function () {
            spyOn(console, "error");
            _console.error("this is teh broken");
            expect(console.error).toHaveBeenCalledWith("this is teh broken");
        });
    });

    describe("when warning", function () {
        it("calls the warn method", function () {
            spyOn(console, "warn");
            _console.warn("Thundercats Hoooo");
            expect(console.warn).toHaveBeenCalledWith("Thundercats Hoooo");
        });
    });

    describe("when setting the prefix", function () {
        beforeEach(function () {
            _console.prefix = "PLATFORM";
        });

        afterEach(function () {
            _console.prefix = null;
        });

        it("uses the prefix when logging", function () {
            spyOn(console, "log");
            _console.log("Thundercats Hoooo");
            expect(console.log).toHaveBeenCalledWith("PLATFORM :: Thundercats Hoooo");
        });
        
        it("uses the prefix when erroring", function () {
            spyOn(console, "error");
            _console.error("Carebears Stare");
            expect(console.error).toHaveBeenCalledWith("PLATFORM :: Carebears Stare");
        });

        it("uses the prefix when warning", function () {
            spyOn(console, "warn");
            _console.warn("Danger Will Robinson");
            expect(console.warn).toHaveBeenCalledWith("PLATFORM :: Danger Will Robinson");
        });

        it("will not use a falsy prefix", function () {
            _console.prefix = false;
            spyOn(console, "log");
            _console.log("EX-TERM-IN-ATE");
            expect(console.log).toHaveBeenCalledWith("EX-TERM-IN-ATE");
        });
    });

});
