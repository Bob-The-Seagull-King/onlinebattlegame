import { SocketHold } from "../socket/SocketHold";
import { UserHold } from "../user/UserHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { RoomStore } from "./RoomStore";
import { SelectedAction, TurnChoices } from "../../../global_types";
import { Team } from "../../sim/models/team";
import { Battle } from "../../sim/controller/battle";
import { TrainerBase } from "../../sim/controller/trainer/trainer_basic";
import { TerrainFactory } from "../../sim/factories/terrain_factory";
import { Scene } from "../../sim/models/terrain/terrain_scene";
import { BattleFactory } from "../../sim/factories/battle_factory";
import { TrainerUser } from "../../sim/controller/trainer/trainer_user";

interface IRoomMember {
    socket: SocketHold
    user: UserHold
    roompos : number
    authority: number
    team : Team
}

interface IRoomConstruct {
    id: number
    size: number
}

interface IRoomMessage {
    member: IRoomMember
    message: any
}

class RoomHold {

    MyID: number;
    MyMembers: IRoomMember[] = []
    MaxMembers: number;
    MyStore : RoomStore;
    MyMessages : IRoomMessage[] = [];
    GameRoom : Battle;

    constructor(_room: IRoomConstruct, _store : RoomStore) {
        this.MyID = _room.id;
        this.MaxMembers = _room.size;
        this.MyStore = _store;
    }

    public AddMember(_socket : SocketHold, _team : Team) {
        let MemberResultVal = ""
        try {
            let i = 0
            for (i = 0; i < this.MyMembers.length; i++ ) {
                if (this.MyMembers[i].socket == _socket) { MemberResultVal = ConnectionReports.ERROR_ALREADYJOINED; }
            }

            if (this.MyMembers.length < this.MaxMembers) {
                this.CreateMember(_socket, _team);
                MemberResultVal = ConnectionReports.CONNECTED_TO_ROOM;
            } else {
                MemberResultVal = ConnectionReports.ERROR_ROOMFULL
            }
        } catch (e) { MemberResultVal = ConnectionReports.ERROR_UNKNOWN; }

        if (this.MyMembers.length >= this.MaxMembers) {
            this.GenerateBattle();
        }
        return MemberResultVal;
    }

    public CreateMember(_socket : SocketHold, _team : Team) {
        this.MyMembers.push( { socket: _socket, user: _socket.MyUser, roompos: this.MyMembers.length, authority: 0, team : _team } )
        _socket.MyRooms.push(this);
        _socket.MySocket.join(this.MyID);
    }

    public RemoveSocket(_socket : SocketHold) {
        let i = 0;
        for (i = 0; i < this.MyMembers.length; i++) {
            if (this.MyMembers[i].socket == _socket) {
                this.MyMembers.splice(i, 1);
                break;
            }
        }
        if ((this.MyMembers.length < this.MaxMembers) &&
            (this.GameRoom !== null)) {
                this.DestroyBattle();
        }
    }

    public AddMessage(_socket : SocketHold, _msg : string) {
        const Member =  this.MyMembers.find(member => member.socket === _socket)
        this.MyMessages.push({ member: Member, message: _msg });
        this.EmitMessage();
    }

    public EmitMessage() {
        if (this.MyMessages.length >= this.MaxMembers) {
            let i = 0;
            for (i = 0; i < this.MyMessages.length; i ++) {
                this.MyMessages[i].member.socket.MySocket.to(this.MyID).emit("receive_message", this.MyMessages[i].message);
            }  
            this.MyMessages = [];
        }
    }

    public GetUserTurn(_user : IRoomMember, _options : TurnChoices) : SelectedAction | null {
        return null;
    }
    
    public GenerateBattle() {
        const Trainers : TrainerUser[] = [];
        const newScene : Scene = TerrainFactory.CreateNewTerrain(1,2);
        
        let i = 0
        for (i = 0; i < this.MyMembers.length; i++) {
            const newTrainer : TrainerUser = new TrainerUser({user : this.MyMembers[i], room: this, team: this.MyMembers[i].team, pos : i});
            Trainers.push(newTrainer);
        }
        
        this.GameRoom = BattleFactory.CreateBattle(Trainers, newScene, this.EmitMessage);
        Trainers.forEach(element => {
            element.User.socket.MySocket.to(this.MyID).emit("receive_message", {message: "Battle Room Made For Room" + this.MyID});
        });
    }

    public DestroyBattle() {
        if (this.GameRoom) {
            this.GameRoom.Trainers.forEach(element => {
                (element as TrainerUser).User.socket.MySocket.to(this.MyID).emit("receive_message", {message: "Battle Ended In Room " + this.MyID});
            });

            delete this.GameRoom;
        }
    }
}

export {RoomHold, IRoomMember}