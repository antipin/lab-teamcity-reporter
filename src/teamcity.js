var tsm = require('teamcity-service-messages'),
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

    this.suitesStack = [];
};

/**
 * Fires on every test
 * @param {Object} test
 */
internals.Reporter.prototype.test = function (test) {

    this.reportTestSuitesEdges(test.path);

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

        var skippedMessage = test.todo ? 'no callback provided' : 'test skipped';

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

    while (this.suitesStack.length > 0) {

        var suitesStack = this.suitesStack.pop();

        this.log('testSuiteFinished', { name: this.buildSuiteTitle(suitesStack.path) });
    }

    if (notebook.coverage) {

        this.log('buildStatisticValue', { key: 'CodeCoverageAbsLTotal', value: notebook.coverage.sloc });
        this.log('buildStatisticValue', { key: 'CodeCoverageAbsLCovered', value: notebook.coverage.hits });

    }
};

/**
 * Logs `testSuiteStarted/testSuiteFinished` messages when necessary
 */
internals.Reporter.prototype.reportTestSuitesEdges = function(path) {

    path = this.appendRootWrapperIfNecessary(path);

    this.closePreviousTestSuiteIfNecessary(path)
        .openNewTestSuiteIfNecessary(path);
};

/**
 * Logs `testSuiteStarted` messages when necessary
 * @param path
 * @returns {internals.Reporter}
 */
internals.Reporter.prototype.openNewTestSuiteIfNecessary = function(path) {

    var lastStackedSuite = this.suitesStack[this.suitesStack.length - 1],
        currentStackedSuite = new StackedSuite(path);

    if (this.suitesStack.length === 0 || lastStackedSuite.id !== currentStackedSuite.id) {

        this.log('testSuiteStarted', { name: this.buildSuiteTitle(path) });

        this.suitesStack.push(currentStackedSuite);
    }

    return this;
};

/**
 * Logs `testSuiteFinished` messages when necessary
 * @param path
 * @returns {internals.Reporter}
 */
internals.Reporter.prototype.closePreviousTestSuiteIfNecessary = function(path) {

    var lastStackedSuite = this.suitesStack[this.suitesStack.length - 1],
        currentStackedSuite = new StackedSuite(path),
        shouldClose = (this.suitesStack.length > 0 &&
                        lastStackedSuite.id !== currentStackedSuite.id &&
                        currentStackedSuite.level <= lastStackedSuite.level);

    if (shouldClose) {

        while (lastStackedSuite && lastStackedSuite.level >= currentStackedSuite.level) {

            this.log('testSuiteFinished', { name: this.buildSuiteTitle(this.suitesStack.pop().path) });

            lastStackedSuite = this.suitesStack[this.suitesStack.length - 1];
        }
    }

    return this;
};

/**
 * If we have root level tests (not wrapped inside describe()/experiment() function) we should append empty string
 * to all paths of every test case
 * @returns {Array}
 */
internals.Reporter.prototype.appendRootWrapperIfNecessary = function(path) {

    path = path.slice(0);

    // If we have root level tests not wrapped inside experiment
    if (path.length === 0) {
        this.hasNoRootWrapper = true;
    }

    if (this.hasNoRootWrapper) {
        path.unshift('');
    }

    return path;
};

/**
 * Logs message
 * @param {string} message
 * @param {Object} args Message arguments
 * @returns {string}
 */
internals.Reporter.prototype.log = function(message, args) {
    this.report((new tsm.Message(message, args)).toString() + '\n');
};

/**
 * Builds suite title for testSuiteStart/testSuiteFinished messages
 * @param path
 * @returns {*}
 */
internals.Reporter.prototype.buildSuiteTitle = function(path) {

    return path[path.length - 1];

};

/**
 * Creates a StackedSuite
 * @param path
 * @constructor
 */
var StackedSuite = function(path) {
    this.path = path.slice(0);
    this.id = this.path.toString();
    this.level = this.path.length;
};
