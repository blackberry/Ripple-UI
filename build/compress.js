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
var childProcess = require('child_process'),
    fs = require('fs'),
    _c = require('./conf'),
    utils = require('./utils'),
    childProcess = require('child_process'),
    jWorkflow = require('jWorkflow'),
    cssmin = require('cssmin').cssmin,
    htmlmin = require('html-minifier').minify;

function compressJS(workflow, file) {
    workflow.andThen(function (prev, baton) {
        baton.take();
        console.log("minifying:", file);
        childProcess.exec('uglifyjs --output ' + file + " " + file, function (err) {
            if (err) {
                console.log("Something bad happened. Is uglify-js installed?");
                console.log(err);
                process.exit(1);
            } else {
                baton.pass();
            }
        });
    });
}

function compressCSS(workflow, file) {
    workflow.andThen(function (prev, baton) {
        baton.take();
        fs.readFile(file, "utf-8", function (err, data) {
            if (err) {
                console.log("Something bad happened while minifying css.");
                console.log(err);
                process.exit(1);
            } else {
                fs.writeFile(file, cssmin(data), function () {
                    baton.pass();
                });
            }
        });
    });
}

function compressHTML(workflow, file) {
    workflow.andThen(function (prev, baton) {
        baton.take();
        fs.readFile(file, "utf-8", function (err, data) {
            if (err) {
                console.log("Something bad happened while minifying html.");
                console.log(err);
                process.exit(1);
            } else {
                fs.writeFile(file, htmlmin(data, {removeComments: true, collapseWhitespace: true}), function () {
                    baton.pass();
                });
            }
        });
    });
}

module.exports = function (prev, baton) {
    var cmd = jWorkflow.order(),
        files = {
            css: [],
            html: [],
            js: []
        };

    console.log("compressing...");
    baton.take();

    function matches(regex, str) {
        return !!str.match(regex);
    }

    utils.collect(_c.DEPLOY, files.js, matches.bind(this, /\.js$/));
    utils.collect(_c.DEPLOY, files.css, matches.bind(this, /\.css$/));
    utils.collect(_c.DEPLOY, files.html, matches.bind(this, /\.html$/));

    files.js.forEach(compressJS.bind(this, cmd));
    files.css.forEach(compressCSS.bind(this, cmd));
    files.html.forEach(compressHTML.bind(this, cmd));

    cmd.start(baton.pass);
};
