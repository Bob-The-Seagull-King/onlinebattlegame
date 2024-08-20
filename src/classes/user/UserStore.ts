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
        let i = 0;
        for (i = 0; i < this.CurrentUsers.length; i++) {
            if (this.CurrentUsers[i] == _user) {
                this.CurrentUsers.splice(i, 1);
                break;
            }
        }
    }
    
}

export {UserStore}