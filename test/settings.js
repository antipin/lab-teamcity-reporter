var Lab       = require('lab'),
    _Lab      = require('../test_runner/lib'),
    Code      = require('code'),
    lab       = exports.lab = _Lab.script(),

    describe  = lab.describe,
    before    = lab.before,
    it        = lab.it,
    expect    = Code.expect,

    utils = require('./utils'),
    suiteDelimiter = ' ~ ',
    testScript,
    reportMessages,
    reportRaw,
    experimentsPaths;

describe('Report settings', function() {

    describe('Nested experiment titles and delimites', function() {

        before(function(done) {

            testScript = require('./inputs/deeply-nested').lab;

            experimentsPaths = utils.getExperimentsPaths(testScript._root.experiments);

            utils.getReport(testScript, { nestedSuiteTitle: true, suiteTitleDelimiter: suiteDelimiter }, function(result) {
                reportRaw = result.raw;
                reportMessages = result.messages;
                done();
            });
        });

        it('should output nested titles if option `nestedSuiteTitle` is true', function(done) {

            var experimentsTitles = experimentsPaths.map(function(experimentPath) {
                return experimentPath.join(suiteDelimiter);
            });

            reportMessages.forEach(function(message) {
                if (utils.getMessageName(message) === 'testSuiteStarted') {

                    var messageName = utils.getMessageAttr('name', message);

                    if (messageName) {
                        var expectedMessageName = experimentsTitles.shift();
                        expect(messageName).to.be.equal(expectedMessageName);
                    }
                }
            });

            done();
        });
    });

    describe('Not nested experiment titles', function() {

        before(function(done) {

            testScript = require('./inputs/deeply-nested').lab;

            experimentsPaths = utils.getExperimentsPaths(testScript._root.experiments);

            utils.getReport(testScript, { nestedSuiteTitle: false }, function(result) {
                reportRaw = result.raw;
                reportMessages = result.messages;
                done();
            });
        });

        it('should output not nested titles if option `nestedSuiteTitle` is false', function(done) {

            var experimentsTitles = experimentsPaths.map(function(experimentPath) {
                return experimentPath[experimentPath.length - 1];
            });

            reportMessages.forEach(function(message) {
                if (utils.getMessageName(message) === 'testSuiteStarted') {

                    var messageName = utils.getMessageAttr('name', message);

                    if (messageName) {
                        var expectedMessageName = experimentsTitles.shift();
                        expect(messageName).to.be.equal(expectedMessageName);
                    }
                }
            });

            done();
        });
    });


});