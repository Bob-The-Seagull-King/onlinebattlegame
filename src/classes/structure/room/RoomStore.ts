import { RoomHold } from "./RoomHold";
import { SocketHold } from "../socket/SocketHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { ServerHold } from "../server/ServerHold";
import { ITeam } from "../../sim/models/team";

class RoomStore {

    CurrentRooms    : RoomHold[] = [];  // Collection of all active rooms
    VacantRooms     : RoomHold[] = [];  // Collection of rooms with fewer members than their max occupancy
    ID_Count        : number = 1;       // Ever incrimenting value for generating new rooms, never goes down (watch out?)
    MyServer        : ServerHold;       // The server all rooms are held in

    /**
     * Simple constructor
     * @param _server the server that holds this storage of rooms
     */
    constructor(_server : ServerHold) {
        this.MyServer = _server;
    }

    /**
     * Pushes a RoomHold object to the store's collection
     * @param _room the new room
     */
    public AddRoom(_room : RoomHold) {
        this.CurrentRooms.push(_room);
    }

    /**
     * Given a RoomHold, take that object out of this
     * store's collection.
     * @param _room the Room to remove
     */
    public RemoveRoom(_room : RoomHold) {
        let value = this.CurrentRooms.indexOf(_room);
        this.CurrentRooms.splice(value, 1);
    }

    /**
     * Give a RoomHold, take that object out of this
     * store's collection of non-full rooms.
     * @param _room the Room to remove
     */
    public RemoveRoomVacant(_room : RoomHold) {
        let value = this.VacantRooms.indexOf(_room);
        this.VacantRooms.splice(value, 1);
    }

    /**
     * Given a socket, attempt to add them to a room if they
     * have not already entered a room of their own.
     * @param _socket The socket attempting to connect
     * @param _data The team this socket comes with to add as a Trainer
     * @returns a message containing the result of the attempt and, if relevant, the ID of the socket's new room
     */
    public JoinRoom(_socket : SocketHold, _data : ITeam) {
        let JoinReportVal = "";
        let RoomVal : number = -1;
        try {
            if (_socket.MyRooms.length >= 1) {
                // Stop users from joining more than one room
                return {message: ConnectionReports.ERROR_ALREADYJOINED, room : RoomVal}
            }

            let RoomFind : RoomHold = this.FindVacantRoom();
            JoinReportVal = RoomFind.AddMember(_socket, _data);

            // If connected to a room, add the ID to the message and check if that room still has space for more users.
            if (JoinReportVal === ConnectionReports.CONNECTED_TO_ROOM) { RoomVal = RoomFind.MyID; }
            if (RoomFind.MyMembers.length === RoomFind.MaxMembers) {  this.RemoveRoomVacant(RoomFind); }
        } catch (e) { 
            // Generic catch if anything unexpected happens during the join attempt
            JoinReportVal = ConnectionReports.ERROR_UNKNOWN 
        }
        return {message: JoinReportVal, room: RoomVal};
    }

    /**
     * Find the first vacant room or, if none exist,
     * create a new empty room.
     * @returns a RoomHold
     */
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

    /**
     * When disconnected, remove a socket from any rooms
     * it's a part of, and check the current occupancy state
     * of these rooms.
     * @param _socket The socket to remove
     */
    public RemoveSocket(_socket : SocketHold) {
        let i = 0;
        for (i = 0; i < _socket.MyRooms.length; i++) {
            const RoomSubj = _socket.MyRooms[i];
            _socket.MyRooms[i].RemoveSocket(_socket)
            if (RoomSubj.MyMembers.length <= 0) {
                // If no more users exist, throw out the room.
                this.RemoveRoom(RoomSubj);
                this.RemoveRoomVacant(RoomSubj);
            } else if ((RoomSubj.MyMembers.length < RoomSubj.MaxMembers) &&
                (!this.VacantRooms.includes(RoomSubj))) {
                // If the room is not empty and not full, add it to the list of Vacant Rooms.
                this.VacantRooms.push(RoomSubj)   
            }
        }
    }
    
}

export {RoomStore}