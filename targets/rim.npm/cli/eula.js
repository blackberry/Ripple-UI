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
    eula;

try {
    eula = fs.readFileSync(__dirname + "/eula.md", "utf-8");
}
catch (e) {
    eula = false;
}

function install() {
    console.log("Prepare ship for ludicrous speed! Fasten all seatbelts, seal all entrances and exits, close all shops in the mall, cancel the three ring circus, secure all animals in the zoo!");
}

if (!eula) {
    install();
    process.exit(1);
}

console.log("To install this software, you must agree to the following:");
console.log();
console.log(eula);
console.log("I accept the above (y/n): ");

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function (answer) {
    if (answer.match(/y/i)) {
        install();
        process.exit(0);
    }
    else {
        console.log("Sorry, but you can't have Ripple without accepting the terms :(");
        process.exit(1);
    }
});
