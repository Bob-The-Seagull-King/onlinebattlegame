import { SocketManager } from "../structure/connection/SocketManager";
import { BattleManager, IBattleManager } from "./battle_manager";

class OnlineBattleManager extends BattleManager {

    public MySocket : SocketManager;

    constructor() {
        super()
        this.MySocket = new SocketManager();
    }
    
    public setReturnFunc(_func : any) {
        this.funcReceiveResults = _func;
        this.MySocket.MessageReceiver = this.funcReceiveResults;
    }

}

export {OnlineBattleManager}