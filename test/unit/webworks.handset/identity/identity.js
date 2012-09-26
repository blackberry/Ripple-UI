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
describe("webworks identity", function () {
    var identity = require('ripple/platform/webworks.handset/2.0.0/server/identity'),
        deviceSpec = require('ripple/platform/webworks.handset/2.0.0/spec/device'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        identityClient = require('ripple/platform/webworks.handset/2.0.0/client/identity'),
        platform = require('ripple/platform'),
        utils = require('ripple/utils'),
        deviceSettings = require('ripple/deviceSettings'),
        spec = require('ripple/platform/webworks.handset/2.0.0/spec'),
        webworks = require('ripple/platform/webworks.handset/2.0.0/server');

    describe("using server", function () {
        it("exposes the identity module", function () {
            expect(webworks.blackberry.identity).toEqual(identity);
        });
    });

    describe("in spec", function () {
        it("includes identity module according to proper object structure", function () {
            expect(spec.objects.blackberry.children.identity.path)
                .toEqual("webworks.handset/2.0.0/client/identity");
        });
    });

    describe("using client/identity", function () {
        describe("IMEI", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn("into eternity");
                expect(identityClient.IMEI).toEqual("into eternity");
                expect(transport.call).toHaveBeenCalledWith("blackberry/identity/IMEI");
            });
        });

        describe("IMSI", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn("the oblivion");
                expect(identityClient.IMSI).toEqual("the oblivion");
                expect(transport.call).toHaveBeenCalledWith("blackberry/identity/IMSI");
            });
        });

        describe("PIN", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn("takes all");
                expect(identityClient.PIN).toEqual("takes all");
                expect(transport.call).toHaveBeenCalledWith("blackberry/identity/PIN");
            });
        });

        describe("getServiceList", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn("the conqueror worm");
                expect(identityClient.getServiceList()).toEqual("the conqueror worm");
                expect(transport.call)
                    .toHaveBeenCalledWith("blackberry/identity/getServiceList");
            });
        });

        describe("getDefaultService", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn("the tragedy");
                expect(identityClient.getDefaultService()).toEqual("the tragedy");
                expect(transport.call)
                    .toHaveBeenCalledWith("blackberry/identity/getDefaultService");
            });
        });

        describe("getTransportList", function () {
            it("calls the transport", function () {
                spyOn(transport, "call").andReturn("is man");
                expect(identityClient.getTransportList()).toEqual("is man");
                expect(transport.call)
                    .toHaveBeenCalledWith("blackberry/identity/getTransportList");
            });
        });
    });

    describe("using server/identity", function () {
        describe("IMEI", function () {
            beforeEach(function () {
                spyOn(platform, "current").andReturn({
                    device: {
                        "identity": {
                            "IMEI": {control: {value: "1234"}}
                        }
                    }
                });
            });

            it("has a correlative device setting", function () {
                expect(typeof deviceSpec.identity.IMEI).toEqual("object");
                expect(typeof deviceSpec.identity.IMEI.name).toEqual("string");
                expect(deviceSpec.identity.IMEI.control.type).toEqual("text");
                expect(typeof deviceSpec.identity.IMEI.control.value).toEqual("string");
            });

            it("returns the default control value when their is no persisted device setting", function () {
                expect(identity.IMEI().data).toEqual("1234");
            });

            it("returns a persisted device setting", function () {
                deviceSettings.register("identity.IMEI", "cheese");
                expect(identity.IMEI().data).toEqual("cheese");
            });
        });

        describe("IMSI", function () {
            beforeEach(function () {
                spyOn(platform, "current").andReturn({
                    device: {
                        "identity": {
                            "IMSI": {control: {value: "4321"}}
                        }
                    }
                });
            });

            it("has a correlative device setting", function () {
                expect(typeof deviceSpec.identity.IMSI).toEqual("object");
                expect(typeof deviceSpec.identity.IMSI.name).toEqual("string");
                expect(deviceSpec.identity.IMSI.control.type).toEqual("text");
                expect(typeof deviceSpec.identity.IMSI.control.value).toEqual("string");
            });

            it("returns the default control value when their is no persisted device setting", function () {
                expect(identity.IMSI().data).toEqual("4321");
            });

            it("returns a persisted device setting", function () {
                deviceSettings.register("identity.IMSI", "bread");
                expect(identity.IMSI().data).toEqual("bread");
            });
        });

        describe("PIN", function () {
            beforeEach(function () {
                spyOn(platform, "current").andReturn({
                    device: {
                        "identity": {
                            "PIN": {control: {value: "is teh sharp"}}
                        }
                    }
                });
            });
            it("has a correlative device setting", function () {
                expect(typeof deviceSpec.identity.PIN).toEqual("object");
                expect(typeof deviceSpec.identity.PIN.name).toEqual("string");
                expect(deviceSpec.identity.PIN.control.type).toEqual("text");
                expect(typeof deviceSpec.identity.PIN.control.value).toEqual("string");
            });

            it("returns the default control value when their is no persisted device setting", function () {
                expect(identity.PIN().data).toEqual("is teh sharp");
            });

            it("returns a persisted device setting", function () {
                spyOn(deviceSettings, "retrieve").andReturn("wine");
                expect(identity.PIN().data).toEqual("wine");
            });
        });

        describe("getServiceList", function () {
            it("returns an array of services", function () {
                var services = identity.getServiceList().data;
                expect(services.length).toEqual(2);
            });
        });

        describe("getDefaultService", function () {
            it("returns default services", function () {
                var defaults = identity.getDefaultService().data;
                defaults.forEach(function (service) {
                    expect(service.isDefault).toEqual(true);
                });
            });
        });

        // this could be done a lot better...
        describe("getTransportList", function () {
            it("includes a transport whose device setting is true", function () {
                spyOn(platform, "current").andReturn({
                    device: utils.copy(deviceSpec)
                });
                expect(identity.getTransportList().data.some(function (transport) {
                    return transport.type === "MDS";
                })).toEqual(true);
            });

            it("omits any transports whose device setting is false", function () {
                var settings = utils.copy(deviceSpec);
                settings.transports["TCPCellular"] = {control: {value: false}};
                spyOn(platform, "current").andReturn({
                    device: settings
                });

                expect(identity.getTransportList().data.some(function (transport) {
                    return transport.type === "TCPCellular";
                })).toEqual(false);
            });
        });
    });
});
