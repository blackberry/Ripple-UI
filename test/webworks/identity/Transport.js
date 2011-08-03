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
describe("webworks identity.Transport", function () {

    var Transport = require('ripple/platform/webworks.core/2.0.0/client/identity/Transport'),
        spec = require('ripple/platform/webworks/2.0.0/spec');

    describe("in spec", function () {
        it("includes Transport module according to proper object structure", function () {
            expect(spec.objects.blackberry.children.identity.children.Transport.path)
                .toEqual("webworks.core/2.0.0/client/identity/Transport");
        });
    });

    describe("using identity/Transport", function () {
        it("accepts name and type in the constructor", function () {
            var transport = new Transport("a", "b");
            expect(transport.name).toEqual("a");
            expect(transport.type).toEqual("b");
        });

        describe("name", function () {
            it("is readonly", function () {
                expect(new Transport().__lookupGetter__("name")).toBeDefined();
                expect(new Transport().__lookupSetter__("name")).not.toBeDefined();
            });
        });

        describe("type", function () {
            it("is readonly", function () {
                expect(new Transport().__lookupGetter__("type")).toBeDefined();
                expect(new Transport().__lookupSetter__("type")).not.toBeDefined();
            });
        });
    });

});
