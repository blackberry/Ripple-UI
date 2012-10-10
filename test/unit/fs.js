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
describe("fs", function () {
    var fs = require('ripple/fs'),
        event = require('ripple/event'),
        utils = require('ripple/utils'),
        _resultEntries,
        _dirEntry,
        _baton,
        _fs,
        _oldLocation,
        _resolveLocalFileSystemURLSpy,
        _requestFileSystemSpy,
        _domain = "http://127.0.0.1:3000";

    beforeEach(function () {
        _baton = {
            take: jasmine.createSpy("baton.take"),
            pass: jasmine.createSpy("baton.pass")
        };

        _dirEntry = {
            createReader: function () {
                return {
                    readEntries: function (success) {
                        success(_resultEntries);
                    }
                };
            }
        };

        _fs = {
            root: {
                getDirectory: function (path, options, success) {
                    success(_dirEntry);
                }
            }
        };

        window.TEMPORARY = 0;
        window.PERSISTENT = 1;
        _requestFileSystemSpy = jasmine.createSpy("requestFileSystem");
        window.webkitRequestFileSystem = window.requestFileSystem = _requestFileSystemSpy.andCallFake(function (persistenceMethod, fsSize, success) {
            success(_fs);
        });

        _resolveLocalFileSystemURLSpy = jasmine.createSpy("resolveLocalFileSystemURL");
        window.webkitResolveLocalFileSystemURL = window.resolveLocalFileSystemURL = _resolveLocalFileSystemURLSpy;

        window.WebKitBlobBuilder = window.BlobBuilder = function () {};
        window.Blob = global.Blob = function () {};
        window.FileReader = global.FileReader = function () {};
        window.FileError = global.FileError = {NOT_FOUND_ERR: 1};

        spyOn(event, "trigger");

        _oldLocation = utils.location;
        utils.location = function () {
            return {
                origin: _domain
            };
        };

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
        utils.location = _oldLocation;
    });

    describe("initialize", function () {
        it("uses requestFileSystem", function () {
            expect(window.requestFileSystem.argsForCall[0][0]).toEqual(window.TEMPORARY);
            expect(window.requestFileSystem.argsForCall[0][1]).toEqual(10 * 1024 * 1024);
        });

        it("takes and passes the baton", function () {
            expect(_baton.take).toHaveBeenCalled();
            expect(_baton.pass).toHaveBeenCalled();
        });

        it("triggers FileSystemInitialized", function () {
            expect(event.trigger).toHaveBeenCalledWith("FileSystemInitialized", null, true);
        });

        it("uses webkitRequestFileSystem when requestFileSystem is not present", function () {
            delete window.requestFileSystem;
            fs.initialize(null, _baton);

            expect(window.webkitRequestFileSystem.argsForCall[0][0]).toEqual(window.TEMPORARY);
            expect(window.webkitRequestFileSystem.argsForCall[0][1]).toEqual(10 * 1024 * 1024);
        });
    });

    describe("mkdir", function () {
        var success,
            error;

        beforeEach(function () {
            success = jasmine.createSpy();
            error = jasmine.createSpy();

            spyOn(fs, 'mkdir').andCallThrough();
            spyOn(fs, 'stat');
        });

        it("creates a directory off of root", function () {
            _resultEntries = [
                {fullPath: "whatev", isDirectory: true}
            ];

            _fs.root.getDirectory = function (path, options, succ) {
                succ(_resultEntries[0]);
            };

            spyOn(_fs.root, "getDirectory").andCallThrough();

            fs.mkdir("whatev", success, error);

            expect(_fs.root.getDirectory.argsForCall[0][0]).toEqual("whatev");
            expect(_fs.root.getDirectory.argsForCall[0][1]).toEqual({create: true});
            expect(typeof _fs.root.getDirectory.argsForCall[0][2]).toEqual("function");
            expect(_fs.root.getDirectory.argsForCall[0][3]).toEqual(error);
            expect(success).toHaveBeenCalledWith(_resultEntries[0]);
            expect(error).not.toHaveBeenCalled();
        });

        it("recursively creates nested directories off of root", function () {
            var dirpath = "nested/directory/path";

            spyOn(_fs.root, "getDirectory").andCallFake(function (path, opts, succ) {
                succ();
            });

            fs.mkdir(dirpath, success, error, {recursive: true});

            expect(fs.mkdir.callCount).toBe(4);

            expect(fs.mkdir.argsForCall[1][0]).toBe("nested");
            expect(fs.mkdir.argsForCall[2][0]).toBe("nested/directory");
            expect(fs.mkdir.argsForCall[3][0]).toBe("nested/directory/path");

            expect(fs.mkdir.argsForCall[1][2]).toBe(error);

            expect(fs.stat).toHaveBeenCalledWith(dirpath, success, error, {});
        });
    });

    describe("touch", function () {
        it("creates a file off of root", function () {
            var error = jasmine.createSpy(),
                success = jasmine.createSpy();

            _fs.root.getFile = function (path, options, success) {
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

            _fs.root.getFile = function (path, options, success) {
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

            _fs.root.getDirectory = function (path, options, success) {
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

            _fs.root.getDirectory = function (path, options, success) {
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
                error = jasmine.createSpy(),
                success = jasmine.createSpy();

            _resolveLocalFileSystemURLSpy.andCallFake(function (url, success) {
                success(entry);
            });

            fs.stat("/bob", success, error);

            expect(_resolveLocalFileSystemURLSpy.argsForCall[0][0])
                .toEqual("filesystem:" + _domain + "/temporary//bob");
            expect(typeof _resolveLocalFileSystemURLSpy.argsForCall[0][1]).toEqual("function");
            expect(_resolveLocalFileSystemURLSpy.argsForCall[0][2]).toEqual(error);
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

            spyOn(fs, "stat").andCallFake(function (path, success) {
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

            spyOn(fs, "stat").andCallFake(function (path, success) {
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
        var path,
            contents,
            error,
            success,
            fileWriterInstance,
            progressEvent,
            fileEntry;

        beforeEach(function () {
            spyOn(fs, "touch");
            spyOn(fs, "rm");
            spyOn(fs, "stat");

            path = "some/path";
            contents = "file data";

            error = jasmine.createSpy();
            success = jasmine.createSpy();

            progressEvent = {target: fileWriterInstance};

            fileWriterInstance = {
                onwriteend: null,
                onerror: null,
                length: null,
                write: jasmine.createSpy(),
                seek: jasmine.createSpy()
            };

            fileEntry = {
                fullPath: "some/path",
                isDirectory: false,
                createWriter: jasmine.createSpy().andCallFake(function (callback) {
                    callback(fileWriterInstance);
                })
            };
        });

        it("overwrites an existing file by default", function () {
            fs.stat.andCallFake(function (path, success) { success(fileEntry); });
            fs.touch.andCallFake(function (path, success) { success(fileEntry); });
            fs.rm.andCallFake(function (path, success) { success(); });

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
        });

        it("creates the file if it does not exist", function () {
            fs.stat.andCallFake(function (path, success, error) { error({code: 1}); });

            fs.write(path, contents, success, error);

            expect(fs.touch.callCount).toBe(1);
            expect(fs.touch.argsForCall[0][0]).toEqual(path);
            expect(fs.touch.argsForCall[0][2]).toEqual(error);
        });

        it("invokes error when file does exit", function () {
            fs.stat.andCallFake(function (path, success, error) { error({code: 2}); });
            fs.write(path, contents, success, error);
            expect(fs.touch).not.toHaveBeenCalled();
        });

        it("supports writing a DOMString to the file", function () {
            var blobInstance,
                callCount = 0,
                oldBlob = global.Blob;

            global.Blob = function (blobParts, opts) {
                this.type = opts.type || 'default';
                this.size = blobParts.length; // BS size
                blobInstance = this;
                blobInstance.__blobParts = blobParts;
                callCount++;
            };

            fs.stat.andCallFake(function (path, success) { success(fileEntry); });
            fs.touch.andCallFake(function (path, success) { success(fileEntry); });
            fs.rm.andCallFake(function (path, success) { success(); });

            fs.write(path, contents, success, error);

            fileWriterInstance.onwriteend(progressEvent);

            expect(callCount).toBe(1);
            expect(blobInstance.__blobParts).toEqual([contents]);
            expect(fileWriterInstance.write).toHaveBeenCalledWith(blobInstance);

            global.Blob = oldBlob;
        });

        it("supports force writing a DOMString as a specific type", function () {
            var blobInstance,
                oldBlob = global.Blob;

            global.Blob = function (blobParts, opts) {
                this.type = opts.type || 'default';
                this.size = blobParts.length; // BS size
                blobInstance = this;
            };

            fs.stat.andCallFake(function (path, success) { success(fileEntry); });
            fs.touch.andCallFake(function (path, success) { success(fileEntry); });
            fs.rm.andCallFake(function (path, success) { success(); });

            fs.write(path, contents, success, error, {type: 'custom/type'});

            fileWriterInstance.onwriteend(progressEvent);

            expect(blobInstance.type).toBe('custom/type');

            global.Blob = oldBlob;
        });

        it("supports writing a Blob to the file", function () {
            var callCount = 0,
                oldBlob = global.Blob,
                blobInstanceToSave;

            global.Blob = function (blobParts, opts) {
                this.type = opts.type || 'default';
                this.size = blobParts.length; // BS size
                callCount++;
            };

            blobInstanceToSave = new Blob([contents], {type: "some/type"});

            fs.stat.andCallFake(function (path, success) { success(fileEntry); });
            fs.touch.andCallFake(function (path, success) { success(fileEntry); });
            fs.rm.andCallFake(function (path, success) { success(); });

            fs.write(path, blobInstanceToSave, success, error);

            fileWriterInstance.onwriteend(progressEvent);

            expect(callCount).toBe(1);
            expect(fileWriterInstance.write).toHaveBeenCalledWith(blobInstanceToSave);

            global.Blob = oldBlob;
        });

        describe("when options.append", function () {
            it("appends to an existing file", function () {
                var options = {
                        mode: "append"
                    };

                fileWriterInstance.length = 5;

                fs.stat.andCallFake(function (path, success) { success(fileEntry); });
                fs.touch.andCallFake(function (path, success) { success(fileEntry); });
                fs.rm.andCallFake(function (path, success) { success(); });

                fs.write(path, contents, success, error, options);

                expect(fileWriterInstance.seek).toHaveBeenCalledWith(fileWriterInstance.length);
            });
        });
    });

    // TODO: write tests for reading as File by default (and reading as type: text)
    describe("read", function () {
        var path,
            error,
            success,
            options,
            fileInstance,
            fileReaderInstance,
            blobInstance,
            fileEntry;

        beforeEach(function () {
            path = "a/file";
            options = {};
            blobInstance = {};

            error = jasmine.createSpy("error callback");
            success = jasmine.createSpy("success callback");
            fileInstance = jasmine.createSpy("File").andReturn({type: "content/type"});

            fileReaderInstance = {
                onloadend: null,
                result: "file data",
                readAsText: jasmine.createSpy("FileReader.readAsText")
            };

            fileEntry = {
                fullPath: path,
                isDirectory: false,
                file: jasmine.createSpy("FileEntry.file").andCallFake(function (callback) {
                    callback(fileInstance);
                })
            };

            spyOn(fs, "stat").andCallFake(function (path, success) {
                success(fileEntry);
            });

            spyOn(global, "FileReader").andReturn(fileReaderInstance);
        });

        it("returns the contents of a file as a blob", function () {
            var progressEventInstance = {target: fileReaderInstance};

            options = {type: "text"};

            fs.read(path, success, error, options);

            fileReaderInstance.onloadend(progressEventInstance);

            expect(fileReaderInstance.readAsText).toHaveBeenCalledWith(fileInstance);
            expect(success).toHaveBeenCalledWith(fileReaderInstance.result);
        });

        it("returns contents of a file as text", function () {
            spyOn(global, "Blob").andReturn(blobInstance);

            fs.read(path, success, error, options);

            expect(Blob).toHaveBeenCalledWith([fileInstance], {type: fileInstance.type});
            expect(success).toHaveBeenCalledWith(blobInstance);
        });

        it("invokes error callbacks appropriately", function () {
            fs.read(path, success, error, options);

            expect(fileReaderInstance.onerror).toBe(error);
            expect(fileEntry.file.argsForCall[0][1]).toBe(error);
            expect(fs.stat.argsForCall[0][2]).toBe(error);
        });
    });
});
