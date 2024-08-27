import { UserHold } from "./UserHold";
import { ServerHold } from "../server/ServerHold";

class UserStore {

    CurrentUsers    : UserHold[] = [];  // Collection of all Users
    MyServer        : ServerHold;       // The server this store contains information for

    /**
     * Simple constructor
     * @param _server the Server which this store exists for
     */
    constructor(_server : ServerHold) {
        this.MyServer = _server;
    }

    /**
     * Creates a simple identifier for a User
     * @returns string new name of a User
     */
    public GenerateName() {
        return "Anonymous" + this.CurrentUsers.length.toString();
    }

    /**
     * Given a user, add it to the storage
     * @param _user the User to add
     */
    public AddUser(_user : UserHold) {
        this.CurrentUsers.push(_user);
    }

    /**
     * Given a user, discard it from this storage collection
     * @param _user the User to remove
     */
    public RemoveUser(_user : UserHold) {
        const userIndex = this.CurrentUsers.indexOf(_user);
        this.CurrentUsers.splice(userIndex, 1);
    }
    
}

export {UserStore}