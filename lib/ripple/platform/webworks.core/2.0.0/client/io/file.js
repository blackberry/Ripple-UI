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
var transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/io/file/",
    FILE = "file://",
    _onFileOpened;

function _prunePrefix(path) {
    return path.replace(new RegExp("^" + FILE), '');
}

module.exports = {
    copy: function (from, to) {
        transport.call(_uri + "copy", {
            post: {from: _prunePrefix(from), to: _prunePrefix(to)}
        });
    },
    deleteFile: function (path) {
        transport.call(_uri + "deleteFile", {
            post: {path: _prunePrefix(path)}
        });
    },
    exists: function (path) {
        return transport.call(_uri + "exists", {
            post: {path: _prunePrefix(path)}
        });
    },
    getFileProperties: function (path) {
        var properties = transport.call(_uri + "getFileProperties", {
            post: {path: _prunePrefix(path)}
        });
        properties.directory = FILE + properties.directory;
        return properties;
    },
    open: function (path, newName) {
        transport.call(_uri + "open", {
            post: {path: _prunePrefix(path)}
        });
    },
    readFile: function (path, onFileOpened, async) {
        async = async === false ? false : true;

        var uri = _uri + "readFile",
            args = {
                post: {path: _prunePrefix(path), async: async}
            },
            callResult;

        _onFileOpened = onFileOpened;

        if (async) {
            transport.poll(uri, args, function (data, res) {
                if (_onFileOpened) {
                    _onFileOpened(FILE + data.fullPath, data.blobData);
                }
                return false;
            });
        } else {
            callResult = transport.call(uri, args);
            _onFileOpened(FILE + callResult.fullPath, callResult.blobData);
        }
    },
    rename: function (path, newName) {
        transport.call(_uri + "rename", {
            post: {path: _prunePrefix(path), newName: newName}
        });
    },
    saveFile: function (path, blob) {
        transport.call(_uri + "saveFile", {
            post: {path: _prunePrefix(path), blob: blob}
        });
    }
};
