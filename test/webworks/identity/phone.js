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
describe("webworks identity.phone", function () {

    var phoneClient = require('ripple/platform/webworks.handset/2.0.0/client/identity/phone'),
        phone = require('ripple/platform/webworks.handset/2.0.0/server/identity/phone'),
        spec = require('ripple/platform/webworks.handset/2.0.0/spec'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        webworks = require('ripple/platform/webworks.handset/2.0.0/server');

    describe("using server", function () {
        it("exposes the phone module", function () {
            expect(webworks.blackberry.identity.phone).toEqual(phone);
        });
    });

    describe("in spec", function () {
        it("includes phone module according to proper object structure", function () {
            expect(spec.objects.blackberry.children.identity.children.phone.path)
                .toEqual("webworks.handset/2.0.0/client/identity/phone");
        });
    });

    describe("in client/phone", function () {
        describe("getLineIds", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn("need more coffee");
                expect(phoneClient.getLineIds()).toEqual("need more coffee");
                expect(transport.call).toHaveBeenCalledWith("blackberry/identity/phone/getLineIds");
            });
        });

        describe("getLineLabel", function () {
            it("calls the transport with proper args", function () {
                spyOn(transport, "call").andReturn("your face");
                expect(phoneClient.getLineLabel(1)).toEqual("your face");
                expect(transport.call).toHaveBeenCalledWith("blackberry/identity/phone/getLineLabel", {get: {id: 1}});
            });
        });

        describe("getLineNumber", function () {
            it("calls the transport with proper args", function () {
                spyOn(transport, "call").andReturn("where in the world");
                expect(phoneClient.getLineNumber(3)).toEqual("where in the world");
                expect(transport.call).toHaveBeenCalledWith("blackberry/identity/phone/getLineNumber", {get: {id: 3}});
            });
        });

        describe("getLineType", function () {
            it("calls the transport with proper args", function () {
                spyOn(transport, "call").andReturn("is carmen sandiego");
                expect(phoneClient.getLineType(2)).toEqual("is carmen sandiego");
                expect(transport.call).toHaveBeenCalledWith("blackberry/identity/phone/getLineType", {get: {id: 2}});
            });
        });
    });

    // TODO: what is behaviour when an invalid id is given
    describe("in server/phone", function () {
        describe("getLineIds", function () {
            it("returns a list of ids", function () {
                var ids = phone.getLineIds().data;
                expect(ids.length > 0).toEqual(true);
                ids.forEach(function (id) {
                    expect(typeof id === "number" && id > 0).toEqual(true);
                });
            });
        });

        describe("getLineLabel", function () {
            it("returns a default label", function () {
                expect(phone.getLineLabel().data).toEqual("rogers");
            });

            it("returns a specific label", function () {
                expect(phone.getLineLabel({id: 2}).data).toEqual("mystery");
            });

            it("throws an exception with an invalid line id", function () {
                expect(function () {
                    phone.getLineLabel({id: 10000000000000});
                }).toThrow();
            });
        });

        describe("getLineNumber", function () {
            it("returns a default number", function () {
                expect(phone.getLineNumber().data).toEqual(12345678910);
            });

            it("returns a specific number", function () {
                expect(phone.getLineNumber({id: 2}).data).toEqual(10987654321);
            });

            it("throws an exception with an invalid line id", function () {
                expect(function () {
                    phone.getLineNumber({id: 10000000000000});
                }).toThrow();
            });
        });

        describe("getLineType", function () {
            it("returns a default type", function () {
                expect(phone.getLineType().data).toEqual(1);
            });

            it("returns a specific type", function () {
                expect(phone.getLineType({id: 2}).data).toEqual(0);
            });

            it("throws an exception with an invalid line id", function () {
                expect(function () {
                    phone.getLineType({id: 10000000000000});
                }).toThrow();
            });
        });
    });
});
