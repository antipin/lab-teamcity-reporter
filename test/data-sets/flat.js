var Lab = require('lab'),
    Code = require('code'),
    lab = exports.lab = Lab.script(),
    testCallback = function(done) {
        Code.expect(true).to.be.true();
        done();
    };

lab.test('ex A, test 1', testCallback);
lab.test('ex A, test 2', testCallback);
lab.test('ex B, test 1', testCallback);
lab.test('ex C, test 1', testCallback);
lab.test('ex C, test 2', testCallback);
lab.test('ex D, test 1', testCallback);
lab.test('ex D, test 2', testCallback);
lab.test('ex E, test 1', testCallback);
lab.test('ex E, test 2', testCallback);
lab.test('ex F, test 1', testCallback);
lab.test('ex F, test 2', testCallback);
lab.test('ex G, test 1', testCallback);
lab.test('ex G, test 2', testCallback);
lab.test('ex G, test 3', testCallback);
lab.test('ex H, test 1', testCallback);
lab.test('ex H, test 2', testCallback);
lab.test('ex H, test 3', testCallback);
lab.test('ex I, test 1', testCallback);
lab.test('ex I, test 2', testCallback);