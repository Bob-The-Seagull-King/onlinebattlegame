import * as io from "socket.io-client";
import { CONNECTION } from "../../../resources/connection-routes";
import { IFieldedMonster, FieldedMonster, ITeam, Team } from "../../sim/models/team";
import { TeamFactory } from "../../sim/factories/team_factory";
import { OnlineBattleManager } from "../../viewmodel/battle_manager_online";
import { ChosenAction, SelectedAction, TurnSelectReturn } from "../../../global_types";
import { MonsterFactory } from "../../sim/factories/monster_factory";

class SocketManager {

    ActiveSocket    : io.Socket; // The socket currently used for connecting to the server
    Room            : string = ""; // The ID of the room the user is connected to
    BattleManager   : OnlineBattleManager = null; // The ViewModel object used to communicate between the user and the battle

    /**
     * Constructor, sets up the connection and establishes
     * the behaviour for when certain messages are received from
     * the server.
     */
    constructor() {
        this.ActiveSocket = io.connect(CONNECTION.SOCKET_CONNECTION)
                
        // Used when a generic message is received.
        this.ActiveSocket.on("receive_message", (data : any) => { this.ReceiveMessage(data.message); }); 
        
        // Used when a battle-specific message is received from the server.
        this.ActiveSocket.on("receive_battle_message", (data : any) => { this.ReceiveMessage(data.message); });
        
        // Used when the server sends an alert / high priority message
        this.ActiveSocket.on("server_message", (data : any) => { alert(data.message) });

        // Used when the battle provides possible actions and awaits a user response
        this.ActiveSocket.on("receive_battle_options", async (data : any) => {
            const newAction : ChosenAction = await this.BattleManager.ReceiveOptions(data.message);
            if (newAction) {
             this.SendAction(newAction, data.message.Position);
            }
        });

        // Used when the battle provides possible actions and awaits a user response
        this.ActiveSocket.on("receive_battle_position", async (data : any) => {
            this.BattleManager.SetUserInfo(data.sidepos, data.battlepos)
        });

        // Used when the battle provides possible actions and awaits a user response
        this.ActiveSocket.on("receive_battle_state", async (data : any) => {
            this.BattleManager.UpdateBattleState(data.battle)
        });

        // Used when the server responds to the socket's connection request
        this.ActiveSocket.on("connection_response", (data : any) => {
            if (data.room > 0) {
                this.Room = data.room.toString()
                this.ReceiveMessage([{"generic" : "Joined Room " + data.room}]);                
            } else { this.ReceiveMessage([{"generic" : data.message}]) }
        });
    }

    /**
     * Sets the socket's go-to viewmodel object for handling
     * output and user input.
     * @param _manager The manager for this socket to talk with
     */
    public SetReceiverMethod(_manager : OnlineBattleManager) {
        this.BattleManager = _manager;
    }

    /**
     * Has the socket send a request to join a room with
     * a specified Team.
     */
    public JoinRoom() {
        const _Team : ITeam = this.TempNewTeam();    
        this.ActiveSocket.emit("join_room", _Team);  
    }

    private TempNewTeam() : ITeam {
        const _Team : Team = TeamFactory.CreateNewTeam('TempTeam', null);

        _Team.AddFreshMonster("cleric");
        _Team.Monsters[0].AddFreshAction("intothepit");
        _Team.Monsters[0].AddFreshAction("pixiedust");
        _Team.Monsters[0].AddFreshAction("payoff");
        _Team.Monsters[0].AddFreshAction("vaccine");
        _Team.Monsters[0].Traits.push("hospitality");
        _Team.AddFreshMonster("terrain");
        _Team.Monsters[1].AddFreshAction("oilspit");
        _Team.Monsters[1].AddFreshAction("graveyard");
        _Team.Monsters[1].AddFreshAction("blackdart");
        _Team.Monsters[1].AddFreshAction("vomit");
        _Team.Monsters[1].Traits.push("retreat");
        _Team.AddFreshMonster("nimble");
        _Team.Monsters[2].AddFreshAction("mindwipe");
        _Team.Monsters[2].AddFreshAction("whirlgang");
        _Team.Monsters[2].AddFreshAction("deathroll");
        _Team.Monsters[2].AddFreshAction("blackdart");
        _Team.Monsters[2].Traits.push("stressed");
        _Team.AddFreshMonster("bruiser");
        _Team.Monsters[3].AddFreshAction("rotshot");
        _Team.Monsters[3].AddFreshAction("whirlgang");
        _Team.Monsters[3].AddFreshAction("stitchup");
        _Team.Monsters[3].AddFreshAction("deathroll");
        _Team.Monsters[3].Traits.push("guardian");
        _Team.AddFreshMonster("arcane");
        _Team.Monsters[4].AddFreshAction("ritualblade");
        _Team.Monsters[4].AddFreshAction("radiate");
        _Team.Monsters[4].AddFreshAction("collectcall");
        _Team.Monsters[4].AddFreshAction("vomit");
        _Team.Monsters[4].Traits.push("soulsucker");
        _Team.AddFreshMonster("evolvea");
        _Team.Monsters[5].AddFreshAction("radiate");
        _Team.Monsters[5].AddFreshAction("pixiedust");
        _Team.Monsters[5].AddFreshAction("smite");
        _Team.Monsters[5].AddFreshAction("honourablearrow");
        _Team.Monsters[5].Traits.push("overgrown");

        _Team.AddFreshItem("greenherb");
        _Team.AddFreshItem("blockofstone");
        _Team.AddFreshItem("mudshot");
        _Team.AddFreshItem("microbomb");
        _Team.AddFreshItem("gunklauncher");
        _Team.AddFreshItem("boomboom");

        const _teamfinal : ITeam =  _Team.ConvertToInterface();
        return _teamfinal;
    }

    /**
     * Sends a generic message to the server
     * @param message the message to send
     */
    public SendMessage(message: any) {
        const room = this.Room;
        this.ActiveSocket.emit("send_message", { message, room });
    }

    /**
     * Sends a chosen SelectedAction to the server
     * @param option the SelectedAction chosen
     */
    public SendAction(option: ChosenAction, position : number) {
        const room = this.Room;
        const myID = this.ActiveSocket.id;
        this.ActiveSocket.emit("send_option", {option, myID , position, room});
    }

    /**
     * Passes messages sent by the room to the ViewModel
     * @param data the messages being received
     */
    public ReceiveMessage(data : any) {
        this.BattleManager.ReceiveMessages(data)
    }
    
}

export {SocketManager}