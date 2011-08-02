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
var constants = require('ripple/constants'),
    db = require('ripple/db'),
    exception = require('ripple/exception'),
    event = require('ripple/event'),
    _console = require('ripple/console'),
    utils = require('ripple/utils'),
    _fileSystemPaths = {
        "photos": { "uri": "" },
        "videos": { "uri": "" },
        "music": { "uri": "" },
        "downloads": { "uri": "" },
        "widgethome": { "uri": "" }
    },
    _fileSystemRegex = {
        "photos": { "virtualPathRegex": /^\/virtual\/photos\//i },
        "videos": { "virtualPathRegex": /^\/virtual\/videos\//i },
        "music": { "virtualPathRegex": /^\/virtual\/music\//i },
        "downloads": { "virtualPathRegex": /^\/virtual\/downloads\//i },
        "widgethome": { "virtualPathRegex": /^\/virtual\/widgethome\//i }
    },
    _overrides = {};

module.exports = {
    initialize: function () {
        _fileSystemPaths = db.retrieveObject(constants.FILESYSTEM.PERSISTENCE_KEY) || _fileSystemPaths;
        _fileSystemPaths.widgethome.uri = window.location.protocol + "//" + window.location.host + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    },

    getURI: function getURI(origURI) {
        var newURI = origURI,
            found = false;

        if (_overrides[origURI]) {
            return _overrides[origURI];
        }

        utils.forEach(_fileSystemPaths, function (value, key) {
            if (found) {
                return;
            }

            var uri = value.uri.replace(/\/$/, "");
            if (origURI.match(_fileSystemRegex[key].virtualPathRegex)) {
                newURI = origURI.replace(_fileSystemRegex[key].virtualPathRegex, uri + "/");
                found = true;
            }
        });

        return newURI;
    },

    exists: function (path) {
        try {
            var scrubbedUri = this.getURI(path),
                xhr = new XMLHttpRequest();

            xhr.open("GET", scrubbedUri, false);
            xhr.send();

            //HACK: this should return maybe for 403
            return xhr.status !== 404;
        }
        catch (e) {
            exception.handle(e);
            _console.log("failed to check if [" + path + "] exists");
            return false;
        }
    },


    getFileSystemPaths: function getFileSystemPaths() {
        return utils.copy(_fileSystemPaths);
    },

    updateFileSystemPaths: function updateFileSystemPaths(filePathsObject) {
        _fileSystemPaths = utils.copy(filePathsObject);
        _fileSystemPaths.widgethome.uri = window.location.protocol + "//" + window.location.host + window.location.pathname;
        db.saveObject(constants.FILESYSTEM.PERSISTENCE_KEY, filePathsObject);
    },

    override : function (from, to) {
        _overrides[from] = to;
    }
};
