var tsm = require('teamcity-service-messages'),
    SUITE_TITLE_DELIMITER = ' -> ',
    internals = {};

/**
 * Creates a Lab TeamCity Reporter
 * @class
 */
exports = module.exports = internals.Reporter = function (options) {

    this.settings = options;
};

/**
 * Fires on tests start
 * @param {Object} notebook
 */
internals.Reporter.prototype.start = function (notebook) {

    this.previousSuiteTitle = null;
};

/**
 * Fires on every test
 * @param {Object} test
 */
internals.Reporter.prototype.test = function (test) {

    var suiteTitle = test.path.join(SUITE_TITLE_DELIMITER),
        skippedMessage;

    if (this.previousSuiteTitle !== suiteTitle) {

        if (this.previousSuiteTitle) {

            this.log('testSuiteFinished', { name: this.previousSuiteTitle });
        }

        this.previousSuiteTitle = suiteTitle;

        this.log('testSuiteStarted', { name: suiteTitle });
    }

    this.log('testStarted', { name: test.relativeTitle, captureStandardOutput: true });

    if (test.err) {
        this.log('testFailed', {
            name: test.relativeTitle,
            messge: test.err.message,
            details: test.err.stack,
            captureStandardOutput: true
        });
    }

    if (test.skipped || test.todo) {

        skippedMessage = test.todo ? 'no callback provided' : 'test skipped';

        this.log('testIgnored', { name: test.relativeTitle, message: skippedMessage });

    } else {

        this.log('testFinished', { name: test.relativeTitle, duration: test.duration });
    }
};

/**
 * Fires on tests complete
 * @param {Object} notebook
 */
internals.Reporter.prototype.end = function (notebook) {

    if (this.previousSuiteTitle) {

        this.log('testSuiteFinished', { name: this.previousSuiteTitle });
    }
};

/**
 *
 * @param {string} message
 * @param {Object} args Message arguments
 * @returns {string}
 */
internals.Reporter.prototype.log = function(message, args) {
    this.report(new tsm.Message(message, args).toString() + '\n');
};
