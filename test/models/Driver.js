var assert = require('assert');

var Driver = require('../../src/models/Driver');

describe('test Driver model', ()=>{
    it('should create a new Driver', () => {
        var driver = new Driver(null,1, '', 
                'fName', 'lName','address', 'cs@gmail.com',
                '12233',0,1);
        assert.equal(driver.getFirstName(), 'fName');
        assert.equal(driver.getUserType(), 'DRIVER');
    });
});
