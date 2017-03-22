var TAGS = {
    'structure': 'structure',
    'message':   'messages'
};

exports.dataSets = [
    {
        file: '1-level-nested.js',
        tags: [ TAGS.structure ]
    },
    {
        file: 'deeply-nested.js',
        tags: [ TAGS.structure ]
    },
    {
        file: 'flat.js',
        tags: [ TAGS.structure ]
    },
    {
        file: 'with-fails.js',
        tags: [ TAGS.message ]
    },
    {
        file: 'with-no-todo.js',
        tags: [ TAGS.message ]
    }
];

exports.getDataSetsByTags = function(/*tag1, tag2, tag3 ... tagN */) {

    var tags = Array.prototype.slice.call(arguments, 0);

    return exports.dataSets
        .filter(function(dataSet) {
            return tags.some(function(tag) {
                return dataSet.tags.indexOf(tag) !== -1;
            });
        })
        .map(function(dataSet) {
            return {
                name: dataSet.file.replace(/-/g, ' ').toUpperCase(),
                path: './data-sets/' + dataSet.file
            }
        });
};
