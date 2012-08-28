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
var utils = require('ripple/utils'),
    constants = require('ripple/constants'),
    event = require('ripple/event'),
    _console = require('ripple/console'),
    _self, _fs;

function _map(array, callback) {
    var map = [], i;
    for (i = 0; i < array.length; i++) {
        map[i] = callback(array[i], i);
    }
    return map;
}

function _resolveLocalFileSystemURL(path, success, error) {
    return (window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL)(path, success, error);
}

function _blobBuilder() {
    var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
    return new BlobBuilder();
}

function _error(e) {
    var msg = '';

    switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
    case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
    case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
    case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
    case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
    default:
        msg = 'Unknown Error';
        break;
    }

    _console.log('FileSystem error: ' + msg);
}

_self = {
    initialize: function (prev, baton) {
        try {
            var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

            if (requestFileSystem) {
                baton.take();
            }

            requestFileSystem(window.TEMPORARY, constants.FS_SIZE, function (fs) {
                _fs = fs;
                event.trigger("FileSystemInitialized", null, true);
                baton.pass();
            }, _error);
        }
        catch (e) {
            console.log("File System Not Available");
        }
    },

    ls: function (path, success, error) {
        path = path || "/";

        _fs.root.getDirectory(path, {}, function (dirEntry) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function (entries) {
                success(_map(entries, function (entry) {
                    return entry;
                }));
            }, error);
        }, error);
    },

    rm: function (path, success, error, options) {
        options = options || {};

        _fs.root[options.recursive ? "getDirectory" : "getFile"](path, {create: false}, function (entry) {
            entry[options.recursive ? "removeRecursively" : "remove"](function () {
                success();
            }, error);
        }, error);
    },

    rmdir: function (path, success, error, options) {
        options = options || {};

        _fs.root.getDirectory(path, {create: false}, function (entry) {
            entry.remove(function () {
                success();
            }, error);
        }, error);
    },

    mkdir: function (path, success, error) {
        _fs.root.getDirectory(path, {create: true}, function (dirEntry) {
            success(dirEntry);
        }, error);
    },

    mv: function (from, to, success, error) {
        var path = to.replace(/^\//, "").split("/"),
            fileName = path.splice(path.length - 1, 1).toString();

        _self.stat(from, function (entry) {
            _self.stat(path.length > 0 ? path.join("/") : "/", function (dest) {
                entry.moveTo(dest, fileName, function (finalDestination) {
                    success(finalDestination);
                }, error);
            }, error);
        }, error);
    },

    touch: function (path, success, error) {
        _fs.root.getFile(path, {create: true}, function (fileEntry) {
            success(fileEntry);
        }, error);
    },

    cp: function (from, to, success, error) {
        var path = to.replace(/^\//, "").split("/"),
            fileName = path.splice(path.length - 1, 1).toString();

        _self.stat(from, function (entry) {
            _self.stat(path.length > 0 ? path.join("/") : "/", function (dest) {
                entry.copyTo(dest, fileName, function (finalDestination) {
                    success(finalDestination);
                }, error);
            }, error);
        }, error);
    },

    stat: function (path, success, error) {
        var url = "filesystem:" + utils.location().origin + "/temporary/" + path;
        _resolveLocalFileSystemURL(url, function (entry) {
            success(entry);
        }, error);
    },

    write: function (path, contents, success, error, options) {
        options = options || {};

        function write(entry) {
            entry.createWriter(function (fileWriter) {
                var bb = _blobBuilder();

                fileWriter.onwriteend = function () {
                    success(entry);
                };
                fileWriter.onerror = error;

                if (options.mode === "append") {
                    fileWriter.seek(fileWriter.length);
                }

                bb.append(contents);
                fileWriter.write(bb.getBlob('text/plain'));
            }, error);
        }

        _self.stat(path, function (entry) {
            if (options.mode === "append") {
                write(entry);
            } else {
                _self.rm(path, function () {
                    _self.touch(path, write, error);
                }, error);
            }
        }, function (e) {
            if (e.code === FileError.NOT_FOUND_ERR) {
                _self.touch(path, write, error);
            } else {
                error(e);
            }
        });
    },

    read: function (path, success, error) {
        _self.stat(path, function (entry) {
            entry.file(function (file) {
                var reader = new FileReader();

                reader.onloadend = function (progressEvent) {
                    success(progressEvent.target.result);
                };
                reader.onerror = error;

                reader.readAsText(file);
            }, error);
        }, error);
    }
};

module.exports = _self;
