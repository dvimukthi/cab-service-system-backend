class Branch {
    constructor(id, location, address= '', email='', phone = '', driversCount = 0, vehicleCount = 0) {
        this.id = id;
        this.location = location;
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.driversCount = driversCount;
        this.vehicleCount = vehicleCount;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }
    getLocation() {
        return this.location;
    }

    setLocation(location) {
        this.location = location;
    }

    getAddress() {
        return this.address;
    }

    setAddress(address) {
        this.address = address;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getPhone() {
        return this.phone;
    }

    setPhone(phone) {
        this.phone = phone;
    }

    getDriversCount() {
        return this.driversCount;
    }

    setDriversCount(driversCount) {
        this.driversCount = driversCount;
    }  

    getVehicleCount() {
        return this.vehicleCount;
    }

    setVehicleCount(vehicleCount) {
        this.vehicleCount = vehicleCount;
    }  
}

module.exports = Branch;