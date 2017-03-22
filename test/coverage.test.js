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

describe('Report code coverage', function() {

    before(function(done) {
        utils.getReport('./data-sets/with-fails.js', { coverage: true }, function(err, result) {

            if (err) throw err;

            reportRaw = result.rawStdout;
            reportMessages = result.messages;
            done();
        });
    });

    it('should have buildStatisticValue message with CodeCoverageAbsLTotal param equals to number`]`', function(done) {

        var buildStatisticValueMessages = reportMessages.filter(message => {

            if (utils.getMessageName(message) === 'buildStatisticValue' &&
                utils.getMessageAttr('key', message) === 'CodeCoverageAbsLTotal') {

                return utils.getMessageAttr('value', message).match(/\d+/)

            }

            return false

        })

        expect(buildStatisticValueMessages).to.have.length(1);

        done();
    });

    it('should have buildStatisticValue message with CodeCoverageAbsLCovered param equals to number`]`', function(done) {

        var buildStatisticValueMessages = reportMessages.filter(message => {

            if (utils.getMessageName(message) === 'buildStatisticValue' &&
                utils.getMessageAttr('key', message) === 'CodeCoverageAbsLCovered') {

                return utils.getMessageAttr('value', message).match(/\d+/)

            }

            return false

        })

        expect(buildStatisticValueMessages).to.have.length(1);

        done();
    });
});
