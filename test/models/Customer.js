var assert = require('assert');

var Customer = require('../../src/models/Customer');

describe('test Customer model', ()=>{
    it('should create a new Customer', () => {
        var customer = new Customer(null,1, 'CUSTOMER', 
                'fName', 'lName','address', 'cs@gmail.com',
                '12233',0);
        assert.equal(customer.getFirstName(), 'fName');
        assert.equal(customer.getUserType(), 'CUSTOMER');
    });
});
