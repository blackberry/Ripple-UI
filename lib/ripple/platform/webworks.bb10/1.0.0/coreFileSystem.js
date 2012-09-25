/*
 *  Copyright 2012 Research In Motion Limited.
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
/*jshint proto:true*/
var _self,
    utils = require('ripple/utils'),
    _appInfo = require('ripple/app').getInfo(),
    _io = require('ripple/platform/webworks.bb10/1.0.0/io'),
    _appId = _appInfo.id,
    _accessShared,
    _paths = {
        sandboxed: "/rippleFileSystem/" + _appId + "/sandbox",
        unSandboxed: "/rippleFileSystem/" + _appId + "/unsandboxed"
    };

_accessShared = _appInfo.permissions && _appInfo.permissions.some(function (value) {
    return value === "access_shared";
});

function _map(array, callback) {
    var map = [], i;
    for (i = 0; i < array.length; i++) {
        map[i] = callback(array[i], i);
    }
    return map;
}

function _hasAccessToPath(path, entry) {
    path = path.match(/^\//) ? path : entry.fullPath;

    return !(!_accessShared && path.match(_io.sharedFolder));
}

function _massagePath(path, direction, sandboxed, isRoot) {
    var prefix;

    if (direction === "outgoing") {
        utils.forEach(_paths, function (item) {
            path = path.replace(new RegExp(item), "");
        });
        path = path === "" ? "/" : path;
    }
    else if (direction === "incoming" && (path.match(/^\//) || isRoot)) {
        prefix = sandboxed ? _paths.sandboxed : _paths.unSandboxed;
        path = prefix + "/" + path.replace(/^\//, "");
    }

    return path;
}

function _createReader(de, fs, sandboxed) {
    var readEntriesSuccess;

    function internalSuccess(entries) {
        var myEntries = _map(entries, function (entry) {
            if (entry.isDirectory) {
                return _self.createDirectoryEntry(entry, fs, sandboxed);
            }
            else {
                return _self.createFileEntry(entry, fs, sandboxed);
            }

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

function _getDirectory(directoryEntry, fs, sandboxed, path, options, dirSuccess, fail) {
    var isRoot = directoryEntry.fullPath === "/";

    if (!_hasAccessToPath(path, directoryEntry)) {
        fail(FileError.NOT_FOUND_ERR);
        return;
    }

    function internalDirSuccess(de) {
        dirSuccess(_self.createDirectoryEntry(de, fs, sandboxed));
    }
    path = _massagePath(path, "incoming", sandboxed, isRoot);
    directoryEntry.getDirectory(path, options, internalDirSuccess, fail);
}

function _getFile(directoryEntry, fs, sandboxed, path, options, fileSuccess, fail) {
    var isRoot = directoryEntry.fullPath === "/";

    if (!_hasAccessToPath(path, directoryEntry)) {
        fail(FileError.NOT_FOUND_ERR);
        return;
    }

    function internalFileSuccess(fe) {
        fileSuccess(_self.createFileEntry(fe, fs, sandboxed));
    }
    path = _massagePath(path, "incoming", sandboxed, isRoot);
    directoryEntry.getFile(path, options, internalFileSuccess, fail);
}

_self = {
    createDirectoryEntry: function (de, fs, sandboxed) {
        var isRoot = de.fullPath === "/",
            myDE;

        myDE = {
            fullPath: _massagePath(de.fullPath, "outgoing", sandboxed, isRoot),
            isDirectory: de.isDirectory,
            isFile: de.isFile,
            name: de.name,
            filesystem: fs,
            createReader: function () {
                return _createReader(de, fs, sandboxed);
            },
            getDirectory: function (path, options, dirSuccess, fail) {
                _getDirectory(de, fs, sandboxed, path, options, dirSuccess, fail);
            },
            getFile: function (path, options, dirSuccess, fail) {
                _getFile(de, fs, sandboxed, path, options, dirSuccess, fail);
            },
            removeRecursively: de.removeRecursively.bind(de),
            copyTo: function (directoryEntry, name, success, fail) {
                function internalSuccess(de) {
                    success(_self.createDirectoryEntry(de, fs));
                }
                de.copyTo(directoryEntry.prototype, name, internalSuccess, fail);
            },
            getMetadata: de.getMetadata.bind(de),
            getParent: de.getParent.bind(de),
            moveTo: function (directoryEntry, name, success, fail) {
                function internalSuccess(de) {
                    success(_self.createDirectoryEntry(de, fs));
                }
                de.moveTo(directoryEntry.prototype, fs, name, internalSuccess, fail);
            },
            remove: de.remove.bind(de),
            toURL: de.toURL.bind(de)
        };

        myDE.__proto__ = de;

        return myDE;
    },

    createFileEntry: function (fe, fs, sandboxed) {
        var myFE = {
                fullPath: _massagePath(fe.fullPath, "outgoing", sandboxed),
                isDirectory: fe.isDirectory,
                isFile: fe.isFile,
                name: fe.name,
                filesystem: fs,
                createWriter: fe.createWriter.bind(fe),
                file: fe.file.bind(fe),
                copyTo: function (directoryEntry, name, success, fail) {
                    function internalSuccess(fe) {
                        success(_self.createFileEntry(fe, fs, sandboxed));
                    }
                    fe.copyTo(directoryEntry.prototype, fs, name, internalSuccess, fail);
                },
                getMetadata: fe.getMetadata.bind(fe),
                getParent: fe.getParent.bind(fe),
                moveTo: function (directoryEntry, name, success, fail) {
                    function internalSuccess(fe) {
                        success(_self.createFileEntry(fe, fs, sandboxed));
                    }
                    fe.moveTo(directoryEntry.prototype, fs, name, internalSuccess, fail);
                },
                remove: fe.remove.bind(fe),
                toURL: fe.toURL.bind(fe)
            };

        myFE.__proto__ = fe;

        return myFE;
    }

};

module.exports = _self;
