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
var utils = require('./../build/utils'),
    jasmine = require(__dirname + '/../../thirdparty/jasmine/lib/jasmine-core/jasmine');

function run(targets, done) {
    var suites = [],
        errors = '',
        suitesLogged = 0,
        env = jasmine.jasmine.getEnv(),
        reporter = new jasmine.jasmine.Reporter(),
        started;

    Object.keys(jasmine).forEach(function (key) {
        global[key] = jasmine[key];
    });

    reporter.reportRunnerStarting = function () {
        started = new Date().getTime();
    };

    reporter.reportRunnerResults = function (runner) {
        var results = runner.results(),
            tests = runner.suites(),
            finished = (new Date().getTime() - started) / 1000,
            msg = '\n\n';

        msg += 'Finished in ' + finished + ' seconds\n';
        msg += suites.length + ' suite' + ((suites.length === 1) ? '' : 's') + ', ';
        msg += tests.length + ' test' + ((suites.length === 1) ? '' : 's') + ', ';
        msg += results.totalCount + ' assertion' + ((results.totalCount === 1) ? '' : 's') + ', ';
        msg += results.failedCount + ' failure' + ((results.failedCount === 1) ? '' : 's') + '\n';

        process.stdout.write(msg);
        process.stdout.write('\n' + errors);

        done(runner);
    };

    reporter.reportSuiteResults = function (suite) {
        var results = suite.results(),
            s = suite,
            p = [],
            description;

        while (s) {
            p.unshift(s.description);
            s = s.parentSuite;
        }

        description = p.join(' ');

        results.items_.forEach(function (spec) {
            if (spec.failedCount > 0 && spec.description) {
                errors += description + '\n';

                spec.items_.forEach(function (test) {
                    errors += '  it ' + spec.description + '\n';
                    errors += '    message: ' + test.message + '\n';
                    errors += '    trace: ' + test.trace.stack + '\n';
                });

                errors += '\n';
            }
        });
    };

    reporter.reportSpecResults = function (spec) {
        suitesLogged++;

        process.stdout.write(spec.results().passed() ? '.' : 'F');

        if (suitesLogged % 40 === 0) {
            process.stdout.write('\n');
        }
    };

    env.updateInterval = 1000;
    env.addReporter(reporter);

    targets.forEach(function (target) {
        utils.collect(target, suites);
    });

    suites.forEach(require);

    env.execute();
}

module.exports = {
    run: run,
    core: jasmine.jasmine
};
