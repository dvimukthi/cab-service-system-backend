/*jshint esversion: 6 */
let User = require("./User");

class Customer extends User {
  constructor(
    id,
    userId,
    userType,
    firstName,
    lastName,
    address,
    email,
    phoneNumber,
    tripCount
  ) {
    super(userId, userType, firstName, lastName, address, email, phoneNumber);
    this.id = id;
    this.userId = userId;
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
    return this.userId;
  }
  setUserId(userId) {
    console.log("Setting", userId);
    super.setId(userId);
    this.userId = userId;
    console.log("Setting", super.getId());
  }
}

module.exports = Customer;
