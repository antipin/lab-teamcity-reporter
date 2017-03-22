var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

function renderOptions(options) {

    return Object
        .keys(options)
        .map((optionName) => `--${optionName} ${options[optionName]}`)
        .join(' ')

}

/**
 *
 * @param {Object} script
 * @param {Object} [settings]
 * @param {Function} callback
 */
exports.getReport = function prepareScript(testFilePath, options, callback) {

    callback = (typeof options === 'function') ? options : callback;
    options = (typeof options === 'function') ? {} : options;

    options.reporter = './src/teamcity';

    var filePathFull = path.resolve(__dirname, '../../node_modules/.bin/lab')
    var fullTestFilePath = path.resolve(__dirname, '../', testFilePath)

    fs.access(fullTestFilePath, function(err) {

        if (err) {

            return callback(err)

        }

        childProcess.exec(`${filePathFull} ${renderOptions(options)} ${fullTestFilePath}`, function (err, stdout, stderr) {

            callback(null, {
                rawStdout: stdout.toString(),
                messages: stdout.toString()
                    .split('\n')
                    .filter(line => line !== '')
            })

        });


    })

};

/**
 *
 * @param attrubute
 * @param message
 * @returns {boolean|*|string}
 */
exports.getMessageName = function getMessageName(message) {
    var match = message.match(/##teamcity\[(\w+)\s/);
    return (Array.isArray(match) && match[1]) || null;
};

/**
 *
 * @param attrubute
 * @param message
 * @returns {boolean|*|string}
 */
exports.getMessageAttr = function getMessageAttr(attrubute, message) {
    var attrRegExp = new RegExp(attrubute + "='((?:[^'\\|]|\\|.)*)'"),
        match = message.match(attrRegExp);
    return (Array.isArray(match) && match[1]) || '';
};

/**
 *
 * @param experiments
 * @param result
 * @returns {*|Array}
 */
exports.getExperimentsPaths = function getExperimentsPaths(experiments, result) {
    result = result || [];
    experiments.forEach(function(experiment) {
        result.push(exports.getExperimentFullPath(experiment));
        getExperimentsPaths(experiment.experiments, result);
    });
    return result;
};

/**
 *
 * @param {Object} experiment
 * @param {Array} result
 * @returns {Array<string>}
 */
exports.getExperimentFullPath = function getExperimentFullPath(experiment, result) {
    result = result || [];

    var title = experiment.title || '';

    result.unshift(title);

    return experiment.parent.title !== undefined ? getExperimentFullPath(experiment.parent, result) : result;
};
