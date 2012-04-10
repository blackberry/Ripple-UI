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
describe("honeypot", function () {
    var honeypot = require('ripple/honeypot');

    describe("when monitoring", function () {
        describe("with andReturn", function () {
            it("doesn't create the property before accessed", function () {
                var foo = {};
                honeypot.monitor(foo, "bar").andReturn("mine");
                expect(foo.bar).not.toBeDefined();
            });

            it("returns the value rather than what was set", function () {
                var orange = {};
                honeypot.monitor(orange, "lantern").andReturn("mine");
                orange.lantern = "oath";
                expect(orange.lantern).toBe("mine");
            });
        });

        describe("with andRun", function () {
            it("doesn't create the property before accessed", function () {
                var foo = {},
                    get = jasmine.createSpy().andReturn("asdf");
                honeypot.monitor(foo, "bar").andRun(get);

                expect(get).not.toHaveBeenCalled();
                expect(foo.bar).not.toBeDefined();
            });

            it("runs the get function when accessing", function () {
                var eat = {},
                    love = jasmine.createSpy("get func").andReturn("love");

                honeypot.monitor(eat, "pray").andRun(love);
                eat.pray = "and write a book";
                expect(eat.pray).toBe("love");
                expect(love).toHaveBeenCalled();
            });

            it("runs the set function when setting", function () {
                var dude = {},
                    sweet = jasmine.createSpy("set func");

                honeypot.monitor(dude, "sweet").andRun(jasmine.createSpy(), sweet);
                expect(sweet).not.toHaveBeenCalled();
                dude.sweet = "asdf";

                expect(sweet).toHaveBeenCalledWith("asdf");
            });
        });
    });
});
