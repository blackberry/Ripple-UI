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
var utils = ripple('utils'),
    _console = ripple('console'),
    constants = ripple('constants'),
    event = ripple('event'),
    fs = ripple('platform/webworks.core/2.0.0/fs'),
    bbUtils = ripple('platform/webworks.core/2.0.0/client/utils'),
    FileProperties = ripple('platform/webworks.core/2.0.0/client/FileProperties'),
    _cache = {},
    _self;

function _createPath(path) {
    var parts = path.replace(/^\//, '').replace(/\/$/, '').split("/"),
        workflow = jWorkflow.order();

    parts.forEach(function (part, index) {
        var dir = "/" + utils.copy(parts).splice(0, index + 1).join("/");

        workflow.andThen(function (prev, baton) {
            baton.take();
            fs.mkdir(dir, baton.pass, baton.pass);
        });
    });

    workflow.start(_self.refresh);
}
event.on("WebWorksFileSystemInitialized", function () {
    _createPath("/SDCard");
    _createPath("/store/home/user/music");
    _createPath("/store/home/user/pictures");
    _createPath("/store/home/user/videos");
    _createPath("/store/home/user/videos");
    _createPath("/accounts/1000/appdata/emulatedapp/data");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/bookmarks");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/books");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/camera");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/documents");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/downloads");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/misc");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/music");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/photos");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/print");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/videos");
    _createPath("/accounts/1000/appdata/emulatedapp/shared/voice");
});

function _fsError(e) {
    _self.refresh();
    if (e.code !== 1) { // suppress file not found error
        _console.error("FileSystem error (code " + e.code + ")");
    }
}

function _walk(path, parent) {
    fs.ls(path, function (entries) {
        parent.children = parent.children || {};

        entries.forEach(function (entry) {
            parent.children[entry.name] = entry;
            parent.children[entry.name].properties = {};

            if (entry.isDirectory) {
                _walk(entry.fullPath, entry);
            } else {
                entry.file(function (file) {
                    utils.mixin(file, parent.children[entry.name].properties);
                });
                fs.read(entry.fullPath, function (data) {
                    parent.children[entry.name].data = data;
                }, function (e) {
                    console.error(e);
                });
            }
        });
    }, function (e) {
        console.error(e);
    });
}

function _get(path) {
    return path.replace(/^\//, '').split("/").reduce(function (obj, token) {
        return token === "" ? obj : (obj && obj.children ? obj.children[token] || null : null);
    }, _cache);
}

