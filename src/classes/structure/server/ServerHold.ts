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

    server      : any;              // The server object itself
    MainServer  : any;              // The generated Server based on the server object
    Users       : UserStore;        // Storage object for all Users
    Rooms       : RoomStore;        // Storage object for all Rooms
    Sockets     : SocketHold[] =[]; // Collection of all connected sockets

    PortNum     : number = CONNECTION.SERVER_PORT;  // The port for the server to use

    /**
     * Simple constructor
     */
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

    /**
     * Begins the server connection and starts the listening process.
     */
    private SetupServer() {
        this.MainServer.on("connection", (socket) => {
            UserSocketFactory.BuildUserAndSocket(socket, this, this.Users);
        });
        
        this.MainServer.listen(this.PortNum, () => {
            console.log("SERVER IS RUNNING");
        });
    }
    
    /**
     * Adds a socket to the server's list
     * @param socket the new socket
     */
    public NewSocket(socket) {
        this.Sockets.push(socket);
    }

    /**
     * Sends a base-level server message to a socket
     * @param _socket the socket to talk to
     * @param _msg the message to send
     */
    public SendMessageToSocket(_socket : SocketHold, _msg : any) {
        this.MainServer.to(_socket.MySocket.id).emit('server_message', _msg);
    }

    /**
     * Responds to a socket's attempt to connect
     * @param _socket the socket to talk to
     * @param _msg the connection attempt response
     */
    public SendConnectionToSocket(_socket : SocketHold, _msg : any) {
        this.MainServer.to(_socket.MySocket.id).emit('connection_response', _msg);
    }

    /**
     * Removes a socket from the server and relevant child objects
     * @param _socket the socket object to discard
     */
    public DisconnectSocket(_socket : SocketHold) {
        console.log(`User Disconnected: ${_socket.MySocket.id}`);
        this.Rooms.RemoveSocket(_socket);
        this.Users.RemoveUser(_socket.MyUser);
        const socketvar = this.Sockets.indexOf(_socket);
        this.Sockets.splice(socketvar, 1);
    }
    
}

export {ServerHold}