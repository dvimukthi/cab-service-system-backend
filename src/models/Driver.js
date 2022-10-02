let User = require('./User');

class Driver extends User {
    constructor(id, userId, userType, firstName, lastName, address, email, 
        phoneNumber, status, branch, vehicleId, vehicle=null) {
        super(userId,userType, firstName, lastName, address, email, phoneNumber);
        this.userType = 'DRIVER';
        this.id = id;
        this.status = status;
        this.branch = branch;
        this.vehicleId = vehicleId;
        this.vehicle = vehicle;
        this.userId = userId;

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

    getVehicleId() {
        return this.vehicleId;
    }

    setVehicleId(vehicleId) {
        this.vehicleId = vehicleId;
    }

    getUserId() {
        return this.userId;
    }

    setUserId(userId) {
        this.userId = userId;
    }

    getVehicle() {
        return this.vehicle;
    }

    setVehicle(vehicle){
        this.vehicle = vehicle;
    }

}   

module.exports = Driver;