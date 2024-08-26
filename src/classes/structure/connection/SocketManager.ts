import * as io from "socket.io-client";
import { CONNECTION } from "../../../resources/connection-routes";
import { useEffect, useState } from "react";
import { AnyARecord } from "dns";
import { ActivePos, Team } from "../../sim/models/team";
import { TeamFactory } from "../../sim/factories/team_factory";
import { OnlineBattleManager } from "../../viewmodel/battle_manager_online";
import { SelectedAction } from "../../../global_types";
import { MonsterFactory } from "../../sim/factories/monster_factory";

class SocketManager {

    ActiveSocket: any;
    Room: string = "";
    BattleManager: OnlineBattleManager = null;

    constructor() {
        this.ActiveSocket = io.connect(CONNECTION.SOCKET_CONNECTION)
                
        this.ActiveSocket.on("receive_message", (data : any) => { this.ReceiveMessage(data.message); }); 
        this.ActiveSocket.on("receive_battle_message", (data : any) => {
             this.ReceiveMessage(data.message); });
        this.ActiveSocket.on("receive_battle_options", async (data : any) => {
            const newAction : SelectedAction = await this.BattleManager.ReceiveOptions(data.message.Choices, data.message.Position);
            if (newAction) {
             this.SendAction(newAction);
            }
        });
        this.ActiveSocket.on("server_message", (data : any) => { alert(data.message) });
        this.ActiveSocket.on("connection_response", (data : any) => {
            if (data.room > 0) {
                this.Room = data.room.toString()
                this.ReceiveMessage([{"generic" : "Joined Room " + data.room}]);                
            } else { this.ReceiveMessage([{"generic" : data.message}]) }
        });
    }

    public SetReceiverMethod(_manager : OnlineBattleManager) {
        this.BattleManager = _manager;
    }

    public SetRoom(room : string) {
        this.Room = room;
    }

    public JoinRoom() {
        const Team : Team = TeamFactory.CreateNewTeam();
        Team.Monsters.push(MonsterFactory.CreateNewMonster("larvin"))
        Team.Monsters[0].AddFreshAction("tackle");
        Team.Leads.push(new ActivePos( Team.Monsters[0], 0))
        this.ActiveSocket.emit("join_room", Team);    
    }

    public SendMessage(message: any) {
        const room = this.Room;
        this.ActiveSocket.emit("send_message", { message, room });
    }

    public SendAction(option: SelectedAction) {
        const room = this.Room;
        this.ActiveSocket.emit("send_option", {option, room});
    }

    public ReceiveMessage(data : any) {
        this.BattleManager.ReceiveMessages(data)
    }
    
}

export {SocketManager}