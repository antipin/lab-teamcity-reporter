var Lab       = require('lab'),
    _Lab      = require('../test_runner/lib'),
    Code      = require('code'),
    lab       = exports.lab = _Lab.script(),

    describe  = lab.describe,
    before    = lab.before,
    it        = lab.it,
    expect    = Code.expect,

    dataSets  = require('./data-sets').getDataSetsByTags('structure'),

    utils = require('./utils'),
    reportMessages,
    reportRaw;

// Running tests on various data sets
dataSets .forEach(function(dataSet) {

    describe('Report structure.' , function() {

        describe('Data set: `' + dataSet.name + '`.', function() {

            before(function(done) {
                utils.getReport(require(dataSet.path).lab, function(result) {
                    reportRaw = result.raw;
                    reportMessages = result.messages;
                    done();
                });
            });

            it('report should be a string and not be empty', function(done) {
                expect(reportRaw).to.be.a.string().and.not.to.be.empty();
                done();
            });

            it('suites should have valid nesting', function(done) {

                var suitesStack = [];

                reportMessages.forEach(function(message) {

                    if (utils.getMessageName(message) === 'testSuiteStarted') {
                        suitesStack.push(utils.getMessageAttr('name', message));
                    }

                    if (utils.getMessageName(message) === 'testSuiteFinished') {

                        var latestSuitesStackItem = suitesStack[suitesStack.length - 1];

                        if (latestSuitesStackItem === utils.getMessageAttr('name', message)) {

                            expect(suitesStack.length).to.be.above(0);

                            suitesStack.pop();
                        }
                    }
                });

                expect(suitesStack).to.have.length(0);
                done();
            });

            it('all started tests should be finished or ignored', function(done) {

                var messagesStack = [];

                reportMessages.forEach(function(message) {

                    var messageName = utils.getMessageName(message);

                    if (messageName === 'testStarted') {
                        messagesStack.push(utils.getMessageAttr('name', message));
                    }

                    if (messageName === 'testFinished' || messageName === 'testIgnored') {

                        var latestMessagesStackItem = messagesStack[messagesStack.length - 1];

                        if (latestMessagesStackItem === utils.getMessageAttr('name', message)) {

                            expect(messagesStack.length).to.be.above(0);

                            messagesStack.pop();
                        }
                    }
                });

                expect(messagesStack).to.have.length(0);
                done();
            });
        });
    });
});