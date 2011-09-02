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
    _onFileOpened;

module.exports = {
    copy: function (from, to) {
        transport.call(_uri + "copy", {
            post: {from: from, to: to}
        });
    },
    deleteFile: function (path) {
        transport.call(_uri + "deleteFile", {
            post: {path: path}
        });
    },
    exists: function (path) {
        return transport.call(_uri + "exists", {
            post: {path: path}
        });
    },
    getFileProperties: function (path) {
        return transport.call(_uri + "getFileProperties", {
            post: {path: path}
        });
    },
    open: function (path, newName) {
        transport.call(_uri + "open", {
            post: {path: path}
        });
    },
    readFile: function (path, onFileOpened, async) {
        var uri = _uri + "readFile",
            args = {
                post: {path: path, async: async}
            };

        _onFileOpened = onFileOpened;

        if (async) {
            transport.poll(uri, args, function (data) {
                if (_onFileOpened) {
                    _onFileOpened(data);
                }
                return false;
            });
        } else {
            _onFileOpened(transport.call(uri, args));
        }
    },
    rename: function (path, newName) {
        transport.call(_uri + "rename", {
            post: {path: path, newName: newName}
        });
    },
    saveFile: function (path, blob) {
        transport.call(_uri + "saveFile", {
            post: {path: path, blob: blob}
        });
    }
};
