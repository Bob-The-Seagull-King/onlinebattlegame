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
            const ResponseMsg = this.MyServer.Rooms.JoinRoom(data, this);
            this.MyServer.SendMessageToSocket(this, {message: ResponseMsg, room: data.room})
        });

        this.MySocket.on("send_message", (data ) => {
            const RoomVal = Number(data.room)

            if (this.GetRoom(RoomVal)) {
                this.GetRoom(RoomVal).AddMessage(this, data)
            }
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