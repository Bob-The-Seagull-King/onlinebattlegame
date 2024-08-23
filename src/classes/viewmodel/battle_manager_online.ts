import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";
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

    public ReceiveOptions(_options : TurnChoices) : Promise<SelectedAction> {
        this.funcReceiveOptions(_options);
        return new Promise<SelectedAction>((resolve) => {
            const handleEvent = (event: CustomEvent<EventAction>) => {
              resolve(event.detail as SelectedAction);
              document.removeEventListener('selectAction', handleEvent as EventListener);
            };
        
            document.addEventListener('selectAction', handleEvent as EventListener);
          });
    }

    public SendOptions(_option : SelectedAction) {
        const event = new CustomEvent<EventAction>('selectAction', { detail: _option });
        document.dispatchEvent(event);
        this.funcReceiveOptions([]);
    }

}

export {OnlineBattleManager}