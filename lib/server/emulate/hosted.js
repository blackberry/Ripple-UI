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
var fs = require('fs'),
    path = require('path'),

    // TODO: this head regex should match anything
    HEAD_TAG = /<head>/,

    HOSTED_PKG_DIR = path.join(__dirname, "..", "..", "..", "pkg", "hosted"),

    BOOTSTRAP_FROM_IFRAME = 'if (window.top.ripple) { ' +
                                'window.top.ripple("bootstrap").inject(window, document);' +
                            '}';

module.exports = {
    inject: function (opts) {
        return function (req, res, next) {
            if (req.query.enableripple) {
                res.sendfile(path.join(HOSTED_PKG_DIR, "ripple.html"));
            } else if (req.path.match(/^\/$/) || req.path.match(/\.html/)) {
                file = path.join(opts.path, (req.path.match(/\/$/) ?
                                "index.html" : req.path));

                fs.readFile(file, "utf-8", function (err, data) {
                    if (err) { throw new Error(err); }

                    var doc = data.replace(HEAD_TAG,
                              '<head>' +
                                '<script>' +
                                    BOOTSTRAP_FROM_IFRAME +
                                '</script>');

                    res.send(doc);
                });
            } else {
                next();
            }
        };
    }
};
