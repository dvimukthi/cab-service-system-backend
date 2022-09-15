class Credentials {
    constructor(id, username, password, userId){
        this.id =id;
        this.username = username;
        this.password = password;
        this.userId = userId;
    }

    getId() {
        return this.userId;
    }

    getUsername(){
        return this.username;
    }

    setUsername(userName) {
        this.username = userName;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password) {
        this.password = password;
    }

    getUserId() {
        return this.userId;
    }

}