import { RoomHold } from "./RoomHold";
import { SocketHold } from "../socket/SocketHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { ServerHold } from "../server/ServerHold";

class RoomStore {

    CurrentRooms: RoomHold[] = [];
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

    public JoinRoom(_data : any, _socket : SocketHold) {
        const RoomVal = (_data.toString());
        let JoinReportVal = "";
        try {
            if (RoomVal != "") {
                const CurrentRoom: RoomHold | undefined = this.FindRoom(Number(RoomVal))
                if (CurrentRoom) {
                    JoinReportVal = CurrentRoom.AddMember(_socket);
                } else {
                    const NewRoom = new RoomHold({
                                                id: Number(RoomVal),
                                                size: 2
                                                }, this);
                    this.CurrentRooms.push(NewRoom);
                    JoinReportVal = NewRoom.AddMember(_socket);
                }
            } else {
                let NewId = 0;
                if (this.CurrentRooms.length == 0) {
                    NewId = 1;
                } else {
                    NewId = this.CurrentRooms[this.CurrentRooms.length-1].MyID + 1;
                }
                const NewRoom = new RoomHold({
                                            id: Number(NewId),
                                            size: 2
                                            }, this);
                this.CurrentRooms.push(NewRoom);
                JoinReportVal = NewRoom.AddMember(_socket);
            }
        } catch (e) {
            JoinReportVal = ConnectionReports.ERROR_UNKNOWN
        }

        return JoinReportVal;
    }

    private FindRoom(_data : number) {
        return this.CurrentRooms.find(room => room.MyID === _data)
    }

    public RemoveSocket(_socket : SocketHold) {
        let i = 0;
        for (i = 0; i < this.CurrentRooms.length; i++) {
            this.CurrentRooms[i].RemoveSocket(_socket)
        }
    }
    
}

export {RoomStore}