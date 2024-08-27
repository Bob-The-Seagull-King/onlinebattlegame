import { UserHold } from "../user/UserHold";
import { ServerHold } from "../server/ServerHold";
import { RoomHold } from "../room/RoomHold";
import { SelectedAction } from "../../../global_types";

class SocketHold {

    MySocket;   // The socket object itself
    MyID;       // The ID of the socket

    MyUser: UserHold;       // The user associated with this socket
    MyServer: ServerHold;   // The server this socket is a part of
    
    MyRooms: RoomHold[] = [];   // List of rooms a socket has joined

    /**
     * Simple constructor
     * @param socket The socket object itself
     * @param server The server this socket is a member of
     */
    constructor(socket, server : ServerHold) {
        this.MySocket = socket;
        this.MyID = socket.id;
        console.log(`User Connected: ${socket.id}`);
        this.MyServer = server;
        this.SetSocketAction();
    }

    /**
     * Sets the behaviour of the socket when receiving
     * various messages from the user.
     */
    private SetSocketAction() {
        this.MySocket.on("join_room", (data) => {
            // Attempt to join a room
            const ResponseMsg = this.MyServer.Rooms.JoinRoom(this, data);
            this.MyServer.SendConnectionToSocket(this, ResponseMsg)
        });

        this.MySocket.on("send_message", (data) => {
            // Send a message from this socket to a specified room
            const RoomVal = Number(data.room)
            const Room = this.GetRoom(RoomVal)
            if (Room) { Room.AddMessage(this, data) }
        });

        this.MySocket.on("send_option", (data) => {
            // Send a response to the room providing a chosen SelectedAction
            const RoomVal = Number(data.room)
            const Room = this.GetRoom(RoomVal)
            const Action : SelectedAction = data.option;
            if (Room) {
                Room.SendOptions(Action, this.MyUser.MySocket.MyID + "position" + data.position);
            }
        });

        this.MySocket.on('disconnect', ( ) => {
            // Disconnect and discard this socket from the server
            this.MyServer.DisconnectSocket(this)
        });
    }

    /**
     * Sets this socket's associated user
     * @param _user the User object to add
     */
    public AssignUser(_user : UserHold) {
        this.MyUser = _user;
    }

    /**
     * Attempts to return a RoomHold that this socket is a
     * member of, based on a provided room ID.
     * @param _room the ID value of the room
     * @returns null or the RoomHold with a matching ID
     */
    private GetRoom(_room : Number) {
        return this.MyRooms.find(room => room.MyID === _room)
    }
    
}

export {SocketHold}