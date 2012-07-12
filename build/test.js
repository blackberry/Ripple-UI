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
var jsdom = require('jsdom'),
    fs = require('fs'),
    jWorkflow = require('jWorkflow'),
    jasmine = require('./test/jasmine-node'),
    childProcess = require('child_process'),
    nodeXMLHttpRequest = require(__dirname + '/../thirdparty/node-XMLHttpRequest/XMLHttpRequest').XMLHttpRequest;

function _extraMocks() {
    global.screen = {
        height: 1600,
        availHeight: 1600,
        width: 1200,
        availWidth: 1200
    };

    global.XMLHttpRequest = window.XMLHttpRequest = nodeXMLHttpRequest;
    require(__dirname + "/../thirdparty/Math.uuid");
    global.jWorkflow = jWorkflow;

    window.navigator.userAgent = "foo";
    window.navigator.geolocation = {};
    window.navigator.javaEnabled = function () {};

    global.location = window.location = {protocol: "http"};
    global.NamedNodeMap = function () {
        return [];
    };
    window.require = require;
    window.removeEventListener = function () {};
}

function _setupEnv(ready) {
    var layout = fs.readFileSync(__dirname + "/../ext/assets/index.html", "utf-8"),
        thirdparty = [
            __dirname + "/../thirdparty/jquery.js",
            __dirname + "/../thirdparty/jquery.ui.js"
        ];

    jsdom.env(layout, thirdparty, function (error, window) {
        global.window = window;
        global.document = window.document;
        global.jQuery = window.jQuery;

        global.describeBrowser = function () {
            return global.xdescribe.apply(global, Array.prototype.slice.call(arguments));
        };

        global.itBrowser = function () {
            return global.xit.apply(global, Array.prototype.slice.call(arguments));
        };

        _extraMocks();

        ready();
    });
}

module.exports = function (done) {
    //HACK: this should be  taken out if our pull request in jasmine is accepted.
    jasmine.core.Matchers.prototype.toThrow = function (expected) {
        var result = false,
            exception,
            not = this.isNot ? "not " : "";

        if (typeof this.actual !== 'function') {
            throw new Error('Actual is not a function');
        }
        try {
            this.actual();
        } catch (e) {
            exception = e;
        }
        if (exception) {
            if (typeof expected === 'function') {
                result = expected(exception);
            }
            else {
                result = (expected === jasmine.core.undefined || this.env.equals_(exception.message || exception, expected.message || expected));
            }
        }

        this.message = function () {
            if (exception && (expected === jasmine.core.undefined || !this.env.equals_(exception.message || exception, expected.message || expected))) {
                return ["Expected function " + not + "to throw", expected ? expected.message || expected : "an exception", ", but it threw", exception.message || exception].join(' ');
            } else {
                return "Expected function to throw an exception.";
            }
        };

        return result;
    };

    _setupEnv(function () {
        var targets = __dirname + "/../test";

        jasmine.run(targets.split(' '), function (runner) {
            var failed = runner.results().failedCount === 0 ? 0 : 1;
            (typeof done !== "function" ? process.exit : done)(failed);
        });
    });
};
