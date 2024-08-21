import { SocketHold } from "../socket/SocketHold";
import { UserHold } from "../user/UserHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { RoomStore } from "./RoomStore";
import { SelectedAction, TurnChoices } from "../../../global_types";
import { Team } from "../../sim/models/team";
import { Battle } from "../../sim/controller/battle";

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
        try {
            let i = 0
            for (i = 0; i < this.MyMembers.length; i++ ) {
                if (this.MyMembers[i].socket == _socket) { return ConnectionReports.ERROR_ALREADYJOINED; }
            }

            if (this.MyMembers.length < this.MaxMembers) {
                this.CreateMember(_socket, _team);
                return ConnectionReports.CONNECTED_TO_ROOM;
            } else {
                return ConnectionReports.ERROR_ROOMFULL
            }
        } catch (e) { return ConnectionReports.ERROR_UNKNOWN; }
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
    
}

export {RoomHold, IRoomMember}