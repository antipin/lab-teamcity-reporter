var Lab = require('lab');

exports.getReport = function prepareScript(script, settings, callback) {

    callback = (typeof settings === 'function') ? settings : callback;
    settings = (typeof settings === 'function') ? {} : settings;

    settings.reporter = './src/teamcity.js';

    Lab.report(script, settings, function (err, code, output) {

        if (err) throw err;

        var messages = output.split('\n').filter(function(message) {
            return (message.length > 0);
        });

        //console.log(output);

        callback({
            raw: output,
            messages: messages
        });
    });
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
