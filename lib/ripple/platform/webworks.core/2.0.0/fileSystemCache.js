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
    utils = require('ripple/utils'),
    _console = require('ripple/console'),
    _cache = {};

function _walk(path, parent) {
    fs.ls(path, function (entries) {
        parent.children = parent.children || {};

        entries.forEach(function (entry) {
            parent.children[entry.name] = entry;

            if (entry.isDirectory) {
                _walk(entry.fullPath, entry);
            }
        });
    }, _fsError);
}

function _walkFS() {
    _cache = {};
    _walk("/", _cache);
}

function _fsError(e) {
    _walkFS();
    _console.error("FileSystem error (code " + e.code + ")");
}

function _get(path) {
    return path.replace(/^\//, '').split("/").reduce(function (obj, token) {
        return token === "" ? obj : (obj.children ? obj.children[token] || null : null);
    }, _cache);
}

function _set(path, obj) {
    var parent = _cache,
        tokens = path.replace(/^\//, '').split("/"),
        child = tokens.splice(tokens.length - 1, 1).join("");

    tokens.forEach(function (token) {
        parent = parent.children[token];
    });

    parent.children = parent.children || {};
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

module.exports = {
    initialize: _walkFS,
    dir: {
        createNewDir: function (path) {

            var entry = _get(path);

            if (!entry) {
                _set(path, {
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
            fs.stat(path, function () {}, _fsError);
            return entry && entry.isDirectory;
        },

        getParentDirectory: function (path) {
            path = "/" + path.replace(/^\//, '').replace(/\/$/, '');

            var entry = _get(path),
                parent = null,
                array = path.split("/");

            fs.stat(path, function (entry) {
                entry.getParent(function (p) {}, _fsError);
            }, _fsError);

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
        }
    }
};
