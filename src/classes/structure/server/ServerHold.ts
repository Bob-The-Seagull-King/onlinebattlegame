const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
import { UserStore } from "../user/UserStore";
import { RoomStore } from "../room/RoomStore";
import { SocketHold } from "../socket/SocketHold";
import { CONNECTION } from "../../../resources/connection-routes";
import { UserSocketFactory } from "../../../factories/UserSocketFactory";

class ServerHold {

    server: any;
    MainServer: any;
    Users: UserStore;
    Rooms: RoomStore;
    Sockets: SocketHold[] =[];
    PortNum: number = CONNECTION.SERVER_PORT;

    constructor() {
        this.server = http.createServer(app);
        
        this.MainServer = new Server(this.server, {
            cors: {
              origin: CONNECTION.SERVER_CONNECTION,
              methods: ["GET", "POST"],
            },
          });

        this.Users = new UserStore(this);
        this.Rooms = new RoomStore(this);

        this.SetupServer();
    }

    private SetupServer() {
        this.MainServer.on("connection", (socket) => {
            UserSocketFactory.BuildUserAndSocket(socket, this);
        });
        
        this.MainServer.listen(this.PortNum, () => {
            console.log("SERVER IS RUNNING");
        });
    }
    
    public NewSocket(socket) {
        this.Sockets.push(socket);
    }

    public SendMessageToSocket(_socket : SocketHold, _msg : any) {
        this.MainServer.to(_socket.MySocket.id).emit('server_message', _msg);
    }

    public DisconnectSocket(_socket : SocketHold) {
        this.Rooms.RemoveSocket(_socket);
        this.Users.RemoveUser(_socket.MyUser);
        let i = 0;
        for (i = 0; i < this.Sockets.length; i++) {
            if (this.Sockets[i] == _socket) {
                this.Sockets.splice(i, 1);
                break;
            }
        }
    }
    
}

export {ServerHold}