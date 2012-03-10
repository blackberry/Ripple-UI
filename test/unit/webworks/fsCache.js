/*
 * Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var fs = require('ripple/dbfs'),
    event = require('ripple/event'),
    FileProperties = require('ripple/platform/webworks.core/2.0.0/client/FileProperties'),
    bbUtils = require('ripple/platform/webworks.core/2.0.0/client/utils'),
    cache = require('ripple/platform/webworks.core/2.0.0/fsCache');

describe("fsCache", function () {
    var _root = [{
        fullPath: "/dude",
        name: "dude",
        isDirectory: false,
        file: function (success, error) {
            success({
                lastModifiedDate: new Date(456),
                size: 20,
                type: "text/plain"
            });
        }
    }, {
        fullPath: "/dudeDir",
        name: "dudeDir",
        isDirectory: true
    }, {
        fullPath: "/hungry.js",
        name: "hungry.js",
        isDirectory: false,
        file: function (success, error) {
            success({
                lastModifiedDate: new Date(123),
                size: 50,
                type: "application/x-javascript"
            });
        }
    }, {
        fullPath: "/hippo",
        name: "hippo",
        isDirectory: true
    }];

    beforeEach(function () {
        spyOn(fs, "read");
        spyOn(fs, "ls").andCallFake(function (path, success, error) {
            success(path === "/" ? _root : []);
        });

        cache.refresh();
    });

    // TODO: cache (get,set,delete) layer is not under test
    it("calls refresh on FileSystemInitialized", function () {
        spyOn(cache, "refresh");
        spyOn(fs, "mkdir").andCallFake(function (path, success, error) {
            success();
        });
        event.trigger("FileSystemInitialized", null, true);
        expect(cache.refresh).toHaveBeenCalled();
    });

    describe("io.file", function () {
        describe("exists", function () {
            it("returns true when the file exists", function () {
                spyOn(fs, "stat");
                expect(cache.file.exists("/hungry.js")).toBe(true);
            });

            it("returns false when when given a directory", function () {
                spyOn(fs, "stat");
                expect(cache.file.exists("/dudeDir")).toBe(false);
            });
        });

        describe("deleteFile", function () {
            it("removes a file", function () {
                spyOn(fs, "rm");
                cache.file.deleteFile("/hungry.js");
                expect(fs.rm.argsForCall[0][0]).toBe("/hungry.js");
                expect(typeof fs.rm.argsForCall[0][1]).toBe("function");
                expect(typeof fs.rm.argsForCall[0][2]).toBe("function");
            });
        });

        describe("copy", function () {
            it("copies the file at the specified path", function () {
                spyOn(fs, "cp");
                cache.file.copy("/hungry.js", "/hungrier");
                expect(fs.cp.argsForCall[0][0]).toBe("/hungry.js");
                expect(fs.cp.argsForCall[0][1]).toBe("/hungrier");
                expect(typeof fs.cp.argsForCall[0][2]).toBe("function");
                expect(typeof fs.cp.argsForCall[0][3]).toBe("function");
            });
        });

        describe("getFileProperties", function () {
            it("returns an object of file properties", function () {
                spyOn(fs, "stat");

                var result = cache.file.getFileProperties("/hungry.js");

                expect(result.dateModified).toEqual(new Date(123));
                expect(result.dateCreated).toEqual(new Date(123));
                expect(result.directory).toEqual("/");
                expect(result.fileExtension).toEqual("js");
                expect(result.isHidden).toEqual(false);
                expect(result.isReadonly).toEqual(false);
                expect(result.mimeType).toEqual("application/x-javascript");
                expect(result.size).toEqual(50);
                expect(result instanceof FileProperties).toBe(true);
            });
        });

        describe("rename", function () {
            it("renames a file", function () {
                spyOn(cache.dir, "rename");
                cache.file.rename("/hungry.js", "hungryhungry.js");
                expect(cache.dir.rename).toHaveBeenCalledWith("/hungry.js", "hungryhungry.js");
            });
        });
    });

    describe("io.dir", function () {
        describe("createNewDir", function () {
            it("creates a directory", function () {
                spyOn(fs, "mkdir");
                cache.dir.createNewDir("/test");
                expect(fs.mkdir.argsForCall[0][0]).toBe("/test");
                expect(typeof fs.mkdir.argsForCall[0][1]).toBe("function");
                expect(typeof fs.mkdir.argsForCall[0][2]).toBe("function");
            });
        });

        describe("createNewDir", function () {
            it("creates a directory with a trailing slash", function () {
                spyOn(fs, "mkdir");
                cache.dir.createNewDir("/foo");
                expect(fs.mkdir.argsForCall[0][0]).toBe("/foo");
                expect(typeof fs.mkdir.argsForCall[0][1]).toBe("function");
                expect(typeof fs.mkdir.argsForCall[0][2]).toBe("function");
            });
        });

        describe("deleteDirectory", function () {
            it("removes a directory", function () {
                spyOn(fs, "rmdir");
                cache.dir.deleteDirectory("/dudeDir");
                expect(fs.rmdir.argsForCall[0][0]).toBe("/dudeDir");
                expect(typeof fs.rmdir.argsForCall[0][1]).toBe("function");
                expect(typeof fs.rmdir.argsForCall[0][2]).toBe("function");
            });

            it("removes a directory recursively", function () {
                spyOn(fs, "rm");
                cache.dir.deleteDirectory("/dudeDir", true);
                expect(fs.rm.argsForCall[0][0]).toBe("/dudeDir");
                expect(typeof fs.rm.argsForCall[0][1]).toBe("function");
                expect(typeof fs.rm.argsForCall[0][2]).toBe("function");
                expect(fs.rm.argsForCall[0][3]).toEqual({recursive: true});
            });
        });

        describe("exists", function () {
            it("returns true when the directory exists", function () {
                spyOn(fs, "stat");
                expect(cache.dir.exists("/dudeDir")).toBe(true);
            });

            it("returns false when given a file", function () {
                spyOn(fs, "stat");
                expect(cache.dir.exists("/hungry.js")).toBe(false);
            });

            it("returns true when the directory exists", function () {
                spyOn(fs, "stat");
                expect(cache.dir.exists("/dudeDir")).toBe(true);
            });
        });

        describe("getParentDirectory", function () {
            it("returns the path to the parent directory", function () {
                expect(cache.dir.getParentDirectory("/dudeDir")).toBe("/");
            });
        });

        describe("listDirectories", function () {
            it("returns an array of all directories in a path", function () {
                expect(cache.dir.listDirectories("/")).toEqual(["dudeDir", "hippo"]);
                expect(fs.ls.argsForCall[0][0]).toBe("/");
                expect(typeof fs.ls.argsForCall[0][1]).toBe("function");
                expect(typeof fs.ls.argsForCall[0][2]).toBe("function");
            });
        });

        describe("listFiles", function () {
            it("returns an array of all files in a path", function () {
                expect(cache.dir.listFiles("/")).toEqual(["dude", "hungry.js"]);
                expect(fs.ls.argsForCall[0][0]).toBe("/");
                expect(typeof fs.ls.argsForCall[0][1]).toBe("function");
                expect(typeof fs.ls.argsForCall[0][2]).toBe("function");
            });
        });

        describe("rename", function () {
            it("renames a directory at the specified path", function () {
                spyOn(fs, "mv");
                cache.dir.rename("/dudeDir", "theDudeDir");
                expect(fs.mv.argsForCall[0][0]).toBe("/dudeDir");
                expect(fs.mv.argsForCall[0][1]).toBe("/theDudeDir");
                expect(typeof fs.mv.argsForCall[0][2]).toBe("function");
                expect(typeof fs.mv.argsForCall[0][3]).toBe("function");
            });
        });

        describe("getRootDirs", function () {
            it("returns an array of top level directories", function () {
                spyOn(cache.dir, "listDirectories").andReturn(["foo"]);
                expect(cache.dir.getRootDirs()).toEqual(["foo"]);
                expect(cache.dir.listDirectories).toHaveBeenCalledWith("/");
            });
        });
    });

    describe("readFile", function () {
        it("asynchronously reads data from a file", function () {
            var blob = {size: 5},
                path = "/hungry.js",
                success = jasmine.createSpy();

            fs.read.reset();
            fs.read.andCallFake(function (path, success, error) {
                setTimeout(function () {
                    success(blob);
                }, 1);
            });

            spyOn(bbUtils, "stringToBlob").andReturn(blob);

            cache.file.readFile(path, success, true);

            waits(1);
            runs(function () {
                expect(success).toHaveBeenCalledWith(blob);
                expect(fs.read.argsForCall[0][0]).toBe(path);
                expect(typeof fs.read.argsForCall[0][1]).toBe("function");
                expect(typeof fs.read.argsForCall[0][2]).toBe("function");
            });
        });

        it("synchronously reads data from a file", function () {
            var blob = {size: 5},
                path = "/hungry.js",
                success = jasmine.createSpy();

            fs.read.reset();

            spyOn(bbUtils, "stringToBlob").andReturn(blob);

            cache.file.readFile(path, success, false);

            expect(success).toHaveBeenCalledWith(blob);
        });
    });

    describe("saveFile", function () {
        it("asynchronously writes data to a file", function () {
            var blob = {size: 5},
                path = "/hungry.js";

            spyOn(fs, "write");
            spyOn(bbUtils, "blobToString").andReturn("contents");

            cache.file.saveFile(path, blob);

            expect(fs.write.argsForCall[0][0]).toBe(path);
            expect(fs.write.argsForCall[0][1]).toBe("contents");
            expect(typeof fs.write.argsForCall[0][2]).toBe("function");
            expect(typeof fs.write.argsForCall[0][3]).toBe("function");
        });
    });
});
