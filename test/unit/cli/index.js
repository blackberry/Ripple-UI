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
describe("cli", function () {
    var cli = require('./../../../lib/cli'),
        parser = require('./../../../lib/cli/parser'),
        proxy = require('./../../../lib/cli/proxy'),
        help = require('./../../../lib/cli/help'),
        basicArgs = ["node", "ripple"];

    describe("passing parsed cli args to a cli module", function () {
        // Note: since a module needs to exist to test with (and since help is a special case)..
        // ..use the proxy module (if it changes, change this to use one that exists)
        // not ideal.. I know.. if there is a better way, by all means. :-)
        beforeEach(function () {
            spyOn(proxy, 'call');
            spyOn(proxy, 'start');
        });

        it("requires cli/command_name and uses the `call` method if no subcommand is given", function () {
            spyOn(parser, "parse").andReturn({commands: ["proxy"], options: {}});
            cli.interpret(basicArgs.concat(["proxy"]));
            expect(proxy.call).toHaveBeenCalled();
        });

        it("requires cli/command_name and uses the method named after the sub command, if given", function () {
            spyOn(parser, "parse").andReturn({
                commands: ["proxy", "start"],
                options: {"a": true}
            });
            cli.interpret(basicArgs.concat(["proxy", "start"]));
            expect(proxy.start).toHaveBeenCalledWith({"a": true});
        });

        it("passes any given cli options to the command module", function () {
            spyOn(parser, "parse").andReturn({
                commands: ["proxy"],
                options: {"a": true}
            });
            cli.interpret(basicArgs.concat(["proxy", "--a"]));
            expect(proxy.call).toHaveBeenCalledWith({"a": true});
        });
    });

    describe("logging usage", function () {
        beforeEach(function () {
            spyOn(help, "call");
            spyOn(console, "error");
        });

        it("logs general usage if there is an unknown command", function () {
            var unknownCmd = "unknown_foobar_command",
                unknownCmdMessage = ("Unknown command: " + unknownCmd).red.bold; // .red from colors package

            spyOn(parser, "parse").andReturn({
                commands: [unknownCmd],
                options: {}
            });

            cli.interpret(basicArgs.concat([unknownCmd]));

            expect(console.error).toHaveBeenCalledWith(unknownCmdMessage);
            expect(help.call).toHaveBeenCalledWith();
        });
        it("is called when no command", function () {
            spyOn(parser, "parse").andReturn({commands: [], options: {}});
            cli.interpret(basicArgs);
            expect(help.call).toHaveBeenCalled();
        });

        it("is called when first command is `help`", function () {
            spyOn(parser, "parse").andReturn({
                commands: ["help"],
                options: {}
            });
            cli.interpret(basicArgs.concat(["help"]));
            expect(help.call).toHaveBeenCalled();
        });

        it("can be passed a sub command to show help for", function () {
            spyOn(parser, "parse").andReturn({
                commands: ["help", "sub_command"],
                options: {}
            });
            cli.interpret(basicArgs.concat(["help", "sub_command"]));
            expect(help.call).toHaveBeenCalledWith("sub_command");
        });
    });
});
