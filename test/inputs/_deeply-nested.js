var Lab = require('lab'),
    Code = require('code'),
    lab = exports.lab = Lab.script(),
    testCallback = function(done) {
        Code.expect(true).to.be.true();
        done();
    };

lab.test('ex 0, test 1',testCallback);

lab.experiment('* 1 *', function() {

    lab.test('ex 1, test 1',testCallback);
    lab.test('ex 1, test 2',testCallback);

    lab.experiment('* 1.1 *', function() {

        lab.test('ex 1.1, test 1',testCallback);

        lab.experiment('* 1.1.1 *', function() {

            lab.test('ex 1.1.1, test 1',testCallback);
            lab.test('ex 1.1.1, test 2',testCallback);
        });

        lab.experiment('* 1.1.2 *', function() {

            lab.test('ex 1.1.2, test 1',testCallback);
            lab.test('ex 1.1.2, test 2',testCallback);
           
            lab.experiment('* 1.1.2.1 *', function() {

                lab.test('ex 1.1.2.1, test 1',testCallback);
                lab.test('ex 1.1.2.1, test 2',testCallback);

                lab.experiment('* 1.1.2.1.1 *', function() {

                    lab.test('ex 1.1.2.1., test 1',testCallback);
                    lab.test('ex 1.1.2.1.1, test 2',testCallback);
                })
            })
        });
    });

    lab.experiment('* 1.2 *', function() {

        lab.experiment('* 1.2.1 *', function() {

            lab.test('ex 1.2.1, test 1',testCallback);
            lab.test('ex 1.2.1, test 2',testCallback);
            lab.test('ex 1.2.1, test 3',testCallback);
        });
        
        lab.experiment('* 1.2.2 *', function() {

            lab.test('ex 1.2.2, test 1',testCallback);
            lab.test('ex 1.2.2, test 2',testCallback);
        });
    });
});
