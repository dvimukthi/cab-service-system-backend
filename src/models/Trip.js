class Trips {
    constructor(id, pickupStreet, pickupCity, dropStreet, dropCity, driverId, vehicleId, customerId, confirmed) {
        this.id = id;
        this.pickupStreet = pickupStreet;
        this.pickupCity = pickupCity;
        this.dropStreet = dropStreet;
        this.dropCity = dropCity;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.customerId = customerId;
        this.confirmed = confirmed;
    }

    getId(){
        return this.id;
    }
    
    getPickupstreet() {
        return this.pickupStreet;
    }

    setPickupstreet(pickupStreet) {
        this.pickupStreet = pickupStreet;
    }

    getPickupCity() {
        this.pickupCity;
    }

    setPickupCity(pickupCity) {
        this.pickupCity = pickupCity;
    }


    getDropStreet() {
        return this.dropStreet;
    }
    
    setDropCity(dropCity) {
        this.dropCity = dropCity;
    }


    getDropCity() {
        this.dropCity;
    }

    getConfirmedStatus() {
        return this.confirmed;
    }

    setConfirmedStatus(confirmed) {
        this.confirmed = confirmed;
    }


    setDriverId() {
        this.driverId = driverId;
    }

    getDriverId() {
        return this.driverId;
    }

    getVehicleId() {
        return this.vehicleId;
    }

    setVehicleId(vehicleid) {
        this.vehicleId = vehicleid;
    }

    
    getCustomerId() {
        return this.customerId;
    }

    setCustomerId(customerId) {
        return this.customerId = customerId;
    }

}