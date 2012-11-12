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

describe("Cordova Network Bridge", function () {
    var network = ripple('platform/cordova/2.0.0/bridge/network'),
        event = ripple('event'),
        deviceSettings = ripple('deviceSettings'),
        s,
        e,
        connectionChangedSpy;

    describe("on ConnectionChanged", function () {
        beforeEach(function () {
            connectionChangedSpy = jasmine.createSpy("ConnectionChanged");
            event.on("ConnectionChanged", connectionChangedSpy);
        });

        it("calls the ConnectionChanged handler", function () {
            event.trigger("ConnectionChanged", null, true);
            expect(connectionChangedSpy).toHaveBeenCalledWith();
        });
    });

    describe("on getConnectionInfo", function () {
        beforeEach(function () {
            s = jasmine.createSpy("success");
            e = jasmine.createSpy("error");
            spyOn(deviceSettings, "retrieve").andReturn("wifi");
        });

        it("can be called with no args", function () {
            expect(network.getConnectionInfo).toThrow();
        });

        it("can be called specifying only the success arg", function () {
            network.getConnectionInfo(s);
            expect(s).toHaveBeenCalledWith("wifi");
        });

        it("can be called specifying the success and error, but no args", function () {
            network.getConnectionInfo(s, e);
            expect(s).toHaveBeenCalledWith("wifi");
            expect(e).not.toHaveBeenCalled();
        });

        it("can be called specifying all args", function () {
            network.getConnectionInfo(s, e, []);
            expect(s).toHaveBeenCalledWith("wifi");
            expect(e).not.toHaveBeenCalled();
        });
    });
});
