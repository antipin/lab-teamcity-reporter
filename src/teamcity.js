var SUITES_DELIMITER = ' -> ',
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

    var suiteTitle = test.path.join(SUITES_DELIMITER),
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
 * Logs string in a special format acceptable by teamcity
 * See [TeamCity reporting tests]{@link https://confluence.jetbrains.com/display/TCD65/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-ReportingTests}
 * @param {string} title
 * @param {Object} params
 */
internals.Reporter.prototype.log = function(title, params) {

    var attrs = Object.keys(params).map(function(paramName) {
        return [ paramName, "'" + this.escapeString(params[paramName]) + "'" ].join('=');
    }, this);

    console.log("##teamcity[" + title + " " + attrs.join(' ') + "]");
};

/**
 * @param {string} value
 * @returns {string} escaped string
 */
internals.Reporter.prototype.escapeString = function(value) {

    if (!value) return '';

    return value.toString()
        .replace(/\|/g, "||")
        .replace(/\n/g, "|n")
        .replace(/\r/g, "|r")
        .replace(/\[/g, "|[")
        .replace(/\]/g, "|]")
        .replace(/\u0085/g, "|x")
        .replace(/\u2028/g, "|l")
        .replace(/\u2029/g, "|p")
        .replace(/'/g, "|'");
};
