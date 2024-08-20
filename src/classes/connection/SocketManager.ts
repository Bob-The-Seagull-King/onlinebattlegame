import * as io from "socket.io-client";
import { CONNECTION } from "../../resources/connection-routes";
import { useEffect, useState } from "react";
import { AnyARecord } from "dns";

class SocketManager {

    ActiveSocket: any;
    Room: string = "";
    MessageReceiver: any = null;

    constructor() {
        this.ActiveSocket = io.connect(CONNECTION.SOCKET_CONNECTION);
        
        this.ActiveSocket.on("receive_message", (data : any) => {
            this.ReceiveMessage(data);
        });
        
        this.ActiveSocket.on("server_message", (data : any) => {
            alert(data.message)
        });
    }

    public SetReceiverMethod(_method : any) {
        this.MessageReceiver = _method;
    }

    public SetRoom(room : string) {
        this.Room = room;
    }

    public JoinRoom() {
        if (this.Room.length > 0) {
            this.ActiveSocket.emit("join_room", this.Room);
        }
    }

    public SendMessage(message: any) {
        const room = this.Room;
        this.ActiveSocket.emit("send_message", { message, room });
    }

    public ReceiveMessage(data : any) {
        this.MessageReceiver(data)
    }
    
}

export {SocketManager}