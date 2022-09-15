/*jshint esversion: 6 */
let User = require('./User');

class Customer extends User {
    constructor(id, userId, userType, firstName, lastName, address, email, phoneNumber,tripCount){
        super(userId,userType, firstName, lastName, address, email, phoneNumber);
        this.id = id;
        this.tripCount = tripCount;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }

    getTripCount() {
        return this.tripCount;
    }

    setTripCount(tripCount) {
        this.tripCount = tripCount;
    }

    getUserId() {
        return super.getId();
    }
    setUserId(userId) {
        super.setId(userId);
    }
}

module.exports =  Customer;