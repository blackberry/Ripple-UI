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
var fs = require('ripple/fs'),
    event = require('ripple/event'),
    utils = require('ripple/utils');

describe("fs", function () {
    var _resultEntries,
        _dirEntry,
        _baton,
        _fs;

    beforeEach(function () {
        _baton = {
            take: jasmine.createSpy("baton.take"),
            pass: jasmine.createSpy("baton.pass")
        };

        _dirEntry = {
            createReader: function () {
                return {
                    readEntries: function (success, error) {
                        success(_resultEntries);
                    }
                };
            }
        };

        _fs = {
            root: {
                getDirectory: function (path, options, success, error) {
                    success(_dirEntry);
                }
            }
        };

        window.TEMPORARY = 0;
        window.PERSISTENT = 1;
        window.webkitRequestFileSystem = window.requestFileSystem = function (persistenceMethod, fsSize, success, failure) {
            success(_fs);
        };

        window.webkitResolveLocalFileSystemURL = window.resolveLocalFileSystemURL = function (url, success, failure) {
        };

        window.WebKitBlobBuilder = window.BlobBuilder = function () {};
        window.FileReader = global.FileReader = function () {};
        window.FileError = global.FileError = {NOT_FOUND_ERR: 1};

        spyOn(event, "trigger");
        fs.initialize(null, _baton);
    });

    afterEach(function () {
        delete window.TEMPORARY;
        delete window.PERSISTENT;
        delete window.requestFileSystem;
        delete window.webkitRequestFileSystem;
        delete window.resolveLocalFileSystemURL;
        delete window.webkitResolveLocalFileSystemURL;
        delete window.WebKitBlobBuilder;
        delete window.BlobBuilder;
        delete window.FileReader;
        delete global.FileReader;
    });

    describe("initialize", function () {
        it("uses requestFileSystem", function () {
            spyOn(window, "requestFileSystem");
            fs.initialize(null, _baton);

            expect(window.requestFileSystem.argsForCall[0][0]).toEqual(window.TEMPORARY);
            expect(window.requestFileSystem.argsForCall[0][1]).toEqual(10 * 1024 * 1024);
        });

        it("takes and passes the baton", function () {
            spyOn(window, "requestFileSystem");
            fs.initialize(null, _baton);

            expect(_baton.take).toHaveBeenCalled();
            expect(_baton.pass).toHaveBeenCalled();
        });

        it("triggers FileSystemIntialized", function () {
            spyOn(window, "requestFileSystem");
            fs.initialize(null, _baton);

            expect(event.trigger).toHaveBeenCalledWith("FileSystemInitialized", null, true);
        });

        it("uses webkitRequestFileSystem when requestFileSystem is not present", function () {
            delete window.requestFileSystem;
            spyOn(window, "webkitRequestFileSystem");
            fs.initialize(null, _baton);

            expect(window.webkitRequestFileSystem.argsForCall[0][0]).toEqual(window.TEMPORARY);
            expect(window.webkitRequestFileSystem.argsForCall[0][1]).toEqual(10 * 1024 * 1024);
        });
    });

    describe("mkdir", function () {
        it("creates a directory off of root", function () {
            var error = jasmine.createSpy(),
                success = jasmine.createSpy();

            _fs.root.getDirectory = function (path, options, success, error) {
                success(_resultEntries[0]);
            };

            spyOn(_fs.root, "getDirectory").andCallThrough();

            _resultEntries = [
                {fullPath: "whatev", isDirectory: true}
            ];

            fs.mkdir("whatev", success, error);

            expect(_fs.root.getDirectory.argsForCall[0][0]).toEqual("whatev");
            expect(_fs.root.getDirectory.argsForCall[0][1]).toEqual({create: true});
            expect(typeof _fs.root.getDirectory.argsForCall[0][2]).toEqual("function");
            expect(_fs.root.getDirectory.argsForCall[0][3]).toEqual(error);
            expect(success).toHaveBeenCalledWith(_resultEntries[0]);
            expect(error).not.toHaveBeenCalled();
        });
    });

    describe("touch", function () {
        it("creates a file off of root", function () {
            var error = jasmine.createSpy(),
                success = jasmine.createSpy();

            _fs.root.getFile = function (path, options, success, error) {
                success(_resultEntries[0]);
            };

            spyOn(_fs.root, "getFile").andCallThrough();

            _resultEntries = [
                {fullPath: "er", isDirectory: false}
            ];

            fs.touch("er", success, error);

            expect(_fs.root.getFile.argsForCall[0][0]).toEqual("er");
            expect(_fs.root.getFile.argsForCall[0][1]).toEqual({create: true});
            expect(typeof _fs.root.getFile.argsForCall[0][2]).toEqual("function");
            expect(_fs.root.getFile.argsForCall[0][3]).toEqual(error);
            expect(success).toHaveBeenCalledWith(_resultEntries[0]);
            expect(error).not.toHaveBeenCalled();
        });
    });

    describe("ls", function () {
        it("defaults to '/' for a null path", function () {
            _fs.root.getDirectory = jasmine.createSpy();
            fs.ls(null);
            expect(_fs.root.getDirectory.argsForCall[0][0]).toEqual("/");
        });

        it("returns a list of items in the root", function () {
            var error = jasmine.createSpy();

            _resultEntries = [
                {name: "dude", isDirectory: true},
                {name: "sweet.js", isDirectory: false}
            ];

            fs.ls("/", function (entries) {
                expect(entries[0]).toEqual(_resultEntries[0]);
                expect(entries[1]).toEqual(_resultEntries[1]);
            }, error);

            expect(error).not.toHaveBeenCalled();
        });

        it("calls error callback when path does not exist", function () {
            var success = jasmine.createSpy(),
                FileError = {
                    code: 5,
                    ENCODING_ERR: 5
                };

            _dirEntry.createReader = function () {
                return {
                    readEntries: function (success, error) {
                        error(FileError);
                    }
                };
            };

            fs.ls("/foo", success, function (error) {
                expect(error).toEqual(FileError);
            });

            expect(success).not.toHaveBeenCalled();
        });
    });

    describe("rm", function () {
        it("removes a file from the root", function () {
            var error = jasmine.createSpy(),
                remove = jasmine.createSpy().andCallFake(function (callback) {
                    callback();
                }),
                success = jasmine.createSpy();

            _fs.root.getFile = function (path, options, success, error) {
                success(_resultEntries[0]);
            };

            spyOn(_fs.root, "getFile").andCallThrough();

            _resultEntries = [
                {fullPath: "/foo", isDirectory: false, remove: remove}
            ];

            fs.rm("/foo", success, error);

            expect(_fs.root.getFile.argsForCall[0][0]).toEqual("/foo");
            expect(_fs.root.getFile.argsForCall[0][1]).toEqual({create: false});
            expect(typeof _fs.root.getFile.argsForCall[0][2]).toEqual("function");
            expect(_fs.root.getFile.argsForCall[0][3]).toEqual(error);
            expect(success).toHaveBeenCalled();
            expect(typeof remove.argsForCall[0][0]).toEqual("function");
            expect(remove.argsForCall[0][1]).toEqual(error);
            expect(error).not.toHaveBeenCalled();
        });

        it("removes a directory recursively", function () {
            var error = jasmine.createSpy(),
                removeRecursively = jasmine.createSpy().andCallFake(function (callback) {
                    callback();
                }),
                success = jasmine.createSpy();

            _fs.root.getDirectory = function (path, options, success, error) {
                success(_resultEntries[0]);
            };

            spyOn(_fs.root, "getDirectory").andCallThrough();

            _resultEntries = [
                {fullPath: "/foo", isDirectory: true, removeRecursively: removeRecursively}
            ];

            fs.rm("/foo", success, error, {recursive: true});

            expect(_fs.root.getDirectory.argsForCall[0][0]).toEqual("/foo");
            expect(_fs.root.getDirectory.argsForCall[0][1]).toEqual({create: false});
            expect(typeof _fs.root.getDirectory.argsForCall[0][2]).toEqual("function");
            expect(_fs.root.getDirectory.argsForCall[0][3]).toEqual(error);
            expect(success).toHaveBeenCalled();
            expect(typeof removeRecursively.argsForCall[0][0]).toEqual("function");
            expect(removeRecursively.argsForCall[0][1]).toEqual(error);
            expect(error).not.toHaveBeenCalled();
        });
    });

    describe("rmdir", function () {
        it("removes a directory", function () {
            var error = jasmine.createSpy(),
                remove = jasmine.createSpy().andCallFake(function (callback) {
                    callback();
                }),
                success = jasmine.createSpy();

            _fs.root.getDirectory = function (path, options, success, error) {
                success(_resultEntries[0]);
            };

            spyOn(_fs.root, "getDirectory").andCallThrough();

            _resultEntries = [
                {fullPath: "/foo", isDirectory: true, remove: remove}
            ];

            fs.rmdir("/foo", success, error);

            expect(_fs.root.getDirectory.argsForCall[0][0]).toEqual("/foo");
            expect(_fs.root.getDirectory.argsForCall[0][1]).toEqual({create: false});
            expect(typeof _fs.root.getDirectory.argsForCall[0][2]).toEqual("function");
            expect(_fs.root.getDirectory.argsForCall[0][3]).toEqual(error);
            expect(success).toHaveBeenCalled();
            expect(typeof remove.argsForCall[0][0]).toEqual("function");
            expect(remove.argsForCall[0][1]).toEqual(error);
            expect(error).not.toHaveBeenCalled();
        });
    });

    describe("stat", function () {
        it("retrieves the status of a file", function () {
            var entry = {
                    fullPath: "/bob",
                    isDirectory: false
                },
                domain = "http://dude.com",
                error = jasmine.createSpy(),
                success = jasmine.createSpy();

            spyOn(window, "resolveLocalFileSystemURL").andCallFake(function (url, success, error) {
                success(entry);
            });

            spyOn(utils, "location").andReturn({origin: domain});

            fs.stat("/bob", success, error);

            expect(window.resolveLocalFileSystemURL.argsForCall[0][0])
                .toEqual("filesystem:" + domain + "/temporary//bob");
            expect(typeof window.resolveLocalFileSystemURL.argsForCall[0][1]).toEqual("function");
            expect(window.resolveLocalFileSystemURL.argsForCall[0][2]).toEqual(error);
            expect(success).toHaveBeenCalledWith(entry);
        });
    });

    describe("mv", function () {
        it("can move a file from one location to another", function () {
            var movedEntry = {
                    fullPath: "/bar",
                    isDirectory: false
                },
                fromEntry = {
                    fullPath: "/foo",
                    isDirectory: false,
                    moveTo: jasmine.createSpy().andCallFake(function (dest, fileName, callback) {
                        callback(movedEntry);
                    })
                },
                rootEntry = {
                    fullPath: "/",
                    isDirectory: true
                },
                error = jasmine.createSpy(),
                success = jasmine.createSpy(),
                from = "/foo",
                to = "/bar";

            spyOn(fs, "stat").andCallFake(function (path, success, error) {
                success(path.match(/^\/$/) ? rootEntry : fromEntry);
            });

            fs.mv(from, to, success, error);

            expect(fromEntry.moveTo.argsForCall[0][0]).toEqual(rootEntry);
            expect(fromEntry.moveTo.argsForCall[0][1]).toEqual("bar");
            expect(fromEntry.moveTo.argsForCall[0][3]).toEqual(error);
            expect(fs.stat.argsForCall[0][2]).toEqual(error);
            expect(fs.stat.argsForCall[1][2]).toEqual(error);
            expect(success).toHaveBeenCalledWith(movedEntry);
        });
    });

    describe("cp", function () {
        it("can copy a file from one location to another", function () {
            var copiedEntry = {
                    fullPath: "/bar",
                    isDirectory: false
                },
                fromEntry = {
                    fullPath: "/foo",
                    isDirectory: false,
                    copyTo: jasmine.createSpy().andCallFake(function (dest, fileName, callback) {
                        callback(copiedEntry);
                    })
                },
                rootEntry = {
                    fullPath: "/",
                    isDirectory: true
                },
                error = jasmine.createSpy(),
                success = jasmine.createSpy(),
                from = "/foo",
                to = "/bar";

            spyOn(fs, "stat").andCallFake(function (path, success, error) {
                success(path.match(/^\/$/) ? rootEntry : fromEntry);
            });

            fs.cp(from, to, success, error);

            expect(fromEntry.copyTo.argsForCall[0][0]).toEqual(rootEntry);
            expect(fromEntry.copyTo.argsForCall[0][1]).toEqual("bar");
            expect(fromEntry.copyTo.argsForCall[0][3]).toEqual(error);
            expect(fs.stat.argsForCall[0][2]).toEqual(error);
            expect(fs.stat.argsForCall[1][2]).toEqual(error);
            expect(success).toHaveBeenCalledWith(copiedEntry);
        });
    });

    describe("write", function () {
        it("overwrites an existing file by default", function () {
            var path = "some/path",
                contents = "file data",
                error = jasmine.createSpy(),
                success = jasmine.createSpy(),
                fileWriterInstance = {
                    onwriteend: null,
                    onerror: null,
                    write: jasmine.createSpy()
                },
                progressEvent = {
                    target: fileWriterInstance
                },
                fileEntry = {
                    fullPath: "some/path",
                    isDirectory: false,
                    createWriter: jasmine.createSpy().andCallFake(function (callback) {
                        callback(fileWriterInstance);
                    })
                },
                txt = "plain text blob",
                blobInstance = {
                    append: jasmine.createSpy(),
                    getBlob: jasmine.createSpy().andReturn(txt)
                };

            spyOn(fs, "stat").andCallFake(function (path, success, error) {
                success(fileEntry);
            });

            spyOn(fs, "touch").andCallFake(function (path, success, error) {
                success(fileEntry);
            });

            spyOn(fs, "rm").andCallFake(function (path, success, error) {
                success();
            });

            spyOn(window, "BlobBuilder").andReturn(blobInstance);

            fs.write(path, contents, success, error);

            fileWriterInstance.onwriteend(progressEvent);

            expect(fs.rm.callCount).toBe(1);
            expect(fs.rm.argsForCall[0][2]).toEqual(error);
            expect(fs.touch.callCount).toBe(1);
            expect(fs.touch.argsForCall[0][0]).toEqual(path);
            expect(fs.touch.argsForCall[0][2]).toEqual(error);

            expect(success).toHaveBeenCalledWith(fileEntry);
            expect(fileWriterInstance.onerror).toBe(error);
            expect(fileEntry.createWriter.callCount).toBe(1);
            expect(fileEntry.createWriter.argsForCall[0][1]).toBe(error);
            expect(blobInstance.append).toHaveBeenCalledWith(contents);
            expect(fileWriterInstance.write).toHaveBeenCalledWith(txt);
        });

        it("creates the file if it does not exist", function () {
            var path = "some/path",
                contents = "file data",
                error = jasmine.createSpy(),
                success = jasmine.createSpy(),
                txt = "plain text blob",
                blobInstance = {
                    append: jasmine.createSpy(),
                    getBlob: jasmine.createSpy().andReturn(txt)
                };

            spyOn(fs, "stat").andCallFake(function (path, success, error) {
                error({code: 1});
            });

            spyOn(fs, "touch");
            spyOn(fs, "rm");
            spyOn(window, "BlobBuilder").andReturn(blobInstance);

            fs.write(path, contents, success, error);

            expect(fs.touch.callCount).toBe(1);
            expect(fs.touch.argsForCall[0][0]).toEqual(path);
            expect(fs.touch.argsForCall[0][2]).toEqual(error);
        });

        it("invokes error when file does exit", function () {
            var path = "some/path",
                contents = "file data",
                error = jasmine.createSpy(),
                success = jasmine.createSpy(),
                txt = "plain text blob",
                blobInstance = {
                    append: jasmine.createSpy(),
                    getBlob: jasmine.createSpy().andReturn(txt)
                };

            spyOn(fs, "stat").andCallFake(function (path, success, error) {
                error({code: 2});
            });

            spyOn(fs, "touch");
            spyOn(fs, "rm");
            spyOn(window, "BlobBuilder").andReturn(blobInstance);

            fs.write(path, contents, success, error);

            expect(fs.touch).not.toHaveBeenCalled();
        });

        describe("when options.append", function () {
            it("appends to an existing file", function () {
                var path = "some/path",
                    contents = "file data",
                    error = jasmine.createSpy(),
                    success = jasmine.createSpy(),
                    options = {
                        mode: "append"
                    },
                    fileWriterInstance = {
                        onwriteend: null,
                        onerror: null,
                        length: 5,
                        write: jasmine.createSpy(),
                        seek: jasmine.createSpy()
                    },
                    fileEntry = {
                        fullPath: "some/path",
                        isDirectory: false,
                        createWriter: jasmine.createSpy().andCallFake(function (callback) {
                            callback(fileWriterInstance);
                        })
                    },
                    txt = "plain text blob",
                    blobInstance = {
                        append: jasmine.createSpy(),
                        getBlob: jasmine.createSpy().andReturn(txt)
                    };

                spyOn(fs, "stat").andCallFake(function (path, success, error) {
                    success(fileEntry);
                });

                spyOn(fs, "touch").andCallFake(function (path, success, error) {
                    success(fileEntry);
                });

                spyOn(fs, "rm").andCallFake(function (path, success, error) {
                    success();
                });

                spyOn(window, "BlobBuilder").andReturn(blobInstance);

                fs.write(path, contents, success, error, options);

                expect(fileWriterInstance.seek).toHaveBeenCalledWith(fileWriterInstance.length);
            });
        });
    });

    describe("read", function () {
        it("returns contents of a file", function () {
            var path = "a/file",
                error = jasmine.createSpy(),
                success = jasmine.createSpy(),
                fileInstance = jasmine.createSpy(),
                fileReaderInstance = {
                    onloadend: null,
                    result: "file data",
                    readAsText: jasmine.createSpy()
                },
                progressEvent = {
                    target: fileReaderInstance
                },
                fileEntry = {
                    fullPath: "a/file",
                    isDirectory: false,
                    file: jasmine.createSpy().andCallFake(function (callback) {
                        callback(fileInstance);
                    })
                };

            spyOn(fs, "stat").andCallFake(function (path, success, error) {
                success(fileEntry);
            });

            spyOn(global, "FileReader").andReturn(fileReaderInstance);

            fs.read(path, success, error);

            fileReaderInstance.onloadend(progressEvent);

            expect(fileReaderInstance.readAsText).toHaveBeenCalledWith(fileInstance);
            expect(success).toHaveBeenCalledWith(fileReaderInstance.result);
            expect(fileReaderInstance.onerror).toBe(error);
            expect(fileEntry.file.argsForCall[0][1]).toBe(error);
            expect(fs.stat.argsForCall[0][2]).toBe(error);
        });
    });
});
