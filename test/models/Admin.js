var assert = require('assert');

var Admin = require('../../src/models/Admin');
// var User = require('../../src/models/User');

describe('test Admin model', ()=>{
    it('should create a new admin user', () => {
        var admin = new Admin(null, 1, 'Admin', 'testFirst'
        , 'testLast', 'address', 'admin@gmail.com', '+947779090');
        assert.equal(admin.getFirstName(), 'testFirst');
    });
});

