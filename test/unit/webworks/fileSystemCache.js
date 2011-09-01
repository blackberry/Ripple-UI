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
var fs = require('ripple/fileSystem'),
    cache = require('ripple/platform/webworks.core/2.0.0/fileSystemCache');

describe("fileSystemCache", function () {
    var _root = [{
        fullPath: "/dude",
        name: "dude",
        isDirectory: false
    }, {
        fullPath: "/dudeDir",
        name: "dudeDir",
        isDirectory: true
    }, {
        fullPath: "/hungry",
        name: "hungry",
        isDirectory: false
    }, {
        fullPath: "/hippo",
        name: "hippo",
        isDirectory: true
    }];

    beforeEach(function () {
        spyOn(fs, "ls").andCallFake(function (path, success, error) {
            success(path === "/" ? _root : []);
        });

        cache.initialize();
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
            it("returns true when the file exists", function () {
                spyOn(fs, "stat");
                expect(cache.dir.exists("/dudeDir")).toBe(true);
                expect(fs.stat.argsForCall[0][0]).toBe("/dudeDir");
                expect(typeof fs.stat.argsForCall[0][1]).toBe("function");
                expect(typeof fs.stat.argsForCall[0][2]).toBe("function");
            });
        });

        describe("getParentDirectory", function () {
            it("returns the path to the parent directory", function () {
                var entry = {
                    getParent: jasmine.createSpy()
                };

                spyOn(fs, "stat").andCallFake(function (path, success, error) {
                    success(entry);
                });

                expect(cache.dir.getParentDirectory("/dudeDir")).toBe("/");
                expect(fs.stat.argsForCall[0][0]).toBe("/dudeDir");
                expect(typeof fs.stat.argsForCall[0][1]).toBe("function");
                expect(typeof fs.stat.argsForCall[0][2]).toBe("function");
                expect(typeof entry.getParent.argsForCall[0][0]).toBe("function");
                expect(typeof entry.getParent.argsForCall[0][1]).toBe("function");
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
                expect(cache.dir.listFiles("/")).toEqual(["dude", "hungry"]);
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
    });
});
