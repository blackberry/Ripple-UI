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
    fileSystem = require('ripple/fileSystem'),
    fileSystemPaths = fileSystem.getFileSystemPaths();

module.exports = {
    panel: {
        domId: "filsystem-container",
        collapsed: true,
        pane: "left"
    },
    initialize: function () {
        var fileSystemPaths = fileSystem.getFileSystemPaths();

        utils.forEach(fileSystemPaths, function (value, key) {
            utils.bindAutoSaveEvent(jQuery(constants.FILESYSTEM.INPUT_PREFIX_ID + key).val(value.uri), function () {
                value.uri = jQuery(constants.FILESYSTEM.INPUT_PREFIX_ID + key).val();
                fileSystem.updateFileSystemPaths(fileSystemPaths);
            });
        });
    }
};
