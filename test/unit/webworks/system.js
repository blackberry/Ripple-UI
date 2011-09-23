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
describe("webworks.core system", function () {
    var system = require('ripple/platform/webworks.core/2.0.0/server/system'),
        client = require('ripple/platform/webworks.core/2.0.0/client/system'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        deviceSpec = require('ripple/platform/webworks.handset/2.0.0/spec/device'),
        app = require('ripple/app'),
        utils = require('ripple/utils'),
        deviceSettings = require('ripple/deviceSettings'),
        notifications = require('ripple/notifications'),
        Playbook = require('ripple/devices/Playbook'),
        devices = require('ripple/devices'),
        platform = require('ripple/platform');

    describe("client", function () {
        describe("hasCapability", function () {
            it("calls the transport with id and properties", function () {
                spyOn(transport, "call").andReturn(2);

                expect(client.hasCapability("epic")).toEqual(2);
                expect(transport.call).toHaveBeenCalledWith("blackberry/system/hasCapability", {
                    get: {capability: "epic"}
                });
            });
        });

        describe("hasDataCoverage", function () {
            it("calls the transport with id and properties", function () {
                spyOn(transport, "call").andReturn(4);
                expect(client.hasDataCoverage()).toEqual(4);
                expect(transport.call).toHaveBeenCalledWith("blackberry/system/hasDataCoverage");
            });
        });

        describe("hasPermission", function () {
            it("calls the transport with id and properties", function () {
                spyOn(transport, "call").andReturn(2);

                expect(client.hasPermission("something")).toEqual(2);
                expect(transport.call).toHaveBeenCalledWith("blackberry/system/hasPermission", {
                    get: {desiredModule: "something"}
                });
            });
        });

        describe("isMassStorageActive", function () {
            it("calls the transport with id and properties", function () {
                spyOn(transport, "call").andReturn(true);
                expect(client.isMassStorageActive()).toEqual(true);
                expect(transport.call).toHaveBeenCalledWith("blackberry/system/isMassStorageActive");
            });
        });
    });

    describe("using server/system", function () {
        describe("softwareVersion", function () {
            it("returns the current device's os version", function () {
                spyOn(devices, "getCurrentDevice").andReturn(Playbook);
                expect(system.softwareVersion().data).toEqual(Playbook.osVersion);
            });
        });

        describe("model", function () {
            it("returns the current device's model", function () {
                spyOn(devices, "getCurrentDevice").andReturn(Playbook);
                expect(system.model().data).toEqual(Playbook.model);
            });
        });

        describe("scriptApiVersion", function () {
            it("returns the current platform's version", function () {
                spyOn(platform, "current").andReturn({version: "2.0.0"});
                expect(system.scriptApiVersion().data).toEqual("2.0.0");
            });
        });

        describe("isMassStorageActive", function () {
            it("has a correlative device setting", function () {
                expect(typeof deviceSpec.system.isMassStorageActive).toEqual("object");
            });

            it("returns the default control value when there is no persisted device setting", function () {
                spyOn(platform, "current").andReturn({
                    device: {
                        "system": {
                            "isMassStorageActive": {control: {value: true}}
                        }
                    }
                });
                expect(system.isMassStorageActive().data).toEqual(true);
            });

            it("returns a persisted device setting", function () {
                deviceSettings.register("system.isMassStorageActive", false);
                expect(system.isMassStorageActive().data).toEqual(false);
            });
        });

        describe("hasDataCoverage", function () {
            it("has a correlative device setting", function () {
                expect(typeof deviceSpec.system.hasDataCoverage).toEqual("object");
            });

            it("returns the default control value when their is no persisted device setting", function () {
                spyOn(platform, "current").andReturn({
                    device: {
                        "system": {
                            "hasDataCoverage": {control: {value: true}}
                        }
                    }
                });
                expect(system.hasDataCoverage().data).toEqual(true);
            });

            it("returns a persisted device setting", function () {
                deviceSettings.register("system.hasDataCoverage", false);
                expect(system.hasDataCoverage().data).toEqual(false);
            });
        });

        describe("setHomeScreenBackground", function () {
            it("raises notification when called", function () {
                var args = {filePath: "the path"};
                spyOn(notifications, "openNotification");
                system.setHomeScreenBackground(args);
                expect(notifications.openNotification.mostRecentCall.args[0]).toEqual("normal");
                expect(notifications.openNotification.mostRecentCall.args[1]).toMatch(args.filePath);
            });
        });

        describe("hasCapability", function () {
            it("returns true when capability is found", function () {
                var mockDevice = {
                    capabilities: ["location.gps"]
                };
                spyOn(devices, "getCurrentDevice").andReturn(mockDevice);
                expect(system.hasCapability({capability: "location.gps"}).data).toEqual(true);
            });

            it("returns false when device has no capabilities array", function () {
                spyOn(devices, "getCurrentDevice").andReturn({});
                expect(system.hasCapability({capability: "network.wlan"}).data).toEqual(false);
            });
        });

        describe("hasPermission", function () {
            var _location;

            beforeEach(function () {
                _location = {
                    href: "http://127.0.0.1"
                };
                spyOn(utils, "location").andCallFake(function () {
                    return _location;
                });
            });

            it("looks at the app Info object", function () {
                spyOn(app, "getInfo").andReturn({
                    features: {
                    }
                });

                system.hasPermission({
                    desiredModule: "blackberry.pim.memo"
                });
                expect(app.getInfo).toHaveBeenCalled();
            });

            it("returns ALLOW if the feature exists and has the given url", function () {
                spyOn(app, "getInfo").andReturn({
                    features: {
                        "blackberry.pim.memo": {
                            URIs: [{
                                value: "http://127.0.0.1"
                            }]
                        }
                    }
                });

                expect(system.hasPermission({
                    desiredModule: "blackberry.pim.memo"
                }).data).toBe(client.ALLOW);
            });

            it("returns DENY if the feature exists and doesn't have the given url", function () {
                spyOn(app, "getInfo").andReturn({
                    features: {
                        "blackberry.pim.memo": {
                            URIs: [{
                                value: "http://www.roflcopter.net"
                            }]
                        }
                    }
                });

                expect(system.hasPermission({
                    desiredModule: "blackberry.pim.memo"
                }).data).toBe(client.DENY);
            });

            it("returns DENY if the feature exists and is enabled for the url but not subdomains", function () {
                _location.href = "http://www.blackberry.com/developers/";

                spyOn(app, "getInfo").andReturn({
                    features: {
                        "blackberry.pim.memo": {
                            URIs: [{
                                value: "http://www.blackberry.com",
                                subdomains: false
                            }]
                        }
                    }
                });
                expect(system.hasPermission({
                    desiredModule: "blackberry.pim.memo"
                }).data).toBe(client.DENY);
            });

            it("returns ALLOW if the feature exists and is enabled for the url and subdomains", function () {
                _location.href = "http://www.tinyHippos.com/blog/";
                spyOn(app, "getInfo").andReturn({
                    features: {
                        "blackberry.pim.memo": {
                            URIs: [{
                                value: "http://www.tinyHippos.com",
                                subdomains: true
                            }]
                        }
                    }
                });
                expect(system.hasPermission({
                    desiredModule: "blackberry.pim.memo"
                }).data).toBe(client.ALLOW);
            });

            it("returns ALLOW by default if there is are no declared features", function () {
                spyOn(app, "getInfo").andReturn({});

                expect(system.hasPermission({
                    desiredModule: "blackberry.invoke"
                }).data).toBe(client.ALLOW);
            });
        });

        describe("network", function () {
            it("returns the persisted device setting", function () {
                deviceSettings.register("system.network", "iDEN");
                expect(system.network().data).toEqual("iDEN");
            });
        });
    });
});
