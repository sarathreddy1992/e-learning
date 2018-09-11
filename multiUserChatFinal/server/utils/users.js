
// addUser(id, name, room)
// removeUser(id)
// getUser(id)
// getUserList(room)

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // return user that was removed
        var user = this.users.filter((user) => {
            return user.id === id;
        })[0];

        if(user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser (id) {
        var user = this.users.filter((user) => {
            return user.id === id;
        })[0];

        return user;
    }

    getUserList (room) {
        var users = this.users.filter((user) => {
            return user.room === room;
        });

        var namesArray = users.map((user) => {
            return user.name;
        });

        return namesArray
    }
}

module.exports = {Users};