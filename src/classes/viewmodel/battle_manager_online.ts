import { SelectedAction, TurnChoices } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { SocketManager } from "../structure/connection/SocketManager";
import { BattleManager } from "./battle_manager";

// Used for handling events
type EventAction = {
    type: string; // The name of the event
    payload?: any; // The content of the event message
  };

class OnlineBattleManager extends BattleManager {

    public MySocket : SocketManager;    // The socket manager used to connect to and get messages from the server

    /**
     * Simple constructor
     */
    constructor() {
        super()
        this.MySocket = new SocketManager();
        this.MySocket.BattleManager = this;
    }

    /**
     * Received a list of possible choices from the battle and prompts
     * the user to select one of them
     * @param _options collection of possible actions to take
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     * @param _battle current state of the battle
     */
    public ReceiveOptions(_options : TurnChoices, _position : number, _battle: IBattle) : Promise<SelectedAction> {   
        this.BattleState = _battle;  
        this.ChoicesLog.push({ action : _options, pos : _position})
        this.funcReceiveOptions();
        return new Promise<SelectedAction>((resolve) => {
            const handleEvent = (event: CustomEvent<EventAction>) => {
              resolve(event.detail as SelectedAction);
              document.removeEventListener('selectAction'+_position, handleEvent as EventListener);
            };
        
            document.addEventListener('selectAction'+_position, handleEvent as EventListener);
          });
    }

    /**
     * Send the chosen option to the battle by triggering
     * an event.
     * @param _option the SelectedAction chosen
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     */
    public SendOptions(_option : SelectedAction, _position : number) {
        const event = new CustomEvent<EventAction>('selectAction'+_position, { detail: _option });
        document.dispatchEvent(event);
        this.ChoicesLog = this.ChoicesLog.filter(item => item.pos !== _position)
        this.funcReceiveOptions();
    }

}

export {OnlineBattleManager}