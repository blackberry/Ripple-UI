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
var dir = require('ripple/platform/webworks.core/2.0.0/client/io/dir'),
    utils = require('ripple/utils'),
    _self = {};

utils.mixin({
    appDirs: {
        "app": {
            "storage" : {
                "path" : "file:///accounts/1000/appdata/emulatedapp/data"
            }
        },
        "shared": {
            "bookmarks": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/bookmarks"
            },
            "books": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/books"
            },
            "camera": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/camera"
            },
            "documents": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/documents"
            },
            "downloads": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/downloads"
            },
            "misc": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/misc"
            },
            "music": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/music"
            },
            "photos": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/photos"
            },
            "print": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/print"
            },
            "videos": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/videos"
            },
            "voice": {
                "path" : "file:///accounts/1000/appdata/emulatedapp/shared/voice"
            }
        }
    }
}, _self);

utils.mixin(dir, _self);

module.exports = _self;
