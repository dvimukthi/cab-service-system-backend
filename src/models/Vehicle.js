class vehicle {
    constructor(id, name, type, numberPlate, seats, price, branch_id) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.numberPlate = numberPlate;
        this.seats = seats;
        this.price = price;
        this.branchId = branchId;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }
    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    getNumberPlate() {
        return this.numberPlate;
    }

    setNumberPlate(numberPlate) {
        this.numberPlate = numberPlate;
    }
    getSeats() {
        return this.seats;
    }

    setSeats(seets) {
        this.seats = seats;
    }
    getPrice() {
        return this.price;
    }

    setPrice(price) {
        this.price = price;
    }
    getBranchId() {
        return this.brancId;
    }
}