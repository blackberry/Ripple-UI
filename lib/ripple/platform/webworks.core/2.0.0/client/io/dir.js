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
    _uri = "blackberry/io/dir/";

module.exports = {
    createNewDir: function (path) {
        transport.call(_uri + "createNewDir", {
            post: {path: path}
        });
    },
    deleteDirectory: function (path, recursive) {
        transport.call(_uri + "deleteDirectory", {
            post: {path: path, recursive: recursive}
        });
    },
    exists: function (path) {
        transport.call(_uri + "exists", {
            post: {path: path}
        });
    },
    getFreeSpaceForRoot: function (path) {
        transport.call(_uri + "getFreeSpaceForRoot", {
            post: {path: path}
        });
    },
    getParentDirectory: function (path) {
        transport.call(_uri + "getParentDirectory", {
            post: {path: path}
        });
    },
    getRootDirs: function () {
        transport.call(_uri + "getRootDirs", {
            post: {}
        });
    },
    listDirectories: function (path) {
        transport.call(_uri + "listDirectories", {
            post: {path: path}
        });
    },
    listFiles: function (path) {
        transport.call(_uri + "listFiles", {
            post: {path: path}
        });
    },
    rename: function (path, newName) {
        transport.call(_uri + "rename", {
            post: {path: path, newName: newName}
        });
    }
};
