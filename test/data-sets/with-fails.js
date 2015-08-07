var Lab = require('lab'),
    Code = require('code'),
    lab = exports.lab = Lab.script();

lab.experiment('experiment 1', function() {

    lab.test('1. should be ok', function(done) {
        Code.expect(true).to.be.true();
        done();
    });

    lab.test('1. should be ok', function(done) {
        Code.expect(true).to.be.true();
        done();
    });

    lab.test('2. should fail', function(done) {
        Code.expect(false).to.be.true();
        done();
    });

    lab.test('3. should output todo reminder');
});
