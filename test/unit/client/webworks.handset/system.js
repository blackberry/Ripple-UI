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
describe("webworks.handset system", function () {
    var system = ripple('platform/webworks.core/2.0.0/server/system'),
        systemEvent = ripple('platform/webworks.handset/2.0.0/server/systemEvent'),
        client = ripple('platform/webworks.handset/2.0.0/client/system'),
        transport = ripple('platform/webworks.core/2.0.0/client/transport'),
        utils = ripple('utils');

    describe("using webworks.handset server", function () {
        it("exposes the system module", function () {
            var webworks = ripple('platform/webworks.handset/2.0.0/server'),
                obj = {};
            obj.event = systemEvent;
            utils.mixin(system, obj);
            expect(webworks.blackberry.system).toEqual(obj);
        });
    });

    describe("client", function () {
        describe("setHomeScreenBackground", function () {
            it("calls the transport with id and properties", function () {
                spyOn(transport, "call");
                client.setHomeScreenBackground("filepath");
                expect(transport.call).toHaveBeenCalledWith("blackberry/system/setHomeScreenBackground", {
                    get: {filePath: "filepath"},
                    async: true
                });
            });
        });
    });
});