function _getInfo(path) {
    var parent = ("/" + path.replace(/^\//, '').replace(/\/$/, '')).split("/"),
        name = parent.splice(parent.length - 1, 1).join(""),
        ext = name.split(".");

    return {
        name: name,
        extension: ext.length > 1 ? ext[ext.length - 1] : "",
        hidden: (name.length > 0 && name[0] === ".") || false,
        parent: parent.join("/") || "/"
    };
}

function _set(path, obj) {
    var parent = _cache,
        tokens = path.replace(/^\//, '').replace(/\/$/, '').split("/"),
        child = tokens.splice(tokens.length - 1, 1).join("");

    tokens.forEach(function (token) {
        parent = parent.children[token];
    });

    parent.children = parent.children || {};
    obj.properties = obj.properties || {};
    parent.children[child] = obj;
}

function _delete(path) {
    var parent = _cache,
        tokens = path.replace(/^\//, '').replace(/\/$/, '').split("/"),
        child = tokens.splice(tokens.length - 1, 1).join("");

    tokens.forEach(function (token) {
        parent = parent.children[token];
    });

    delete parent.children[child];
}

// TODO: handle exceptions so that any respective fs command can error out
// TODO: dateCreated is always dateModified

_self = {
    refresh: function () {
        _cache = {};
        _walk("/", _cache);
    },
    file: {
        exists: function (path) {
            var entry = _get(path);
            return !!(entry && !entry.isDirectory);
        },

        deleteFile: function (path) {
            _delete(path);
            fs.rm(path, function () {}, _fsError);
        },

        copy: function (from, to) {
            var fromEntry = _get(from);

            _set(to, {
                fullPath: to,
                properties: fromEntry.properties,
                data: fromEntry.data
            });

            fs.cp(from, to, function (entry) {
                entry.file(function (file) {
                    entry.properties = entry.properties || {};
                    utils.mixin(file, entry.properties);
                    _set(to, entry);
                });
            }, _fsError);
        },

        getFileProperties: function (path) {
            var entry = _get(path),
                info = _getInfo(path);

            fs.stat(path, function () {}, _fsError);

            return new FileProperties({
                //HACK: not sure where these should come from so check both for now.
                dateCreated: entry.properties.lastModifiedDate || entry.lastModifiedDate,
                dateModified: entry.properties.lastModifiedDate || entry.lastModifiedDate,
                directory: info.parent,
                fileExtension: info.extension,
                isHidden: info.hidden,
                isReadonly: false,
                mimeType: entry.properties.type,
                size: entry.properties.size
            });
        },

        rename: function (path, newName) {
            _self.dir.rename(path, newName);
        },

        readFile: function (path, success, async) {
            var entry = _get(path);

            async = async === false ? async : true;

            if (!async) {
                success(bbUtils.stringToBlob(entry.data));
            }
            else {
                fs.read(path, function (data) {
                    var blob = bbUtils.stringToBlob(data);
                    if (async) {
                        success(blob);
                    }
                    entry.data = data;
                    _set(path, entry);
                }, _fsError);
            }
        },

        saveFile: function (path, blob) {
            var data = bbUtils.blobToString(blob);

            _set(path, {
                lastModifiedDate: new Date(),
                fullPath: path,
                isDirectory: false,
                properties: {
                    type: "",
                    size: blob.size
                },
                data: data
            });

            fs.write(path, data, function (entry) {
                entry.data = data;
                entry.file(function (file) {
                    entry.properties = entry.properties || {};
                    utils.mixin(file, entry.properties);
                    _set(path, entry);
                });
            }, _fsError);
        }
    },
    dir: {
        createNewDir: function (path) {
            var entry = _get(path),
                info = _getInfo(path);

            if (!entry) {
                _set(path, {
                    name: info.name,
                    isDirectory: true,
                    fullPath: path
                });
            }

            fs.mkdir(path, function (entry) {
                _set(path, entry);
            }, _fsError);
        },

        deleteDirectory: function (path, recursive) {
            _delete(path);
            if (recursive) {
                fs.rm(path, function () {}, _fsError, {recursive: recursive});
            } else {
                fs.rmdir(path, function () {}, _fsError);
            }
        },

        exists: function (path) {
            var entry = _get(path);
            return !!(entry && entry.isDirectory);
        },

        getFreeSpaceForRoot: function () {
            function _du(obj, size) {
                utils.forEach(obj, function (child) {
                    if (child.isDirectory && child.children) {
                        size += _du(child.children, size);
                    } else if (child.properties && child.properties.size) {
                        size += child.properties.size;
                    }
                });
                return size;
            }

            return constants.FS_SIZE - _du(_cache.children, 0);
        },

        getParentDirectory: function (path) {
            path = "/" + path.replace(/^\//, '').replace(/\/$/, '');

            var entry = _get(path),
                array = path.split("/");

            return entry ? array.splice(0, array.length - 1).join("/") || "/" : null;
        },

        listDirectories: function (path) {
            var dir = _get(path),
                directories = [];

            utils.forEach(dir.children, function (item) {
                if (item.isDirectory) {
                    directories.push(item.name);
                }
            });

            fs.ls(path, function () {}, _fsError);

            return directories;
        },

        listFiles: function (path) {
            var dir = _get(path),
                files = [];

            if (dir) {
                utils.forEach(dir.children, function (item) {
                    if (!item.isDirectory) {
                        files.push(item.name);
                    }
                });
            }

            fs.ls(path, function () {}, _fsError);

            return files;
        },

        rename: function (path, newName) {
            var info = _getInfo(path),
                parent = info.parent,
                oldName = info.name,
                from = (parent === "/" ? "" : parent) + "/" + oldName,
                to =  (parent === "/" ? "" : parent) + "/" + newName;

            _delete(from);
            _set(to, {
                name: info.name,
                fullPath: path
            });

            fs.mv(from, to, function (entry) {
                _set(to, entry);
            }, _fsError);
        },

        getRootDirs: function () {
            return _self.dir.listDirectories("/");
        }
    }
};

module.exports = _self;
