let user = require('./User');

class Admin extends User {
    constructor(id, userId, userType, firstName, lastName, address, email, phoneNumber){
        super(userId,userType, firstName, lastName, address, email, phoneNumber);
        this.id = id;
    }

    getId() {
        return this.id;
    }
}