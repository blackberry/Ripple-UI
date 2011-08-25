var fileSystem = require('ripple/fileSystem');

describe("fileSystem", function () {
    var _resultEntries,
        _dirEntry,
        _fs;

    beforeEach(function () {
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
                getDirectory: function (path, options, callback) {
                    callback(_dirEntry);
                }
            }
        };

        window.TEMPORARY = 0;
        window.PERSISTENT = 1;
        window.webkitRequestFileSystem = window.requestFileSystem = function (persistenceMethod, fsSize, success, failure) {
            success(_fs);
        };

        fileSystem.initialize();
    });

    afterEach(function () {
        delete window.TEMPORARY;
        delete window.PERSISTENT;
        delete window.requestFileSystem;
        delete window.webkitRequestFileSystem;
    });

    describe("initialize", function () {
        it("uses requestFileSystem", function () {
            spyOn(window, "requestFileSystem");
            fileSystem.initialize();

            expect(window.requestFileSystem.argsForCall[0][0]).toEqual(window.TEMPORARY);
            expect(window.requestFileSystem.argsForCall[0][1]).toEqual(10 * 1024 * 1024);
        });

        it("uses webkitRequestFileSystem when requestFileSystem is not present", function () {
            delete window.requestFileSystem;
            spyOn(window, "webkitRequestFileSystem");
            fileSystem.initialize();

            expect(window.webkitRequestFileSystem.argsForCall[0][0]).toEqual(window.TEMPORARY);
            expect(window.webkitRequestFileSystem.argsForCall[0][1]).toEqual(10 * 1024 * 1024);
        });
    });

    describe("mkdir", function () {
        it("creates a directory off of root", function () {
            var error = jasmine.createSpy(),
                success = jasmine.createSpy();

            _fs.root.getDirectory = function (path, options, callback) {
                callback(_resultEntries[0]);
            };

            spyOn(_fs.root, "getDirectory").andCallThrough();

            _resultEntries = [
                {name: "whatev", isDirectory: true}
            ];

            fileSystem.mkdir("whatev", success, error);

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

            _fs.root.getFile = function (path, options, callback) {
                callback(_resultEntries[0]);
            };

            spyOn(_fs.root, "getFile").andCallThrough();

            _resultEntries = [
                {name: "er", isDirectory: false}
            ];

            fileSystem.touch("er", success, error);

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
            fileSystem.ls(null);
            expect(_fs.root.getDirectory.argsForCall[0][0]).toEqual("/");
        });

        it("returns a list of items in the root", function () {
            var error = jasmine.createSpy();

            _resultEntries = [
                {name: "dude", isDirectory: true},
                {name: "sweet.js", isDirectory: false}
            ];

            fileSystem.ls("/", function (entries) {
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

            fileSystem.ls("/foo", success, function (error) {
                expect(error).toEqual(FileError);
            });

            expect(success).not.toHaveBeenCalled();
        });

        // it does not return empty array when found values
    });
});
