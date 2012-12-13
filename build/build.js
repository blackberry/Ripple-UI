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
    jWorkflow = require('jWorkflow'),
    quotes = require('./quotes'),
    pack = require('./pack'),
    clean = require('./clean'),
    _c = require('./conf'),
    compress = require('./compress'),
    chromeExt = require('./targets/chrome.extension'),
    rimChromeExt = require('./targets/rim.chrome.extension'),
    cordova = require('./targets/cordova'),
    hosted = require('./targets/hosted'),
    web = require('./targets/web');

function _done(error) {
    if (error) {
        process.stdout.write(fs.readFileSync(_c.THIRDPARTY + "fail.txt", "utf-8"));
        process.stdout.write(error);
        process.exit(1);
    } else {
        process.stdout.write(fs.readFileSync(_c.THIRDPARTY + "dredd.txt", "utf-8"));
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

module.exports = _handle(function (ext, opts) {
    opts = opts || {};

    var build = jWorkflow.order(clean)
                         .andThen(pack);

    switch (ext) {
    case 'web':
        build.andThen(web);
        break;
    case 'chrome.extension':
        build.andThen(chromeExt);
        break;
    case 'rim.chrome.extension':
        build.andThen(rimChromeExt);
        break;
    case 'cordova':
        build.andThen(cordova);
        break;
    case 'hosted':
        build.andThen(hosted);
        break;
    default:
        build.andThen(chromeExt)
             .andThen(rimChromeExt)
             .andThen(web)
             .andThen(hosted)
             .andThen(cordova);
    }

    if (opts.compress) {
        build.andThen(compress);
    }

    build.start(function () {
        _done();
    });
});
