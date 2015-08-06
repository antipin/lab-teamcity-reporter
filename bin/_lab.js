#!/usr/bin/env node

if (process.env.ROOT_SPAWN) {
    require('../test_runner/lib/cli').run();
}

else {

    var ChildProcess = require('child_process');

    ChildProcess.exec('rm -rf test_runner && cp -rf ./node_modules/lab test_runner', function (err) {

        if (err) throw err;

        process.env.ROOT_SPAWN = true;

        require('../test_runner/lib/cli').run();
    });

    process.on('exit', function (code) {

        ChildProcess.exec('rm -rf test_runner', function (err) {
            if (err) throw err;
        });
    });
}
