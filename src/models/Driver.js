let User = require('./User');

class Driver extends User {
    constructor(id, userId, userType, firstName, lastName, address, email, phoneNumber, status, branch) {
        super(userId,userType, firstName, lastName, address, email, phoneNumber);
        this.id = id;
        this.status = status;
        this.branch = branch;
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

    getBranch() {
        return this.branch;
    }

    setBranch(branch) {
        this.branch = branch;
    }

}

module.exports = Driver;