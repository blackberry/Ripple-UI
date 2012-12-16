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

var help = require('./help'),
    parser = require('./parser'),
    colors = require('colors');

// TODO: redundant, could be in it's own thing (other modules do the same)
colors.mode = "console";

function lookup(command, subcommand, options) {
    var module,
        method;

    try {
        module = require('./' + command);
    } catch (e) {
        console.error(('Unknown command: ' + command).red.bold);
        console.log(e);
        help.call();
        return;
    }

    method = subcommand && module[subcommand] ? subcommand : "call";
    module[method].apply(module, [command === "help" ? subcommand : options]);
}

module.exports = {
    interpret: function (args) {
        var parsed = parser.parse(args),
            subcommand;

        if (parsed.commands.length > 0) {
            // NOTE: we parse multiple sub commands but only use the first one (for now)
            subcommand = parsed.commands.length > 1 ? parsed.commands[1] : null;
            lookup(parsed.commands[0], subcommand, parsed.options);
        }
        else {
            help.call();
        }
    }
};
