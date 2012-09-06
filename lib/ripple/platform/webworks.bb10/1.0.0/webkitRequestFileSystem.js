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

// NOTE: the code below is the equivalent to taking 12 angry cats,
// throwing them into a big sack and shaking it to make them even angrier.
// if you reach into this code, expect to be slightly mutilated.
// I recommend having a good bottle of Canadian Rye on hand... just in case

var _orig = window.webkitRequestFileSystem,
    utils = require('ripple/utils'),
    fs = require('ripple/fs'),
    _console = require('ripple/console'),
    _appInfo = require('ripple/app').getInfo(),
    _io = require('ripple/platform/webworks.bb10/1.0.0/io'),
    _appId = _appInfo.id,
    _accessShared,
    _sandboxedDirectoryEntry,
    _unSandboxedDirectoryEntry,
    _paths = {
        sandboxed: "/rippleFileSystem/" + _appId + "/sandbox",
        unSandboxed: "/rippleFileSystem/" + _appId + "/unsandboxed"
    };

function fsInitError(e) {
    _console.error("Something went wrong initializing the WebWorks HTML5 FileSystem!");
    _console.error(e);
}

jWorkflow
    .order(function (prev, baton) {
        baton.take();
        fs.mkdir(_paths.sandboxed, function (dirEntry) {
            _sandboxedDirectoryEntry = dirEntry;
            baton.pass();
        }, fsInitError.bind(), {recursive: true});
    })
    .andThen(function (prev, baton) {
        baton.take();
        fs.mkdir(_paths.unSandboxed, function (dirEntry) {
            _unSandboxedDirectoryEntry = dirEntry;
            baton.pass();
        }, fsInitError.bind(null), {recursive: true});
    })
    .andThen(function (prev, baton) {
        baton.take();
        fs.mkdir(_paths.unSandboxed + _io.SDCard, function () {
            baton.pass();
        }, fsInitError.bind(null), {recursive: true});
    })
    .andThen(function (prev, baton) {
        baton.take();
        fs.mkdir(_paths.unSandboxed + _io.home, function () {
            baton.pass();
        }, fsInitError.bind(null), {recursive: true});
    })
    .andThen(function (prev, baton) {
        baton.take();
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder, function () {
            baton.pass();
        }, fsInitError.bind(), {recursive: true});
    })
    .andThen(function () {
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Books", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Documents", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Downloads", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Misc", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Music", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Photos", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Print", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Videos", function () {}, fsInitError.bind());
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Voice", function () {}, fsInitError.bind());
    })
    .start();

_accessShared = _appInfo.permissions && _appInfo.permissions.some(function (value) {
    return value === "access_shared";
});

function _massagePath(path, direction, _sandboxed) {
    var prefix;

    if (direction === "outgoing") {
        utils.forEach(_paths, function (item) {
            path = path.replace(new RegExp(item), "");
        });
    }
    else if (direction === "incoming" && path.match(/^\//)) {
        prefix = _sandboxed ? _paths.sandboxed : _paths.unSandboxed;
        path = prefix + "/" + path.replace(/^\//, "");
    }

    return path;
}

function _hasAccessToPath(path, entry) {
    path = path.match(/^\//) ? path : entry.fullPath;

    return !(!_accessShared && path.match(_io.sharedFolder));
}


module.exports = function (type, size, success, fail) {
    var _internalFS = {},
        _sandboxed = _io.sandbox;


    function createFileEntry(fe) {
        var myFE = {
                fullPath: _massagePath(fe.fullPath, "outgoing", _sandboxed),
                isDirectory: fe.isDirectory,
                isFile: fe.isFile,
                name: fe.name,
                filesystem: _internalFS,
                createWriter: fe.createWriter.bind(fe),
                file: fe.file.bind(fe),
                copyTo: function (directoryEntry, name, success, fail) {
                    function internalSuccess(fe) {
                        success(createFileEntry(fe));
                    }
                    fe.copyTo(directoryEntry.prototype, name, internalSuccess, fail);
                },
                getMetadata: fe.getMetadata.bind(fe),
                getParent: fe.getParent.bind(fe),
                moveTo: function (directoryEntry, name, success, fail) {
                    function internalSuccess(fe) {
                        success(createFileEntry(fe));
                    }
                    fe.moveTo(directoryEntry.prototype, name, internalSuccess, fail);
                },
                remove: fe.remove.bind(fe),
                toURL: fe.toURL.bind(fe)
            };

        myFE.prototype = fe;

        return myFE;
    }

    function createDirectoryEntry(de) {
        var myDE = {
                fullPath: _massagePath(de.fullPath, "outgoing", _sandboxed),
                isDirectory: de.isDirectory,
                isFile: de.isFile,
                name: de.name,
                filesystem: _internalFS,
                createReader: function () {
                    createReader(de);
                },
                getDirectory: function (path, options, dirSuccess, fail) {
                    getDirectory(de, path, options, dirSuccess, fail);
                },
                getFile: function (path, options, dirSuccess, fail) {
                    getFile(de, path, options, dirSuccess, fail);
                },
                removeRecursively: de.removeRecursively.bind(de),
                copyTo: function (directoryEntry, name, success, fail) {
                    function internalSuccess(de) {
                        success(createDirectoryEntry(de));
                    }
                    de.copyTo(directoryEntry.prototype, name, internalSuccess, fail);
                },
                getMetadata: de.getMetadata.bind(de),
                getParent: de.getParent.bind(de),
                moveTo: function (directoryEntry, name, success, fail) {
                    function internalSuccess(de) {
                        success(createDirectoryEntry(de));
                    }
                    de.moveTo(directoryEntry.prototype, name, internalSuccess, fail);
                },
                remove: de.remove.bind(de),
                toURL: de.toURL.bind(de)
            };

        myDE.prototype = de;

        return myDE;
    }

    function createReader(de) {
        var readEntriesSuccess;

        function internalSuccess(entries) {
            var myEntries = entries.map(function (entry) {
                return createDirectoryEntry(entry);
            });

            readEntriesSuccess(myEntries);
        }

        return {
            readEntries: function (success, fail) {
                readEntriesSuccess = success;
                de.createReader().readEntries(internalSuccess, fail);
            }
        };
    }

    function getDirectory(directoryEntry, path, options, dirSuccess, fail) {
        if (!_hasAccessToPath(path, directoryEntry)) {
            fail(FileError.NOT_FOUND_ERR);
            return;
        }

        function internalDirSuccess(de) {
            dirSuccess(createDirectoryEntry(de));
        }
        path = _massagePath(path, "incoming", _sandboxed);
        directoryEntry.getDirectory(path, options, internalDirSuccess, fail);
    }

    function getFile(directoryEntry, path, options, fileSuccess, fail) {
        if (!_hasAccessToPath(path, directoryEntry)) {
            fail(FileError.NOT_FOUND_ERR);
            return;
        }

        function internalFileSuccess(fe) {
            fileSuccess(createFileEntry(fe));
        }
        path = _massagePath(path, "incoming", _sandboxed);
        directoryEntry.getFile(path, options, internalFileSuccess, fail);
    }

    function _internalSuccess(fileSystem) {
        _internalFS.name = fileSystem.name;
        _internalFS.root = createDirectoryEntry(fileSystem.root);
        _internalFS.root.prototype = _sandboxed ? _sandboxedDirectoryEntry : _unSandboxedDirectoryEntry;

        success(_internalFS);
    }

    _orig(type, size, _internalSuccess, fail);
};
