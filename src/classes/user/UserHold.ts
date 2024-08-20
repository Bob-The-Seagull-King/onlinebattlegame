import { SocketHold } from "../socket/SocketHold";
import { UserStore } from "./UserStore";

interface IUserConstruct {
    store: UserStore;
    name?: String;
    type?: Number;
}

class UserHold {

    MySocket: SocketHold;
    Name: String;
    Type: Number;
    Store: UserStore;

    constructor(_user : IUserConstruct) {
        this.Store = _user.store;
        this.Type = _user.type? _user.type : 0;
        this.Name = _user.name? _user.name : this.Store.GenerateName();
    }

    public AssignSocket(_socket : SocketHold) {
        this.MySocket = _socket;
    }
    
}

export {UserHold, IUserConstruct}