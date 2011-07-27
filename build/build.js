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
var sys = require('sys'),
    fs = require('fs'),
    jWorkflow = require('jWorkflow'),
    quotes = require('./build/quotes'),
    pack = require('./build/pack'),
    clean = require('./build/clean'),
    compress = require('./build/compress'),
    chromium = require('./build/chromium'),
    web = require('./build/web');
    console.log(__dirname);

function _done(error) {
    if (error) {
        sys.puts(fs.readFileSync(__dirname + "/../thirdparty/fail.txt", "utf-8"));
        sys.puts(error);
        process.exit(1);
    } else {
        sys.puts(fs.readFileSync(__dirname + "/../thirdparty/dredd.txt", "utf-8"));
        quotes.random();
        process.exit();
    }
}

function _handle(func) {
    return function () {
        try {
            func.apply(func, Array.prototype.slice.call(arguments));
        } catch (e) {
            _done(e.message + "\n" + e.stack);
        }
    };
}

module.exports = _handle(function (ext, opts, complete) {
    opts = opts || {};

    var build = jWorkflow.order(clean)
                         .andThen(pack);

    switch (ext) {
    case 'web':
        build.andThen(web);
        break;
    case 'chromium':
        build.andThen(chromium);
        break;
    default:
        build.andThen(chromium)
             .andThen(web);
    }

    if (opts.compress) {
        build.andThen(compress);
    }

    build.start(function () {
        _done();
    });
});
