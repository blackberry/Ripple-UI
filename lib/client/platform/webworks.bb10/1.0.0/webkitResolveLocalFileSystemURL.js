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
var _orig = window.webkitResolveLocalFileSystemURL,
    coreFS = ripple('platform/webworks.bb10/1.0.0/coreFileSystem');

module.exports = function (url, success, fail) {
    var sandboxed = ripple('platform/webworks.bb10/1.0.0/io').sandbox;

    function internalSuccess(entry) {
        var myEntry;
        //HACK: but can't figure out how else to determine
        //the type of entry I'm getting :(
        if (entry.isDirectory) {
            myEntry = coreFS.createDirectoryEntry(entry, entry.fileSystem, sandboxed);
        }
        else {
            myEntry = coreFS.createFileEntry(entry, entry.fileSystem, sandboxed);
        }

        success(myEntry);
    }

    _orig(url, internalSuccess, fail);
};
