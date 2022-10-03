var assert = require('assert');

var Credentials = require('../../src/models/Credentials');

describe('test Credentials model', ()=>{
    it('should create a new Credentials', () => {
        var credentials = new Credentials(null, 'testUs', 'testPw',1);
        assert.equal(credentials.getUsername(), 'testUs');
    });
});
