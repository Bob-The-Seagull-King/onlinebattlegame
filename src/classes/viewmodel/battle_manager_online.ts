import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { SocketManager } from "../structure/connection/SocketManager";
import { BattleManager, IBattleManager } from "./battle_manager";

// Define the Action type
type EventAction = {
    type: string;
    payload?: any;
  };

class OnlineBattleManager extends BattleManager {

    public MySocket : SocketManager;

    constructor() {
        super()
        this.MySocket = new SocketManager();
        this.MySocket.BattleManager = this;
    }

    public ReceiveMessages(_messages : MessageSet) {
        this.MessageLog.push(_messages);
        this.funcReceiveResults();   
    }

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

    public SendOptions(_option : SelectedAction, _position : number) {
        const event = new CustomEvent<EventAction>('selectAction'+_position, { detail: _option });
        document.dispatchEvent(event);
        this.ChoicesLog = this.ChoicesLog.filter(item => item.pos !== _position)
        this.funcReceiveOptions();
    }

}

export {OnlineBattleManager}