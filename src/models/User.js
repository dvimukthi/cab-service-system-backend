/*jshint esversion: 6 */

class User {
    constructor(id, userType, firstName, lastName, address, email, phoneNumber) {
        this.id = id;
        this.userType = userType;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }
    
    getUserType() {
        return this.userType;
    }
    
    setUserType(userType) {
        this.userType = userType;
    }

    getFirstName() {
        return this.firstName;
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }

    getLastName() {
        return this.lastName;
    }

    setLastName(lastName) {
        this.lastName = lastName;
    }

    getAddress() {
        return this.address;
    }

    setAddreass(address){
        this.address = address;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getPhoneNumber() {
        return this.phoneNumber;
    }

    setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}

module.exports =  User;