import * as io from "socket.io-client";
import { CONNECTION } from "../../../resources/connection-routes";
import { ActivePos, Team } from "../../sim/models/team";
import { TeamFactory } from "../../sim/factories/team_factory";
import { OnlineBattleManager } from "../../viewmodel/battle_manager_online";
import { SelectedAction, TurnSelectReturn } from "../../../global_types";
import { MonsterFactory } from "../../sim/factories/monster_factory";

class SocketManager {

    ActiveSocket    : any; // The socket currently used for connecting to the server
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
            const newAction : TurnSelectReturn = await this.BattleManager.ReceiveOptions(data.message.Choices, data.message.Position, data.message.Battle);
            if (newAction) {
             this.SendAction(newAction, data.message.Position);
            }
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
        const Team : Team = this.TempNewTeam();    
        this.ActiveSocket.emit("join_room", Team.ConvertToInterface());    
    }

    private TempNewTeam() : Team {
        const _Team : Team = TeamFactory.CreateNewTeam();

        _Team.AddFreshItem('blueherb')
        _Team.AddFreshItem('greenherb')
        _Team.AddFreshItem('savouryberry')
        _Team.AddFreshItem('strongsoil')

        _Team.AddFreshMonster('marrowdread')
        _Team.Monsters[0].AddFreshAction('sparkup')
        _Team.Monsters[0].AddFreshAction('nausea')
        _Team.Monsters[0].AddFreshAction('braindrain')
        _Team.Monsters[0].AddFreshAction('stinger')
        _Team.Monsters[0].Traits.push('vampire')

        _Team.AddFreshMonster('humbood')
        _Team.Monsters[1].AddFreshAction('deeproots')
        _Team.Monsters[1].AddFreshAction('flytrap')
        _Team.Monsters[1].AddFreshAction('pressurecannon')
        _Team.Monsters[1].AddFreshAction('rockthrow')
        _Team.Monsters[1].Traits.push('firstdefense')

        _Team.AddFreshMonster('stalagmitendon')
        _Team.Monsters[2].AddFreshAction('superhotslam')
        _Team.Monsters[2].AddFreshAction('scatter')
        _Team.Monsters[2].AddFreshAction('rockthrow')
        _Team.Monsters[2].AddFreshAction('regrow')
        _Team.Monsters[2].Traits.push('solidcomposition')

        _Team.AddFreshMonster('impound')
        _Team.Monsters[3].AddFreshAction('harshthenoise')
        _Team.Monsters[3].AddFreshAction('flytrap')
        _Team.Monsters[3].AddFreshAction('mindread')
        _Team.Monsters[3].AddFreshAction('slam')
        _Team.Monsters[3].Traits.push('sacrificialaltar')

        _Team.AddFreshMonster('stratate')
        _Team.Monsters[4].AddFreshAction('stormwinds')
        _Team.Monsters[4].AddFreshAction('raindance')
        _Team.Monsters[4].AddFreshAction('blindinglight')
        _Team.Monsters[4].AddFreshAction('slam')
        _Team.Monsters[4].Traits.push('scaryface')

        _Team.Leads.push(new ActivePos(0,0,_Team));

        return _Team;
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
    public SendAction(option: TurnSelectReturn, position : number) {
        const room = this.Room;
        this.ActiveSocket.emit("send_option", {option, position, room});
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