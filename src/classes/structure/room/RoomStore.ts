import { RoomHold } from "./RoomHold";
import { SocketHold } from "../socket/SocketHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { ServerHold } from "../server/ServerHold";
import { ITeam, Team } from "../../sim/models/team";

class RoomStore {

    CurrentRooms: RoomHold[] = [];
    VacantRooms: RoomHold[] = [];
    ID_Count: number = 1;

    MyServer: ServerHold;

    constructor(_server : ServerHold) {
        this.MyServer = _server;
    }

    public AddRoom(_room : RoomHold) {
        this.CurrentRooms.push(_room);
    }

    public RemoveRoom(_room : RoomHold) {
        let value = this.CurrentRooms.indexOf(_room);
        this.CurrentRooms.splice(value, 1);
    }

    public RemoveRoomVacant(_room : RoomHold) {
        let value = this.VacantRooms.indexOf(_room);
        this.VacantRooms.splice(value, 1);
    }

    public JoinRoom(_socket : SocketHold, _data : ITeam) {
        let JoinReportVal = "";
        let RoomVal : number = -1;
        try {
            if (_socket.MyRooms.length >= 1) {
                return {message: ConnectionReports.ERROR_ALREADYJOINED, room : RoomVal}
            }
            let RoomFind : RoomHold = this.FindVacantRoom();
            JoinReportVal = RoomFind.AddMember(_socket, _data);

            if (JoinReportVal === ConnectionReports.CONNECTED_TO_ROOM) { RoomVal = RoomFind.MyID; }
            if (RoomFind.MyMembers.length === RoomFind.MaxMembers) { this.RemoveRoomVacant(RoomFind); }
        } catch (e) { JoinReportVal = ConnectionReports.ERROR_UNKNOWN }
        return {message: JoinReportVal, room: RoomVal};
    }

    private FindVacantRoom() {
        if (this.VacantRooms.length > 0) {
            return this.VacantRooms[0];
        } else {
            const NewId = this.ID_Count;
            const RoomFind = new RoomHold({ id: Number(NewId), size: 2 }, this);
            this.ID_Count += 1;

            this.CurrentRooms.push(RoomFind);
            this.VacantRooms.push(RoomFind);

            return RoomFind;
        }
    }

    public RemoveSocket(_socket : SocketHold) {
        let i = 0;
        for (i = 0; i < _socket.MyRooms.length; i++) {
            const RoomSubj = _socket.MyRooms[i];
            _socket.MyRooms[i].RemoveSocket(_socket)
            if (RoomSubj.MyMembers.length <= 0) {
                this.RemoveRoom(RoomSubj);
                this.RemoveRoomVacant(RoomSubj);
            } else if ((RoomSubj.MyMembers.length < RoomSubj.MaxMembers) &&
                (!this.VacantRooms.includes(RoomSubj))) {
                this.VacantRooms.push(RoomSubj)   
            }
        }
    }
    
}

export {RoomStore}