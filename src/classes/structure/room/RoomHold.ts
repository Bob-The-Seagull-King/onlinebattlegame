import { SocketHold } from "../socket/SocketHold";
import { UserHold } from "../user/UserHold";
import { ConnectionReports } from "../server/SocketConnectionEnum";
import { RoomStore } from "./RoomStore";
import { ChosenAction, MessageSet, SelectedAction, TurnSelect, TurnSelectReturn } from "../../../global_types";
import { ITeam } from "../../sim/models/team";
import { Battle, IBattle } from "../../sim/controller/battle";
import { TerrainFactory } from "../../sim/factories/terrain_factory";
import { IScene, Scene } from "../../sim/models/terrain/terrain_scene";
import { BattleFactory } from "../../sim/factories/battle_factory";
import { ITrainerUser, TrainerUser } from "../../sim/controller/trainer/trainer_user";
import { EventEmitter } from 'events';

// Tool for awaiting / creating events. Used for action selection.
const eventEmitter = new EventEmitter();

/**
 * Interface for sockets / users in a room
 */
interface IRoomMember {
    socket      : SocketHold    // The socket this member is using
    user        : UserHold      // The user object for this member
    roompos     : number        // The position this member has in the room
    authority   : number        // Unused - Here to allow for elevated action permissions
    team        : ITeam         // The Team a member will be using in battles
    trainer?    : TrainerUser   // The relevant trainer being created here
}

/**
 * Interface for generating a new room
 */
interface IRoomConstruct {
    id      : number    // The ID a room will use
    size    : number    // How many members a room can have at once
}

/**
 * Interface for a message sent to the room
 */
interface IRoomMessage {
    member  : IRoomMember   // The user sending this message
    message : any           // The contents of the message
}

class RoomHold {

    MyID        : number;               // The room's ID
    MyMembers   : IRoomMember[] = []    // Collection of a room's members
    MaxMembers  : number;               // The room's prescribed max occupancy
    MyStore     : RoomStore;            // The parent store of all rooms
    MyMessages  : IRoomMessage[] = [];  // Collection of messages sent to the room
    GameRoom    : Battle;               // The battle taking place in this room

    /**
     * Simple constructor
     * @param _room the interface info on the room
     * @param _store the parent store of all rooms
     */
    constructor(_room: IRoomConstruct, _store : RoomStore) {
        this.MyID = _room.id;
        this.MaxMembers = _room.size;
        this.MyStore = _store;
    }

    /**
     * Attempt to add a user, via their socket, to the room
     * and if successful add them as a RoomMember with their team.
     * @param _socket the user's socket
     * @param _team the user's battle team
     * @returns string message about if the addition was successful
     */
    public AddMember(_socket : SocketHold, _team : ITeam) {
        let MemberResultVal = ""
        try {
            for (let i = 0; i < this.MyMembers.length; i++ ) {
                if (this.MyMembers[i].socket == _socket) { 
                    // Reject member if they're already a member of this room
                    MemberResultVal = ConnectionReports.ERROR_ALREADYJOINED; 
                }
            }

            if (this.MyMembers.length < this.MaxMembers) {
                // Add new member if there is room
                this.CreateMember(_socket, _team);
                MemberResultVal = ConnectionReports.CONNECTED_TO_ROOM;
            } else {
                // Reject member if there's no space left
                MemberResultVal = ConnectionReports.ERROR_ROOMFULL
            }
        } catch (e) { 
            // Generic catch if anything unexpected happens during the join attempt
            MemberResultVal = ConnectionReports.ERROR_UNKNOWN; 
        }

        // If the room is full, generate and start a new battle
        if (this.MyMembers.length >= this.MaxMembers) {
            this.GenerateBattle();
            this.GameRoom.BattleBegin();
        }
        return MemberResultVal;
    }

    /**
     * Create a RoomMember and add it to the room's collection
     * @param _socket the socket of the new RoomMember
     * @param _team the RoomMember's battle team
     */
    public CreateMember(_socket : SocketHold, _team : ITeam) {
        this.MyMembers.push( { socket: _socket, user: _socket.MyUser, roompos: this.MyMembers.length, authority: 0, team : _team } )
        _socket.MyRooms.push(this);
        _socket.MySocket.join(this.MyID);
    }

