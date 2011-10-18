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
describe("webworks.core io.dir", function () {
    var server = require('ripple/platform/webworks.core/2.0.0/server/io/dir'),
        client = require('ripple/platform/webworks.core/2.0.0/client/io/dir'),
        cache = require('ripple/platform/webworks.core/2.0.0/fsCache'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        FILE = "file://";

    describe("tablet", function () {
        describe("platform spec index", function () {
            it("includes module according to proper object structure", function () {
                var spec = require('ripple/platform/webworks.tablet/2.0.0/spec');
                expect(spec.objects.blackberry.children.io.children.dir).toEqual({
                    path: "webworks.tablet/2.0.0/client/io/dir",
                    feature: "blackberry.io.dir"
                });
            });
        });

        describe("server index", function () {
            it("exposes the server module", function () {
                var webworks = require('ripple/platform/webworks.tablet/2.0.0/server');
                expect(webworks.blackberry.io.dir).toEqual(server);
            });
        });
    });

    describe("core", function () {
        describe("client", function () {
            beforeEach(function () {
                spyOn(transport, "call");
            });

            function _expectTransportToCall(url, data) {
                var args = transport.call.argsForCall[0];
                expect(args[0]).toEqual(url);
                expect(args[1]).toEqual(data);
            }

            describe("createNewDir", function () {
                it("calls transport with appropriate args", function () {
                    var path = "new/new/new/dir";

                    expect(client.createNewDir(FILE + path)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/dir/createNewDir", {post: {path: path}});
                });
            });

            describe("deleteDirectory", function () {
                it("calls transport with appropriate args", function () {
                    var path = "new/new/new/dir";

                    expect(client.deleteDirectory(FILE + path)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/dir/deleteDirectory", {post: {path: path}});
                });
            });

            describe("exists", function () {
                it("calls transport with appropriate args", function () {
                    var path = "new/new/new/dir";
                    transport.call.andReturn(true);

                    expect(client.exists(FILE + path)).toEqual(true);
                    _expectTransportToCall("blackberry/io/dir/exists", {post: {path: path}});
                });
            });

            describe("getParentDirectory", function () {
                it("calls transport with appropriate args", function () {
                    var path = "new/new/new/dir";
                    transport.call.andReturn("new/new/new");

                    expect(client.getParentDirectory(FILE + path)).toEqual(FILE + "new/new/new");
                    _expectTransportToCall("blackberry/io/dir/getParentDirectory", {post: {path: path}});
                });
            });

            describe("listDirectories", function () {
                it("calls transport with appropriate args", function () {
                    var path = "new/new/new/dir",
                        dirs = ["foo", "bar"];

                    transport.call.andReturn(dirs);

                    expect(client.listDirectories(FILE + path)).toEqual(dirs);
                    _expectTransportToCall("blackberry/io/dir/listDirectories", {post: {path: path}});
                });
            });

            describe("listFiles", function () {
                it("calls transport with appropriate args", function () {
                    var path = "new/new/new/dir",
                        dirs = ["foo", "bar"];

                    transport.call.andReturn(dirs);

                    expect(client.listFiles(FILE + path)).toEqual(dirs);
                    _expectTransportToCall("blackberry/io/dir/listFiles", {post: {path: path}});
                });
            });

            describe("rename", function () {
                it("calls transport with appropriate args", function () {
                    var path = "new/new/new/dir",
                        newName = "hawtness";

                    expect(client.rename(FILE + path, newName)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/dir/rename", {post: {path: path, newName: newName}});
                });
            });
        });

        // TODO: server should also support any changed URI methods and what they return
        describe("server", function () {
            describe("createNewDir", function () {
                it("passes to cache.dir.createNewDir", function () {
                    var path = "new/new/new/dir";
                    spyOn(cache.dir, "createNewDir");

                    expect(server.createNewDir(null, {path: path})).toEqual({code: 1, data: undefined});
                    expect(cache.dir.createNewDir).toHaveBeenCalledWith(path);
                });
            });

            describe("deleteDirectory", function () {
                it("passes to cache.dir.deleteDirectory", function () {
                    var path = "new/new/new/dir";
                    spyOn(cache.dir, "deleteDirectory");

                    expect(server.deleteDirectory(null, {path: path, recursive: false})).toEqual({code: 1, data: undefined});
                    expect(cache.dir.deleteDirectory).toHaveBeenCalledWith(path, false);
                });
            });

            describe("exists", function () {
                it("passes to cache.dir.exists", function () {
                    var path = "new/new/new/dir";
                    spyOn(cache.dir, "exists").andReturn(true);

                    expect(server.exists(null, {path: path})).toEqual({code: 1, data: true});
                    expect(cache.dir.exists).toHaveBeenCalledWith(path);
                });
            });

            describe("getParentDirectory", function () {
                it("passes to cache.dir.getParentDirectory", function () {
                    var path = "new/new/new/dir";
                    spyOn(cache.dir, "getParentDirectory").andReturn("new/new/new");

                    expect(server.getParentDirectory(null, {path: path})).toEqual({code: 1, data: "new/new/new"});
                    expect(cache.dir.getParentDirectory).toHaveBeenCalledWith(path);
                });
            });

            describe("listDirectories", function () {
                it("passes to cache.dir.listDirectories", function () {
                    var path = "new/new/new/dir",
                        dirs = ["cool", "dude"];
                    spyOn(cache.dir, "listDirectories").andReturn(dirs);

                    expect(server.listDirectories(null, {path: path})).toEqual({code: 1, data: dirs});
                    expect(cache.dir.listDirectories).toHaveBeenCalledWith(path);
                });
            });

            describe("listFiles", function () {
                it("passes to cache.dir.listFiles", function () {
                    var path = "new/new/new/dir",
                        files = ["cool", "dude"];
                    spyOn(cache.dir, "listFiles").andReturn(files);

                    expect(server.listFiles(null, {path: path})).toEqual({code: 1, data: files});
                    expect(cache.dir.listFiles).toHaveBeenCalledWith(path);
                });
            });

            describe("rename", function () {
                it("passes to cache.dir.rename", function () {
                    var path = "new/new/new/dir",
                        newName = "hawtness";

                    spyOn(cache.dir, "rename");

                    expect(server.rename(null, {path: path, newName: newName})).toEqual({code: 1, data: undefined});
                    expect(cache.dir.rename).toHaveBeenCalledWith(path, newName);
                });
            });
        });
    });
});
