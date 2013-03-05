var fs = require('fs'),
    HTMLReporter = require('./../../../node_modules/coverjs/lib/reporters/HTMLReporter'),
    resultsFile = __dirname + '/../../../test/assets/cov/results.html';

function report(done) {
    var html = new HTMLReporter(global.__$coverObject),
        reportHTML = html.report(),
        coveragePercent = Math.round((html.pass / html.total) * 100);

    reportHTML = reportHTML.replace(/<body>/g,
                            '<body style="display: none;">' +
                               '<div class="totals">' +
                                 '<div class="total-coverage">' + coveragePercent + "% coverage</div>" +
                                 '<div class="total-statements">' + html.total + " statements</div>" +
                                 '<div class="total-covered">' + html.pass + " covered</div>" +
                                 '<div class="total-skipped">' + html.error + " skipped</div>" +
                               '</div>');

    fs.writeFileSync(resultsFile, reportHTML, 'utf-8');

    console.log('  Total Coverage      ' + coveragePercent + '%');
    console.log();
    console.log('  Statements          ' + html.total);
    console.log('    Covered           ' + html.pass);
    console.log('    Skipped           ' + html.error);
    console.log();

    done();
}

module.exports = {
    report: report
};