    /**
     * Given a socket, remove the member which uses
     * this socket from the room.
     * @param _socket the socket to discard
     */
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

    /**
     * Add a message to the room's message collection
     * @param _socket the socket this message is coming from
     * @param _msg the message content
     */
    public AddMessage(_socket : SocketHold, _msg : string) {
        const Member =  this.MyMembers.find(member => member.socket === _socket)
        this.MyMessages.push({ member: Member, message: _msg });
        this.EmitMessage();
    }

    /**
     * TEST STATE
     * Return all messages to their senders
     */
    public EmitMessage() {
        if (this.MyMessages.length >= this.MaxMembers) {
            for (let i = 0; i < this.MyMessages.length; i ++) {
                this.MyMessages[i].member.socket.MySocket.to(this.MyID).emit("receive_message", {message: [{ "generic" : this.MyMessages[i].message}]});
            }  
            this.MyMessages = [];
        }
    }

    /**
     * Given a trainer, and a collection of options, send a request
     * to the appropriate user and return with their SelectedAction
     * @param _user the user to send the request to
     * @param _options the options for them to choose from
     * @returns the chosen SelectedAction
     */
    public async GetUserTurn(_user : TrainerUser, _options : TurnSelect) {
        _user.User.socket.MySocket.emit("receive_battle_options", {message: _options, username: _user.User.user.MySocket.MyID});
    }

    public SetUserPosition(_user : TrainerUser, _sidepos : number, _battlepos : number) {
        _user.User.socket.MySocket.emit("receive_battle_position", {sidepos: _sidepos, battlepos: _battlepos, battle : _user.Owner.Owner.ConvertToInterface()});
    }
    
    /**
     * Given an option is selected, trigger the appropriate
     * event and send that information to the room.
     * @param _option the option chosen
     * @param refID the 
     */
    public SendOptions(_option : ChosenAction, refID : string, refPos : string) {
        this.MyMembers.forEach(member => {
            if ((member.user.MySocket.MyID === refID) && (member.trainer != null)) {
                member.trainer.SendOptions(_option, refPos)
            }
        })
    }
    
    /**
     * Create and start a battle with the current room members
     */
    public GenerateBattle() {
        const Trainers : ITrainerUser[][] = [];
        const newScene : IScene = TerrainFactory.CreateIScene(6,6)
    
        let i = 0
        for (i = 0; i < this.MyMembers.length; i++) {
            const newTrainer : ITrainerUser = {type : "user", user : this.MyMembers[i], team: this.MyMembers[i].team, pos : i, name: this.MyMembers[i].user.Name.toString()};
            Trainers.push([newTrainer]);
        }
        
        this.GameRoom = BattleFactory.CreateNewBattle(Trainers, newScene, this, 2);

        this.GameRoom.Sides.forEach(element => {
            element.Trainers.forEach((item) => {
                (item as TrainerUser).User.trainer = (item as TrainerUser);
                (item as TrainerUser).User.socket.MySocket.to(this.MyID).emit("receive_message", {message: [{ "generic" : "Battle Room Made For Room" + this.MyID}]});
                item.SendPositionInfo(this);
            })
        });
    }

    public UpdateState(_battle : IBattle) {
        this.GameRoom.Sides.forEach(element => {
            element.Trainers.forEach((item) => {
                (item as TrainerUser).User.socket.MySocket.to(this.MyID).emit("receive_battle_state", {battle: _battle});
                item.SendPositionInfo(this);
            })
        });
    }

    /**
     * End a battle, used when a user disconnects
     */
    public DestroyBattle() {
        if (this.GameRoom) {
            this.GameRoom.Sides.forEach(element => {
                element.Trainers.forEach(item => {
                    (item as TrainerUser).User.socket.MySocket.to(this.MyID).emit("receive_message", {message: [{ "generic" : "Battle Ended In Room " + this.MyID}]});
                })
            });

            delete this.GameRoom;
        }
    }

    /**
     * Emits battle log messages to connected users.
     * @param _messages the messages to send back to users
     */
    public ReceiveMessages(_messages : MessageSet) {
        this.MyMembers.forEach(item => {
            item.socket.MySocket.to(this.MyID).emit("receive_battle_message", {message: _messages});
        })
    }
}

export {RoomHold, IRoomMember}