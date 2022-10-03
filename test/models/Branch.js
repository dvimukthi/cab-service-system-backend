var assert = require('assert');

var Branch = require('../../src/models/Branch');

describe('test Branch model', ()=>{
    it('should create a new Branch', () => {
        var branch = new Branch(null, 'Kandy');
        assert.equal(branch.getLocation(), 'Kandy');
    });
});
