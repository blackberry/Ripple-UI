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
    path = require("path"),
    rexp_minified = new RegExp("\\.min\\.js$"),
    rexp_src = new RegExp('\\.js$');

desc("runs jake build");
task('default', ['fixwhitespace'], require('./build/build'));

desc("compiles source files for all extensions - jake build [web,npm,chromium]");
task('build', [], require('./build/build'));

desc("test and lint before building (with js compression)");
task('deploy', [], require('./build/deploy'));

// TODO: put this functionality into its own module (same with code in build/deploy).
desc("run all tests in node with an emulated dom - jake test [path,path2]");
task('test', [], function () {
    var childProcess = require('child_process'),
        env = process.env,
        lib = process.cwd() + '/lib',
        script = process.cwd() + '/build/scripts/runTestsInNode',
        child;

    env.NODE_PATH = lib;
    child = childProcess.spawn(process.execPath, [script], {'env': env});

    function log(data) {
        process.stdout.write(new Buffer(data).toString('utf-8'));
    }

    child.stdout.on('data', log);
    child.stderr.on('data', log);
    child.on('exit', function (code) {
        complete();
        process.exit(code);
    });
}, true);

desc("boot test server for running all tests in the browser");
task('btest', [], require('./build/btest'));

desc("runs jshint + csslint - jake lint [path1] [path2]");
task('lint', [], function () {
    require('./build/lint')(complete, Array.prototype.slice.call(arguments));
}, true);

desc("show various codebase stats");
task('stats', [], require('./build/stats'));

desc("cleans any built extension directories");
task('clean', [], function () {
    require('./build/build/clean')(null, {
        take: function () {},
        pass: complete
    });
}, true);

// courtesy of incubator-cordova-js found here: https://github.com/apache/incubator-cordova-js/blob/master/Jakefile
var complainedAboutWhitespace = false

desc('complain about what fixwhitespace would fix');
task('complainwhitespace', function() {
    processWhiteSpace(function(file, newSource) {
        if (!complainedAboutWhitespace) {
            console.log("files with whitespace issues: (to fix: `jake fixwhitespace`)")
            complainedAboutWhitespace = true
        }
        
        console.log("   " + file)
    })
}, true);

desc('converts tabs to four spaces, eliminates trailing white space, converts newlines to proper form - enforcing style guide ftw!');
task('fixwhitespace', function() {
    processWhiteSpace(function(file, newSource) {
        if (!complainedAboutWhitespace) {
            console.log("fixed whitespace issues in:")
            complainedAboutWhitespace = true
        }
        
        fs.writeFileSync(file, newSource, 'utf8');
        console.log("   " + file)
    })
}, true);

function forEachFile(root, cbFile, cbDone) {
    var count = 0;

    function scan(name) {
        ++count;

        fs.stat(name, function (err, stats) {
            if (err) cbFile(err);

            if (stats.isDirectory()) {
                fs.readdir(name, function (err, files) {
                    if (err) cbFile(err);

                    files.forEach(function (file) {
                        scan(path.join(name, file));
                    });
                    done();
                });
            } else if (stats.isFile()) {
                cbFile(null, name, stats, done);
            } else {
                done();
            }
        });
    }

    function done() {
        --count;
        if (count === 0 && cbDone) cbDone();
    }

    scan(root);
}

function processWhiteSpace(processor) {
    forEachFile('lib', function(err, file, stats, cbDone) {
        //if (err) throw err;
        if (rexp_minified.test(file) || !rexp_src.test(file)) {
            cbDone();
        } else {
            var origsrc = src = fs.readFileSync(file, 'utf8');

            // tabs -> four spaces
            if (src.indexOf('\t') >= 0) {
                src = src.split('\t').join('    ');
            }

            // eliminate trailing white space
            src = src.replace(/ +\n/g, '\n');

            if (origsrc !== src) {
                // write it out yo
                processor(file, src);
            }
            cbDone();
        }
    }, complete);
}
