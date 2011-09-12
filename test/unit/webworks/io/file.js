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
describe("webworks.core io.file", function () {
    var server = require('ripple/platform/webworks.core/2.0.0/server/io/file'),
        client = require('ripple/platform/webworks.core/2.0.0/client/io/file'),
        cache = require('ripple/platform/webworks.core/2.0.0/fsCache'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        notifications = require('ripple/notifications'),
        MockBaton = function () {
            this.take = jasmine.createSpy("baton.take");
            this.pass = jasmine.createSpy("baton.pass");
        },
        FILE = "file://";

    describe("handset", function () {
        describe("platform spec index", function () {
            it("includes module according to proper object structure", function () {
                var spec = require('ripple/platform/webworks.handset/2.0.0/spec');
                expect(spec.objects.blackberry.children.io.children.file).toEqual({
                    path: "webworks.core/2.0.0/client/io/file",
                    feature: "blackberry.io.file"
                });
            });
        });

        describe("server index", function () {
            it("exposes the server module", function () {
                var webworks = require('ripple/platform/webworks.handset/2.0.0/server');
                expect(webworks.blackberry.io.file).toEqual(server);
            });
        });
    });

    describe("tablet", function () {
        describe("platform spec index", function () {
            it("includes module according to proper object structure", function () {
                var spec = require('ripple/platform/webworks.tablet/2.0.0/spec');
                expect(spec.objects.blackberry.children.io.children.file).toEqual({
                    path: "webworks.core/2.0.0/client/io/file",
                    feature: "blackberry.io.file" // required, but permissions are optional (see docs)
                });
            });
        });

        describe("server index", function () {
            it("exposes the server module", function () {
                var webworks = require('ripple/platform/webworks.tablet/2.0.0/server');
                expect(webworks.blackberry.io.file).toEqual(server);
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

            describe("copy", function () {
                it("calls transport with appropriate args", function () {
                    var from = "afile",
                        to = "somefile";
                    expect(client.copy(FILE + from, FILE + to)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/file/copy", {post: {
                        from: from,
                        to: to
                    }});
                });
            });

            describe("deleteFile", function () {
                it("calls transport with appropriate args", function () {
                    var path = "foo.js";
                    expect(client.deleteFile(FILE + path)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/file/deleteFile", {post: {path: path}});
                });
            });

            describe("exists", function () {
                it("calls transport with appropriate args", function () {
                    var path = "foo.js";
                    transport.call.andReturn("result");
                    expect(client.exists(FILE + path)).toEqual("result");
                    _expectTransportToCall("blackberry/io/file/exists", {post: {path: path}});
                });
            });

            describe("getFileProperties", function () {
                it("calls transport with appropriate args", function () {
                    var path = "foo.js",
                        properties = {
                            directory: "foo"
                        },
                        result;

                    transport.call.andReturn(properties);
                    result = client.getFileProperties(FILE + path);

                    expect(result).toEqual(properties);
                    expect(result.directory).toEqual(FILE + "foo");
                    _expectTransportToCall("blackberry/io/file/getFileProperties", {post: {path: path}});
                });
            });

            describe("open", function () {
                it("calls transport with appropriate args", function () {
                    var path = "openpath";
                    expect(client.open(FILE + path)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/file/open", {post: {path: path}});
                });
            });

            describe("readFile", function () {
                it("calls the transport when sync", function () {
                    var success = jasmine.createSpy(),
                        data = "file data",
                        path = "path",
                        async = false;

                    transport.call.andReturn({
                        fullPath: path,
                        blobData: data
                    });

                    expect(client.readFile(FILE + path, success, async)).not.toBeDefined();
                    expect(success).toHaveBeenCalledWith(FILE + path, data);
                    _expectTransportToCall("blackberry/io/file/readFile", {post: {path: path, async: async}});
                });

                it("polls the transport when async", function () {
                    var success = jasmine.createSpy(),
                        data = "file data",
                        path = "path",
                        async = true;

                    spyOn(transport, "poll").andCallFake(function (url, opts, callback) {
                        expect(callback({
                            fullPath: path,
                            blobData: data
                        })).toEqual(false);
                    });

                    expect(client.readFile(FILE + path, success, async)).not.toBeDefined();
                    expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/io/file/readFile");
                    expect(transport.poll.argsForCall[0][1]).toEqual({post: {path: path, async: async}});
                    expect(success).toHaveBeenCalledWith(FILE + path, data);
                });
            });

            describe("rename", function () {
                it("calls transport with appropriate args", function () {
                    var path = "foo/bar.js",
                        newName = "new.js";
                    expect(client.rename(FILE + path, newName)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/file/rename", {post: {path: path, newName: newName}});
                });
            });

            describe("saveFile", function () {
                it("calls transport with appropriate args", function () {
                    var path = "foo/bar.js",
                        blob = {
                            size: 4
                        };
                    expect(client.saveFile(FILE + path, blob)).not.toBeDefined();
                    _expectTransportToCall("blackberry/io/file/saveFile", {post: {path: path, blob: blob}});
                });
            });
        });

        // TODO: server should also support any changed URI methods and what they return
        describe("server", function () {
            describe("copy", function () {
                it("passes to cache.file.copy", function () {
                    var from = "path",
                        to = "newpath";
                    spyOn(cache.file, "copy");
                    expect(server.copy(null, {from: from, to: to})).toEqual({code: 1, data: undefined});
                    expect(cache.file.copy).toHaveBeenCalledWith(from, to);
                });
            });

            describe("deleteFile", function () {
                it("passes to cache.file.deleteFile", function () {
                    var path = "apath";
                    spyOn(cache.file, "deleteFile");
                    expect(server.deleteFile(null, {path: path})).toEqual({code: 1, data: undefined});
                    expect(cache.file.deleteFile).toHaveBeenCalledWith(path);
                });
            });

            describe("exists", function () {
                it("passes to cache.file.exists", function () {
                    var path = "apath";
                    spyOn(cache.file, "exists").andReturn(true);
                    expect(server.exists(null, {path: path})).toEqual({code: 1, data: true});
                    expect(cache.file.exists).toHaveBeenCalledWith(path);
                });
            });

            describe("getFileProperties", function () {
                it("passes to cache.file.getFileProperties", function () {
                    var path = "apath";
                    spyOn(cache.file, "getFileProperties").andReturn({prop: 1});
                    expect(server.getFileProperties(null, {path: path})).toEqual({code: 1, data: {prop: 1}});
                    expect(cache.file.getFileProperties).toHaveBeenCalledWith(path);
                });
            });

            describe("open", function () {
                it("raises a notification that the file was opened", function () {
                    var path = "path";
                    spyOn(notifications, "openNotification");
                    spyOn(cache.file, "exists");
                    server.open(null, {path: path});
                    expect(notifications.openNotification.argsForCall[0][0]).toEqual("normal");
                });

                it("returns true when file exists", function () {
                    var path = "path";
                    spyOn(cache.file, "exists").andReturn(true);
                    expect(server.open(null, {path: path})).toEqual({code: 1, data: true});
                });

                it("returns false when file does not exist", function () {
                    var path = "path";
                    spyOn(cache.file, "exists").andReturn(false);
                    expect(server.open(null, {path: path})).toEqual({code: 1, data: false});
                });
            });

            describe("readFile", function () {
                it("returns file data synchronously", function () {
                    var baton = new MockBaton(),
                        async = false,
                        path = "filepath",
                        data = "filedata";

                    spyOn(cache.file, "readFile").andCallFake(function (p, success, async) {
                        success(data);
                    });

                    expect(server.readFile(null, {path: path, async: async}, baton)).toEqual({code: 1, data: {
                        fullPath: path,
                        blobData: data
                    }});

                    expect(cache.file.readFile.argsForCall[0][0]).toEqual(path);
                    expect(cache.file.readFile.argsForCall[0][2]).toEqual(async);
                    expect(baton.take).not.toHaveBeenCalled();
                    expect(baton.pass).not.toHaveBeenCalledWith();
                });

                it("returns file data asynchronously", function () {
                    var baton = new MockBaton(),
                        async = true,
                        path = "filepath",
                        data = "filedata";

                    spyOn(cache.file, "readFile").andCallFake(function (p, success, async) {
                        success(data);
                    });

                    server.readFile(null, {path: path, async: async}, baton);

                    expect(cache.file.readFile.argsForCall[0][0]).toEqual(path);
                    expect(cache.file.readFile.argsForCall[0][2]).toEqual(async);
                    expect(baton.take).toHaveBeenCalled();
                    expect(baton.pass).toHaveBeenCalledWith({code: 1, data: {
                        fullPath: path,
                        blobData: data
                    }});
                });
            });

            describe("rename", function () {
                it("passes to cache.file.rename", function () {
                    var path = "foo/bar",
                        newName = "bar2";
                    spyOn(cache.file, "rename");
                    expect(server.rename(null, {path: path, newName: newName})).toEqual({code: 1, data: undefined});
                    expect(cache.file.rename).toHaveBeenCalledWith(path, newName);
                });
            });

            describe("saveFile", function () {
                it("passes to cache.file.saveFile", function () {
                    var path = "apath",
                        blob = {size: 3};
                    spyOn(cache.file, "saveFile");
                    expect(server.saveFile(null, {path: path, blob: blob})).toEqual({code: 1, data: undefined});
                    expect(cache.file.saveFile).toHaveBeenCalledWith(path, blob);
                });
            });
        });
    });
});
