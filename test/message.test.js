var Lab       = require('lab'),
    Code      = require('code'),
    lab       = exports.lab = Lab.script(),

    describe  = lab.describe,
    before    = lab.before,
    it        = lab.it,
    expect    = Code.expect,

    utils = require('./utils'),
    reportMessages,
    reportRaw;

describe('Report messages', function() {

    before(function(done) {
        utils.getReport('./data-sets/with-fails.js', function(err, result) {

            if (err) throw err;

            reportRaw = result.rawStdout;
            reportMessages = result.messages;
            done();
        });
    });

    it('should starts with `##teamcity[` and ends with `]`', function(done) {
        reportMessages.forEach(function(message) {
            expect(message).to.startWith('##teamcity[').and.to.endWith(']');
        });
        done();
    });

    it('should have `name` attribute', function(done) {
        reportMessages.forEach(function(message) {
            expect(message).to.include(' name=\'');
        });
        done();
    });

    it('should have `flowId` attribute', function(done) {
        reportMessages.forEach(function(message) {
            expect(message).to.include(' flowId=\'');
        });
        done();
    });

    it('should have `timestamp` attribute to be a valid timestamp', function(done) {
        reportMessages.forEach(function(message) {
            var timestamp = utils.getMessageAttr('timestamp', message);
            expect(timestamp).to.be.not.empty();
            expect((new Date(timestamp).toString())).to.be.not.equal("Invalid Date");
        });
        done();
    });

    it('testStarted and testFailed messages should have `captureStandardOutput` attribute', function(done) {
        reportMessages.forEach(function(message) {
            var messageName = utils.getMessageName(message);
            if (messageName === 'testStarted' || messageName === 'testFailed') {
                expect(message).to.include(' captureStandardOutput=\'');
            }
        });
        done();
    });

    it('testFinished messages should have `duration` attribute', function(done) {
        reportMessages.forEach(function(message) {
            if (utils.getMessageName(message) === 'testFinished') {
                expect(message).to.include(' duration=\'');
            }
        });
        done();
    });

    it('without callbacks should be ignored', function(done) {
        var ignoredTestMessages = reportMessages.filter(function(message) {
            return (utils.getMessageAttr('name', message) === '3. should output todo reminder');
        });
        expect(ignoredTestMessages[0]).to.include('testStarted ');
        expect(ignoredTestMessages[1]).to.include('testIgnored ');
        expect(ignoredTestMessages[1]).to.include('no callback provided');
        done();
    });

    it('failed test message should be with testFailed name and have details attribute', function(done) {
        var failedTestMessages = reportMessages.filter(function(message) {
            return (utils.getMessageAttr('name', message) === '2. should fail');
        });
        expect(failedTestMessages[0]).to.include('testStarted ');
        expect(failedTestMessages[1]).to.include('testFailed ');
        expect(failedTestMessages[1]).to.include(' details=\'');
        done();
    });
});

describe('Report skipped messages', function() {

    before(function(done) {
        utils.getReport('./data-sets/with-no-todo.js', { dry: true }, function(err, result) {

            if (err) throw err;

            reportRaw = result.rawStdout;
            reportMessages = result.messages;
            done();
        });
    });

    it('every test should be skipped when running in --dry mode', function(done) {
        var startedMessages = reportMessages.filter(function(message) {
                return (utils.getMessageName(message) === 'testStarted');
            }),
            skippedMessages = reportMessages.filter(function(message) {
                return (utils.getMessageName(message) === 'testIgnored');
            });

        expect(skippedMessages).to.have.length(startedMessages.length);

        skippedMessages.forEach(function(message) {
            expect(utils.getMessageAttr('message', message)).to.be.equal('test skipped');
        });
        done();
    });
});
