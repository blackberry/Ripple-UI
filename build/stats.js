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
module.exports = function () {
    var sys = require('sys'),
        libs = [],
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
            loc = 0,
            text;

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

            sys.puts("| " + file + spaces(59 - file.length) + "| " +
                    lines + spaces(7 - String(lines).length) + "| " +
                    loc + spaces(7 - String(loc).length) + "|");

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

    collect(__dirname + "/../lib/", libs);
    collect(__dirname + "/../test/", tests);

    libs.sort();
    tests.sort();

    sys.puts("+------------------------------------------------------------+--------+--------+");
    sys.puts("| Lib                                                        | Lines  | LOC    |");
    sys.puts("+------------------------------------------------------------+--------+--------+");

    libs.forEach(function (lib) {
        parseFile(lib, function (lines, loc) {
            lib_lines += lines;
            lib_loc += loc;
        });
    });

    sys.puts("+------------------------------------------------------------+--------+--------+");
    sys.print("| Total                                                      |");
    sys.print(" " + lib_lines + spaces(7 - String(lib_lines).length) + "|");
    sys.puts(" " + lib_loc + spaces(7 - String(lib_loc).length) + "|");
    sys.puts("+------------------------------------------------------------+--------+--------+");

    sys.puts("+------------------------------------------------------------+--------+--------+");
    sys.puts("| Tests                                                      | Lines  | LOC    |");
    sys.puts("+------------------------------------------------------------+--------+--------+");

    tests.forEach(function (test) {
        parseFile(test, function (lines, loc) {
            test_lines += lines;
            test_loc += loc;
        });
    });

    sys.puts("+------------------------------------------------------------+--------+--------+");
    sys.print("| Total                                                      |");
    sys.print(" " + test_lines + spaces(7 - String(test_lines).length) + "|");
    sys.puts(" " + test_loc + spaces(7 - String(test_loc).length) + "|");
    sys.puts("+------------------------------------------------------------+--------+--------+");

    total_lines = lib_lines + test_lines;
    total_loc = lib_loc + test_loc;
    testsOverLib = (lib_loc / test_loc).toFixed(2);
    emptySpace = total_lines - total_loc;

    sys.puts("+------------------------------------------------------------+--------+--------+");
    sys.puts("| Stats                                                                        |");
    sys.puts("+------------------------------------------------------------+--------+--------+");
    sys.puts("| lines: " + total_lines + spaces(70 - String(total_lines).length) + "|");
    sys.puts("| loc: " + total_loc + spaces(72 - String(total_loc).length) + "|");
    sys.puts("| lib/test (loc): " + testsOverLib + spaces(61 - String(testsOverLib).length) + "|");
    sys.puts("| comments & empty space: " + emptySpace + spaces(53 - String(emptySpace).length) + "|");
    sys.puts("+------------------------------------------------------------+--------+--------+");
};
