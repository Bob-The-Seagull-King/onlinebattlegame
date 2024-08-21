import * as io from "socket.io-client";
import { CONNECTION } from "../../../resources/connection-routes";
import { useEffect, useState } from "react";
import { AnyARecord } from "dns";
import { Team } from "../../sim/models/team";
import { TeamFactory } from "../../sim/factories/team_factory";

class SocketManager {

    ActiveSocket: any;
    Room: string = "";
    MessageReceiver: any = null;

    constructor() {
        this.ActiveSocket = io.connect(CONNECTION.SOCKET_CONNECTION)
                
        this.ActiveSocket.on("receive_message", (data : any) => {
            this.ReceiveMessage(data);
        });
        
        this.ActiveSocket.on("server_message", (data : any) => {
            alert(data.message)
        });
        
        this.ActiveSocket.on("connection_response", (data : any) => {
            if (data.room > 0) {
                this.ReceiveMessage({message: "Joined Room " + data.room});                
            } else {
                this.ReceiveMessage(data)
            }
        });
    }

    public SetReceiverMethod(_method : any) {
        this.MessageReceiver = _method;
    }

    public SetRoom(room : string) {
        this.Room = room;
    }

    public JoinRoom() {
        const Team : Team = TeamFactory.CreateNewTeam();
        this.ActiveSocket.emit("join_room", Team);    
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