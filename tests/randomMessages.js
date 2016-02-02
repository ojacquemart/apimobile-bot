var should = require('should');
var rndMessages = require('../lib/randomMessages.js');

describe('randomMessages', function() {

    it('should generate a random message for an existing user', function() {
        should.exist(rndMessages.getRandomMessage('olivier'));
    });

    it('should get an undefined message for a non existing user', function() {
        should.not.exist(rndMessages.getRandomMessage('foo'));
    });
});
