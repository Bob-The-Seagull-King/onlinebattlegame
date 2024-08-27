import { SocketHold } from "../socket/SocketHold";
import { UserStore } from "./UserStore";

/**
 * Interface of the user constructor
 */
interface IUserConstruct {
    store   : UserStore;   // The storage which holds this User
    name?   : String;      // The name of the User
    type?   : Number;      // The User's type
}

class UserHold {

    MySocket    : SocketHold;   // The socket associated with this user
    Name        : String;       // The name of the User
    Type        : Number;       // The User's type
    Store       : UserStore;    // The sotrage which holds this User

    /**
     * Simple constructor
     * @param _user the interface of User information
     */
    constructor(_user : IUserConstruct) {
        this.Store = _user.store;
        this.Type = _user.type? _user.type : 0;
        this.Name = _user.name? _user.name : this.Store.GenerateName();
    }

    /**
     * Sets the User's socket to a given object
     * @param _socket the socket to associated with
     */
    public AssignSocket(_socket : SocketHold) {
        this.MySocket = _socket;
    }
    
}

export {UserHold, IUserConstruct}