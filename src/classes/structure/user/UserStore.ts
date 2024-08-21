import { UserHold } from "./UserHold";
import { ServerHold } from "../server/ServerHold";

class UserStore {

    CurrentUsers: UserHold[] = [];
    MyServer: ServerHold;

    constructor(_server : ServerHold) {
        this.MyServer = _server;
    }

    public GenerateName() {
        return "Anonymous" + this.CurrentUsers.length.toString();
    }

    public AddUser(_user : UserHold) {
        this.CurrentUsers.push(_user);
    }

    public RemoveUser(_user : UserHold) {
        const userIndex = this.CurrentUsers.indexOf(_user);
        this.CurrentUsers.splice(userIndex, 1);
    }
    
}

export {UserStore}