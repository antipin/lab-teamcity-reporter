var TAGS = {
    'structure': 'structure',
    'settings':  'settings',
    'message':   'messages'
};

exports.dataSets = [
    {
        file: '1-level-nested',
        tags: [ TAGS.structure, TAGS.settings ]
    },
    {
        file: 'deeply-nested',
        tags: [ TAGS.structure, TAGS.settings ]
    },
    {
        file: 'flat',
        tags: [ TAGS.structure, TAGS.settings ]
    },
    {
        file: 'with-fails',
        tags: [ TAGS.message ]
    },
    {
        file: 'with-no-todo',
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
