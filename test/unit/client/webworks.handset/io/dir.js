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
describe("webworks.handset io.dir", function () {
    var server = require('ripple/client/platform/webworks.handset/2.0.0/server/io/dir'),
        client = require('ripple/client/platform/webworks.handset/2.0.0/client/io/dir'),
        cache = require('ripple/client/platform/webworks.core/2.0.0/fsCache'),
        transport = require('ripple/client/platform/webworks.core/2.0.0/client/transport'),
        FILE = "file://";

    describe("platform spec index", function () {
        it("includes module according to proper object structure", function () {
            var spec = require('ripple/client/platform/webworks.handset/2.0.0/spec');
            expect(spec.objects.blackberry.children.io.children.dir).toEqual({
                path: "webworks.handset/2.0.0/client/io/dir",
                feature: "blackberry.io.dir"
            });
        });
    });

    describe("server index", function () {
        it("exposes the server module", function () {
            var webworks = require('ripple/client/platform/webworks.handset/2.0.0/server');
            expect(webworks.blackberry.io.dir).toEqual(server);
        });
    });

    describe("client", function () {
        beforeEach(function () {
            spyOn(transport, "call");
        });

        function _expectTransportToCall(url, data) {
            var args = transport.call.argsForCall[0];
            expect(args[0]).toEqual(url);
            expect(args[1]).toEqual(data);
        }

        describe("getFreeSpaceForRoot", function () {
            it("calls transport with appropriate args", function () {
                var path = "/";
                transport.call.andReturn(50);

                expect(client.getFreeSpaceForRoot(FILE + path)).toEqual(50);
                _expectTransportToCall("blackberry/io/dir/getFreeSpaceForRoot", {post: {path: path}});
            });
        });

        describe("getRootDirs", function () {
            it("calls transport with appropriate args", function () {
                var dirs = ["foo", "bar"];
                transport.call.andReturn(dirs);

                expect(client.getRootDirs()).toEqual([FILE + "foo", FILE + "bar"]);
                _expectTransportToCall("blackberry/io/dir/getRootDirs", {});
            });
        });
    });

    describe("server", function () {
        describe("getFreeSpaceForRoot", function () {
            it("passes to cache.dir.getFreeSpaceForRoot", function () {
                var path = "new/new/new/dir";
                spyOn(cache.dir, "getFreeSpaceForRoot").andReturn(1024);

                expect(server.getFreeSpaceForRoot(null, {path: path})).toEqual({code: 1, data: 1024});
                expect(cache.dir.getFreeSpaceForRoot).toHaveBeenCalledWith(path);
            });
        });

        describe("getRootDirs", function () {
            it("passes to cache.dir.getRootDirs", function () {
                var dirs = ["cool", "dude"];
                spyOn(cache.dir, "getRootDirs").andReturn(dirs);

                expect(server.getRootDirs(null, {})).toEqual({code: 1, data: dirs});
                expect(cache.dir.getRootDirs).toHaveBeenCalledWith();
            });
        });
    });
});
