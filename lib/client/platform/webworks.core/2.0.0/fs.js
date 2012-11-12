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
// NOTE: This was created to handle sync calls (without the sync FileSystem API).
//       Use `lib/client/fs` for anything else.
var db = ripple('db'),
    utils = ripple('utils'),
    event = ripple('event'),
    _cache = {},
    _self;

function _get(path) {
    return path.replace(/^\//, '').split("/").reduce(function (obj, token) {
        return token === "" ? obj : (obj.children ? obj.children[token] || null : null);
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
        tokens = path.replace(/^\//, '').split("/"),
        child = tokens.splice(tokens.length - 1, 1).join("");

    tokens.forEach(function (token) {
        parent = parent.children[token];
    });

    delete parent.children[child];
}

function _save() {
    db.saveObject("db-filesystem", _cache);
}

_self = {

    initialize: function () {
        _cache = db.retrieveObject("db-filesystem") || {};
        event.trigger("WebWorksFileSystemInitialized", null, true);
    },

    ls: function (path, success, error) {
        try {
            var dir = _get(path),
                items = [];

            if (dir) {
                utils.forEach(dir.children, function (item) {
                    if (!item.isDirectory) {
                        item.file = function (callback) {
                            callback({});
                        };
                    }
                    items.push(item);
                });
            }
            else {
                items = {};
            }

            success(utils.copy(items));
        }
        catch (e) {
            e.code = 1;
            error(e);
        }
    },

    rm: function (path, success) {
        _delete(path);
        _save();
        success();
    },

    rmdir: function (path, success) {
        _delete(path);
        _save();
        success();
    },

    mkdir: function (path, success, error) {
        var entry = _get(path),
            info = _getInfo(path);

        if (!entry) {
            _set(path, {
                name: info.name,
                isDirectory: true,
                fullPath: path
            });
            entry = _get(path);
        }

        _save();
        if (entry) {
            success(utils.copy(entry));
        }
        else {
            error({code: 1});
        }
    },

    mv: function (from, to, success, error) {
        try {
            var fromEntry = _get(from),
                toInfo = _getInfo(to);

            fromEntry.fullPath = to;
            fromEntry.name = toInfo.name;

            _set(to, fromEntry);
            _delete(from);
            _save();
            success(utils.copy(_get(to)));
        }
        catch (e) {
            e.code = 1;
            error(e);
        }
    },

    touch: function (path, success) {
        if (!_get(path)) {
            _set(path, {
                fullPath: path
            });
        }
        _save();
        success(utils.copy(_get(path)));
    },

    cp: function (from, to, success, error) {
        try {
            var fromEntry = _get(from);
            fromEntry.fullPath = to;
            _set(to, fromEntry);
            _save();
            success(utils.copy(_get(to)));
        }
        catch (e) {
            e.code = 1;
            error(e);
        }
    },

    stat: function (path, success) {
        var entry = _get(path);
        success(utils.copy(entry));
    },

    write: function (path, contents, success) {
        var info = _getInfo(path);

        _set(path, {
            lastModifiedDate: new Date(),
            name: info.name,
            fullPath: path,
            isDirectory: false,
            properties: {
                type: "",
                size: contents.size
            },
            data: contents,
            file: function (callback) {
                callback({});
            }
        });

        success(utils.copy(_get(path)));
    },

    read: function (path, success, error) {
        var entry = _get(path);

        if (entry) {
            success(utils.copy(entry.data));
        }
        else {
            error({code: 1});
        }
    }
};

module.exports = _self;
