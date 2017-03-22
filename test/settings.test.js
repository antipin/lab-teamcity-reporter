var Lab       = require('lab'),
    Code      = require('code'),
    lab       = exports.lab = Lab.script(),

    describe  = lab.describe,
    before    = lab.before,
    it        = lab.it,
    expect    = Code.expect,

    dataSets  = require('./data-sets').getDataSetsByTags('settings'),

    utils = require('./utils'),
    suiteDelimiter = ' ~ ',
    reportMessages,
    reportRaw,
    settingsSets = [
        {
            params: {
                nestedSuiteTitle: true,
                suiteTitleDelimiter: suiteDelimiter
            },
            utils: {
                getCorrespondentTitles: function(experimentsPaths) {
                    return experimentsPaths.map(function(experimentPath) {
                        return experimentPath.join(suiteDelimiter);
                    });
                }
            }
        },
        {
            params: {
                nestedSuiteTitle: false
            },
            utils: {
                getCorrespondentTitles: function(experimentsPaths) {
                    return experimentsPaths.map(function(experimentPath) {
                        return experimentPath[experimentPath.length - 1];
                    });
                }
            }
        }
    ];

describe('Report settings.', function() {

    describe('Nested experiment titles and delimites', function() {

        // Running tests on various data sets
        dataSets.forEach(function(dataSet) {

            describe('Data set: `' + dataSet.name + '`.', function() {

                // Running tests on various settings
                settingsSets.forEach(function(settingsSet) {

                    var checkTitles = function(done) {

                        // var experimentsTitles = settingsSet.utils.getCorrespondentTitles(experimentsPaths);

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
                    };

                    describe('Settings: `' + JSON.stringify(settingsSet.params) + '`.', function() {

                        before(function(done) {

                            utils.getReport(dataSet.path, settingsSet.params, function(err, result) {

                                if (err) throw err;

                                reportRaw = result.rawStdout;
                                reportMessages = result.messages;
                                done();
                            });
                        });

                        if (settingsSet.params.nestedSuiteTitle) {

                            it.skip('should output nested titles if option `nestedSuiteTitle` is true', checkTitles);

                        } else {

                            it.skip('should output not nested titles if option `nestedSuiteTitle` is false', checkTitles);
                        }

                    });
                });
            });
        });
    });
});