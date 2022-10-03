var assert = require('assert');
const { resolve } = require('path');

var {getCustomers, getCustomersById} = require('../../src/services/data_service');

describe('test All data access services', ()=>{
    it('should pull all customers in system', async () => {
        var customers = await getCustomers();
        assert.equal(customers.length > 0, true);
    });
    it('should pull customers by id', async () => {
        var customer = await getCustomersById(1);
        assert.equal(customer.getId(),  1);
    });
});
