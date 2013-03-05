var childProcess = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    connect = require('connect'),
    test = require('./../test'),
    reporter = require('./cov/reporter'),
    coverjs = __dirname + "/../../node_modules/coverjs/bin/cover.js",
    _coveragePort = 7070,
    _coverageAssets = __dirname + '/../../test/assets/cov';

function instrument(callback) {
    var args = ["-r", "-o", "cov", "lib", "test", "-e", "test/assets/cov"],
        cmd = childProcess.spawn(coverjs, args);
    cmd.on("exit", callback);
}

function serveUpResults() {
    var indexHtml = fs.readFileSync(path.join(_coverageAssets, 'results.html'), "utf-8")
                          .replace(/<\/head>/i,
                                      '<link rel="stylesheet" href="style.css" />' +
                                      '<script src="pretty.js"></script>' +
                                   "</head>");

    connect
        .createServer()
        .use(connect.static(_coverageAssets))
        .use("/", function (req, res) { res.end(indexHtml); })
        .listen(_coveragePort, function () {
            console.log("  coverage results at");
            console.log("    http://127.0.0.1:" + _coveragePort);
            console.log();
        });
}

function cleanup(callback) {
    childProcess.exec('rm -rf cov/', callback);
}

module.exports = function (customPaths, done) {
    instrument(function () {
        global.__$coverObject = {};

        test(customPaths || ["cov/test"], function () {
            console.log("Generating coverage report...");
            console.log();

            cleanup(function () {
                reporter.report(serveUpResults, done);
            });
        }, {withCoverage: true});
    });
};
