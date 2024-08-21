import { UserHold } from "../user/UserHold";
import { ServerHold } from "../server/ServerHold";
import { RoomHold } from "../room/RoomHold";

class SocketHold {

    MySocket;
    MyID;
    MyUser: UserHold;
    MyServer: ServerHold;
    MyRooms: RoomHold[] = [];

    constructor(socket, server : ServerHold) {
        this.MySocket = socket;
        this.MyID = socket.id;
        console.log(`User Connected: ${socket.id}`);
        this.MyServer = server;
        this.SetSocketAction();
    }

    private SetSocketAction() {
        this.MySocket.on("join_room", (data) => {
            const ResponseMsg = this.MyServer.Rooms.JoinRoom(this, data);
            this.MyServer.SendConnectionToSocket(this, ResponseMsg)
        });

        this.MySocket.on("send_message", (data) => {
            const RoomVal = Number(data.room)
            const Room = this.GetRoom(RoomVal)
            if (Room) { Room.AddMessage(this, data) }
        });

        this.MySocket.on('disconnect', ( ) => {
            this.MyServer.DisconnectSocket(this)
        });
    }

    public AssignUser(_user : UserHold) {
        this.MyUser = _user;
    }

    private GetRoom(_room : Number) {
        return this.MyRooms.find(room => room.MyID === _room)
    }
    
}

export {SocketHold}