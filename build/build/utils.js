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
var fs = require('fs'),
    _path = require('path'),
    _self;

_self = module.exports = {
    collect: function (path, files, matches) {
        matches = matches || function (path) {
            return path.match(/\.js$/);
        };

        if (fs.statSync(path).isDirectory()) {
            fs.readdirSync(path).forEach(function (item) {
                _self.collect(_path.join(path, item), files, matches);
            });
        } else if (matches(path)) {
            files.push(path);
        }
    }
};
