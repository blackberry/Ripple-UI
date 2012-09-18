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
var _c = require('./conf');

module.exports = function () {
    var libs = [],
        tests = [],
        total_lines = 0,
        total_loc = 0,
        lib_loc = 0,
        lib_lines = 0,
        test_loc = 0,
        test_lines = 0,
        emptySpace,
        testsOverLib;

    function spaces(number) {
        var str = "", i;
        for (i = 0; i < number; i++) {
            str += " ";
        }
        return str;
    }

    function parseFile(file, callback) {
        var lines = 0,
            loc = 0;

        if (file.match(/\.js$/)) {
            // hack!
            require('fs').readFileSync(file, "utf-8").replace(/\n$/, '').split("\n").forEach(function (line) {
                lines++;
                if (line !== "" && !line.match(/^\s*(\/\/.*)?$/)) {
                    loc++;
                }
            });

            file = file.replace(/\.js$/, '')
                        .replace(/^.*lib\/ripple$/, 'ripple')
                        .replace(/^.*lib\/ripple\/?/, '')
                        .replace(/^.*test\//, '');

            process.stdout.write("| " + file + spaces(59 - file.length) + "| " +
                    lines + spaces(7 - String(lines).length) + "| " +
                    loc + spaces(7 - String(loc).length) + "|\n");

            callback(lines, loc);
        }
    }

    function collect(path, files) {
        var fs = require('fs');
        if (fs.statSync(path).isDirectory()) {
            fs.readdirSync(path).forEach(function (item) {
                collect(require('path').join(path, item), files);
            });
        } else if (path.match(/\.js$/)) {
            files.push(path);
        }
    }

    collect(_c.LIB, libs);
    collect(_c.ROOT + "test", tests);

    libs.sort();
    tests.sort();

    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");
    process.stdout.write("| Lib                                                        | Lines  | LOC    |\n");
    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");

    libs.forEach(function (lib) {
        parseFile(lib, function (lines, loc) {
            lib_lines += lines;
            lib_loc += loc;
        });
    });

    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");
    process.stdout.write("| Total                                                      |");
    process.stdout.write(" " + lib_lines + spaces(7 - String(lib_lines).length) + "|");
    process.stdout.write(" " + lib_loc + spaces(7 - String(lib_loc).length) + "|\n");
    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");

    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");
    process.stdout.write("| Tests                                                      | Lines  | LOC    |\n");
    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");

    tests.forEach(function (test) {
        parseFile(test, function (lines, loc) {
            test_lines += lines;
            test_loc += loc;
        });
    });

    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");
    process.stdout.write("| Total                                                      |");
    process.stdout.write(" " + test_lines + spaces(7 - String(test_lines).length) + "|");
    process.stdout.write(" " + test_loc + spaces(7 - String(test_loc).length) + "|\n");
    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");

    total_lines = lib_lines + test_lines;
    total_loc = lib_loc + test_loc;
    testsOverLib = (lib_loc / test_loc).toFixed(2);
    emptySpace = total_lines - total_loc;

    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");
    process.stdout.write("| Stats                                                                        |\n");
    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");
    process.stdout.write("| lines: " + total_lines + spaces(70 - String(total_lines).length) + "|\n");
    process.stdout.write("| loc: " + total_loc + spaces(72 - String(total_loc).length) + "|\n");
    process.stdout.write("| lib/test (loc): " + testsOverLib + spaces(61 - String(testsOverLib).length) + "|\n");
    process.stdout.write("| comments & empty space: " + emptySpace + spaces(53 - String(emptySpace).length) + "|\n");
    process.stdout.write("+------------------------------------------------------------+--------+--------+\n");
};
