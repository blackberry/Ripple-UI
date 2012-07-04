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

// only run in nodejs
if (!global.process) {
    return;
}

describe("cli", function () {
    var fs = require('fs'),
        server = require('./../../lib/server'),
        cli = require('./../../lib/cli');

    beforeEach(function () {
        spyOn(process.stdout, "write");
    });

    describe('by default', function () {
        it("prints help", function () {
            var txt = require('fs').readFileSync(__dirname + "/../../doc/cli/HELP", "utf-8");
            cli.interpret(["node", "bin/ripple", "--help"]);
            expect(process.stdout.write.mostRecentCall.args[0]).toEqual(txt);
        });
    });

    describe('--version', function () {
        it("logs the current package version", function () {
            var data = {version: 1};
            spyOn(fs, "readFileSync").andReturn(JSON.stringify(data));
            cli.interpret(["node", "bin/ripple", "--version"]);
            expect(process.stdout.write.mostRecentCall.args[0]).toEqual(data.version + "\n");
        });
    });

    describe('--server', function () {
        it("boots a web server instance", function () {
            spyOn(server, 'boot');
            cli.interpret(["node", "bin/ripple", "--server"]);
            expect(server.boot).toHaveBeenCalled();
        });

        describe('--port', function () {
            it("boots on a specific port", function () {
                spyOn(server, 'boot');
                cli.interpret(["node", "bin/ripple", "--server", "--port", "5656"]);
                expect(server.boot).toHaveBeenCalledWith({port: 5656});
            });
        });
    });
});
