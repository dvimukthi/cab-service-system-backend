class Trip {
    constructor(id, pickupStreet, pickupCity, dropStreet, dropCity, driverId, 
        vehicleId, customerId, confirmed, customerName, distance=0, branch=1, cost=0.00) {
        this.id = id;
        this.pickupStreet = pickupStreet;
        this.pickupCity = pickupCity;
        this.dropStreet = dropStreet;
        this.dropCity = dropCity;
        this.driverId = driverId;
        this.vehicleId = vehicleId;
        this.customerId = customerId;
        this.confirmed = confirmed;
        this.customerName = customerName;
        this.distance  = distance;
        this.branch = branch;
        this.cost = cost;
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
        return this.pickupCity;
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
        return this.dropCity;
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

    getCustomerName() {
        return this.customerName;
    }

    setCustomerName(customerName) {
        this.customerName = customerName;
    }

    getDistance(){
        return this.distance;
    }

    setDistance(distance) {
        this.distance = distance;
    }

    
    getBranch(){
        return this.branch;
    }

    setBranch(branch) {
        this.branch = branch;
    }

    getCost() {
        return this.cost;
    }

    setCost(cost) {
        this.cost = cost;
    }

}

module.exports=Trip;