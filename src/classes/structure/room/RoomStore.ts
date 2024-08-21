import { RoomHold } from "./RoomHold";
import { SocketHold } from "../socket/SocketHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { ServerHold } from "../server/ServerHold";

class RoomStore {

    CurrentRooms: RoomHold[] = [];
    VacantRooms: RoomHold[] = [];

    MyServer: ServerHold;

    constructor(_server : ServerHold) {
        this.MyServer = _server;
    }

    public AddRoom(_room : RoomHold) {
        this.CurrentRooms.push(_room);
    }

    public RemoveRoom(_room : RoomHold) {
        let i = 0;
        for (i = 0; i < this.CurrentRooms.length; i++) {
            if (this.CurrentRooms[i] == _room) {
                this.CurrentRooms.splice(i, 1);
                break;
            }
        }
    }

    public JoinRoom(_socket : SocketHold) {
        let JoinReportVal = "";
        try {     
            let RoomFind : RoomHold = this.FindVacantRoom();
            JoinReportVal = RoomFind.AddMember(_socket);

            if (RoomFind.MyMembers.length === RoomFind.MaxMembers) { this.VacantRooms.pop(); }
        } catch (e) {
            JoinReportVal = ConnectionReports.ERROR_UNKNOWN
        }

        return JoinReportVal;
    }

    private FindVacantRoom() {
        if (this.VacantRooms.length > 0) {
            return this.VacantRooms[0];
        } else {
            const NewId = (this.CurrentRooms.length == 0)? 1 : (this.CurrentRooms[this.CurrentRooms.length-1].MyID + 1) ;
            const RoomFind = new RoomHold({ id: Number(NewId), size: 2 }, this);

            this.CurrentRooms.push(RoomFind);
            this.VacantRooms.push(RoomFind);

            return RoomFind;
        }
    }

    private FindRoom(_data : number) {
        return this.CurrentRooms.find(room => room.MyID === _data)
    }

    public RemoveSocket(_socket : SocketHold) {
        let i = 0;
        for (i = 0; i < this.CurrentRooms.length; i++) {
            this.CurrentRooms[i].RemoveSocket(_socket)
            if (this.CurrentRooms[i].MyMembers.length <= 0) {
                delete this.CurrentRooms[i];
            } else {
                if (this.CurrentRooms[i].MyMembers.length < this.CurrentRooms[i].MaxMembers) {
                    this.VacantRooms.push(this.CurrentRooms[i])
                }
            }
        }
    }
    
}

export {RoomStore}