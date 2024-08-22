import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";

interface IBattleManager {
}

class BattleManager {

    public funcReceiveResults : any;
    public funcReceiveOptions : any;
    public funcSendOptions : any;

    public setResultFuncs(receiveresults : any) {
        this.funcReceiveResults = receiveresults;
    }
    
    public setOptionsFuncs(receiveoptions : any, sendoptions : any) {
        this.funcReceiveOptions = receiveoptions;
        this.funcSendOptions = sendoptions;
    }

    public SendOptions(_option : SelectedAction) {
        undefined;
    }

    public ReceiveOptions(_options : TurnChoices) {
        undefined;
    }

    public ReceiveResults(_message : MessageSet) {
        undefined;
    }

}

export {BattleManager, IBattleManager}