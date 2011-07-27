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
describe("phonegap_network", function () {
    var s, _oldRetrieve,
        sinon = require('sinon'),
        deviceSettings = require('ripple/deviceSettings'),
        NetworkStatus = require('ripple/platform/phonegap/0.9/NetworkStatus'),
        network = require('ripple/platform/phonegap/0.9/network'),
        _networkConnection = true,
        _network = "GPRS";

    beforeEach(function () {
        _oldRetrieve = deviceSettings.retrieve;
        deviceSettings.retrieve = function (key) {
            switch (key) {
            case "NetworkStatus.isDataNetworkConnected":
                return _networkConnection;
            case "NetworkStatus.networkConnectionType":
                if (_networkConnection) {
                    return _network;
                }
                else {
                    return _networkConnection;
                }
            }
        };

        s = sinon.create(sinon.sandbox);
    });

    afterEach(function () {
        s.verifyAndRestore();
        deviceSettings.retrieve = _oldRetrieve;
        _network = "GPRS";
        _networkConnection = true;
    });

    describe("isReachable", function () {
        it("calls the callback", function () {
            network.isReachable("foo", s.mock().once());
        });

        it("can be called without a callback", function () {
            expect(function () {
                network.isReachable("foo");
            }).not.toThrow();
        });

        it("throws exception when callback is not a function", function () {
            expect(function () {
                network.isReachable("foo", "bar");
            }).toThrow();
        });

        it("thows exception when no host is specified", function () {
            expect(function () {
                network.isReachable();
            }).toThrow();
        });

        it("calls callback with REACHABLE_VIA_CARRIER_DATA_NETWORK by default", function () {
            network.isReachable("google.com", s.mock().once().withExactArgs(NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK));
        });

        it("calls callback with NOT_REACHABLE when network status is REACHABLE_VIA_WIFI_NETWORK isDataNetworkConnected is false", function () {
            _networkConnection = false;
            _network = "WIFI";
            network.isReachable("google.com", s.mock().once().withExactArgs(NetworkStatus.NOT_REACHABLE));
        });

        it("calls callback with NOT_REACHABLE when network status is REACHABLE_VIA_CARRIER_DATA_NETWORK and isDataNetworkConnected is false", function () {
            _networkConnection = false;
            _network = "GPRS";
            network.isReachable("google.com", s.mock().once().withExactArgs(NetworkStatus.NOT_REACHABLE));
        });

        it("calls callback with REACHABLE_VIA_CARRIER_DATA_NETWORK when isDataNetworkConnected is true and networkConnectionType is GPRS", function () {
            _networkConnection = true;
            _network = "GPRS";
            network.isReachable("google.com", s.mock().once().withExactArgs(NetworkStatus.REACHABLE_VIA_CARRIER_DATA_NETWORK));
        });

        it("calls callback with REACHABLE_VIA_WIFI_NETWORK when isDataNetworkConnected is true and networkConnectionType is WIFI", function () {
            _networkConnection = true;
            _network = "WIFI";
            network.isReachable("google.com", s.mock().once().withExactArgs(NetworkStatus.REACHABLE_VIA_WIFI_NETWORK));
        });
    });
});
