var assert = require('assert');

var Trip = require('../../src/models/Trip');

describe('test Trip model', ()=>{
    it('should create a new Trip', () => {
        var trip = new Trip(null,'pickupStreet', 'pickupCity', 
                'dropStreet', 'dropCity',1, 1,0,0,1,100);
        assert.equal(trip.getPickupstreet(), 'pickupStreet');
        assert.equal(trip.getConfirmedStatus(), 0);
    });
});
