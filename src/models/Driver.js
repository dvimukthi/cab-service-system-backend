let User = require('./User');

class Driver extends User {
    constructor(id, userId, userType, firstName, lastName, address, email, phoneNumber, status) {
        super(userId,userType, firstName, lastName, address, email, phoneNumber);
        this.id = id;
        this.status = status;
    }

    getId() {
        return this.id;
    }

    getStatus() {
        return this.status;
    }

    setStatus() {
        this.status = status;
    }

}