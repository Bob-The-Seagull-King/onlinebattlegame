import { RoomHold } from "./RoomHold";
import { SocketHold } from "../socket/SocketHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { ServerHold } from "../server/ServerHold";

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
            console.log("ADD TO ROOM" + RoomFind.MyID)

            if (RoomFind.MyMembers.length === RoomFind.MaxMembers) { 
                console.log("POP FROM VACANCY" + RoomFind.MyID)
                this.VacantRooms.pop(); 
            }
            
        } catch (e) {
            JoinReportVal = ConnectionReports.ERROR_UNKNOWN
        }
        return JoinReportVal;
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
        for (i = 0; i < this.CurrentRooms.length; i++) {
            this.CurrentRooms[i].RemoveSocket(_socket)
            if (this.CurrentRooms[i].MyMembers.length <= 0) {
                let j = 0
                for (j = 0; j < this.VacantRooms.length; j++) {
                    if (this.VacantRooms[j] === this.CurrentRooms[i]) {
                        this.VacantRooms.splice(j, 1);
                        console.log("REMOVE FROM VACANCY" + this.CurrentRooms[i].MyID)
                    }
                }
                console.log("REMOVE ROOM" + this.CurrentRooms[i].MyID)
                this.CurrentRooms.splice(i, 1);
            } else {
                if ((this.CurrentRooms[i].MyMembers.length < this.CurrentRooms[i].MaxMembers) &&
                    (!this.VacantRooms.includes(this.CurrentRooms[i]))) {
                    console.log("ADD ROOM" + this.CurrentRooms[i].MyID)
                    this.VacantRooms.push(this.CurrentRooms[i])
                }
            }
        }
    }
    
}

export {RoomStore}