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
var utils = ripple('utils'),
    constants = ripple('constants'),
    event = ripple('event'),
    _console = ripple('console'),
    PLAIN_TEXT = 'text/plain',
    _fs = {
        temp: undefined,
        perm: undefined
    },
    _self, _resolveLocalFileSystemURL;

function _map(array, callback) {
    var map = [], i;
    for (i = 0; i < array.length; i++) {
        map[i] = callback(array[i], i);
    }
    return map;
}

function _error(e, baton) {
    var msg = '';

    switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
    case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
    case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR: Looks like you\'re running in the file:/// scheme. You need to start Chrome with --allow-file-access-from-files if you want to have access to the FileSystem API.';
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
    baton.pass();
}

_self = {
    initialize: function (prev, baton) {
        try {
            var requestFileSystem = window.webkitRequestFileSystem || window.requestFileSystem;

            _resolveLocalFileSystemURL = window.webkitResolveLocalFileSystemURL || window.resolveLocalFileSystemURL;

            if (requestFileSystem) {
                baton.take();
            }

            requestFileSystem(window.TEMPORARY, constants.FS_SIZE, function (fs) {
                _fs.temp = fs;

                requestFileSystem(window.PERSISTENT, constants.FS_SIZE, function (fs) {
                    _fs.perm = fs;
                    event.trigger("FileSystemInitialized", null, true);
                    baton.pass();
                }, function (e) {
                    _error(e, baton);
                });
            }, function (e) {
                _error(e, baton);
            });

        }
        catch (e) {
            console.log("File System Not Available");
            baton.pass();
        }
    },

    ls: function (path, success, error, options) {
        options = options || {};
        var fs = options.perm ? _fs.perm : _fs.temp;

        path = path || "/";

        fs.root.getDirectory(path, {}, function (dirEntry) {
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
        var fs = options.perm ? _fs.perm : _fs.temp;

        fs.root[options.recursive ? "getDirectory" : "getFile"](path, {create: false}, function (entry) {
            entry[options.recursive ? "removeRecursively" : "remove"](function () {
                success();
            }, error);
        }, error);
    },

    rmdir: function (path, success, error, options) {
        options = options || {};
        var fs = options.perm ? _fs.perm : _fs.temp;

        fs.root.getDirectory(path, {create: false}, function (entry) {
            entry.remove(function () {
                success();
            }, error);
        }, error);
    },

    mkdir: function (path, success, error, options) {
        options = options || {};
        var fs = options.perm ? _fs.perm : _fs.temp,
            order = jWorkflow.order(),
            chunks = path.replace(/^\//, "").split("/"),
            currentPath = "";

        // This could use some refactoring/optimization.
        if (options.recursive) {
            //HACK
            delete options.recursive;

            chunks.forEach(function (piece)  {
                var thisPath = (currentPath ? currentPath + "/" : "") + piece;
                currentPath = thisPath;
                order.andThen(function (p, baton) {
                    baton.take();
                    _self.mkdir(thisPath, function () {
                        baton.pass();
                    }, error, options);
                });
            });

            order.start(function () {
                _self.stat(path, success, error, options);
            });
        } else {
            fs.root.getDirectory(path, {create: true}, function (dirEntry) {
                success(dirEntry);
            }, error);
        }
    },

    mv: function (from, to, success, error, options) {
        var path = to.replace(/^\//, "").split("/"),
            fileName = path.splice(path.length - 1, 1).toString();

        _self.stat(from, function (entry) {
            _self.stat(path.length > 0 ? path.join("/") : "/", function (dest) {
                entry.moveTo(dest, fileName, function (finalDestination) {
                    success(finalDestination);
                }, error);
            }, error, options);
        }, error, options);
    },

    touch: function (path, success, error, options) {
        options = options || {};
        var fs = options.perm ? _fs.perm : _fs.temp;

        fs.root.getFile(path, {create: true}, function (fileEntry) {
            success(fileEntry);
        }, error);
    },

    cp: function (from, to, success, error, options) {
        var path = to.replace(/^\//, "").split("/"),
            fileName = path.splice(path.length - 1, 1).toString();

        _self.stat(from, function (entry) {
            _self.stat(path.length > 0 ? path.join("/") : "/", function (dest) {
                entry.copyTo(dest, fileName, function (finalDestination) {
                    success(finalDestination);
                }, error);
            }, error, options);
        }, error, options);
    },

    stat: function (path, success, error, options) {
        options = options || {};
        var fs = options.perm ? "/persistent/" : "/temporary/",
            url = "filesystem:" + utils.location().origin + fs + path;
        _resolveLocalFileSystemURL(url, function (entry) {
            success(entry);
        }, error);
    },

    // contents => Blob || DOMString
    write: function (path, contents, success, error, options) {
        options = options || {};

        function write(entry) {
            entry.createWriter(function (fileWriter) {
                var blob = contents instanceof Blob === false ?
                           new Blob([contents], {type: options.type || PLAIN_TEXT}) :
                           contents;

                fileWriter.onerror = error;
                fileWriter.onwriteend = function () {
                    success(entry);
                };

                if (options.mode === "append") {
                    fileWriter.seek(fileWriter.length);
                }

                fileWriter.write(blob);
            }, error);
        }

        _self.stat(path, function (entry) {
            if (options.mode === "append") {
                write(entry);
            } else {
                _self.rm(path, function () {
                    _self.touch(path, write, error, options);
                }, error, options);
            }
        }, function (e) {
            if (e.code === FileError.NOT_FOUND_ERR) {
                _self.touch(path, write, error, options);
            } else {
                error(e);
            }
        }, options);
    },

    read: function (path, success, error, options) {
        if (!options) {
            options = {};
        }

        _self.stat(path, function (entry) {
            entry.file(function (file) {
                var reader = new FileReader();

                reader.onerror = error;

                if (options.type === "text") {
                    reader.onloadend = function (progressEvent) {
                        success(progressEvent.target.result);
                    };
                    reader.readAsText(file);
                } else {
                    success(new Blob([file], {type: file.type}));
                }

            }, error);
        }, error, options);
    }
};

module.exports = _self;
