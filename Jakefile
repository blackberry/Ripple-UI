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
var fs = require('fs');

desc("runs jake build");
task('default', ['fixwhitespace'], require('./build/build'));

desc("compiles source files for targets/* - usage: jake build [target] where target is the folder name (defaults to all)");
task('build', [], require('./build/build'), true);

desc("test and lint before building (with js compression)");
task('deploy', [], require('./build/deploy'), true);

desc("run all tests in node with an emulated dom - jake test [path1,path2]");
task('test', [], function () {
    require('./build/test')(arguments.length > 0 ? 
                Array.prototype.slice.apply(arguments) : null);
});

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
    require('./build/clean')(null, {
        take: function () {},
        pass: complete
    });
}, true);

desc('converts tabs to four spaces, eliminates trailing white space, converts newlines to proper form - enforcing style guide ftw!');
task('fixwhitespace', function() {
    require('./build/whitespace').fix(function(file, newSource) {
        console.log("fixed whitespace issues in:");
        fs.writeFileSync(file, newSource, 'utf8');
        console.log("   " + file);
    }, complete);
}, true);

