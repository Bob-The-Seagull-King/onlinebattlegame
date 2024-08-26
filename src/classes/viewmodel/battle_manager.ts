import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";
import { MessageTranslator } from "../tools/translator";

interface IBattleManager {
}

class BattleManager {

    public funcReceiveResults : any;
    public funcReceiveOptions : any;
    public MessageLog : MessageSet[];
    public ChoicesLog : { action : TurnChoices, pos : number}[];

    constructor() {
        this.MessageLog = [];
        this.ChoicesLog = [];
    }

    public setResultFuncs(receiveresults : any) {
        this.funcReceiveResults = receiveresults;
    }
    
    public setOptionsFuncs(receiveoptions : any) {
        this.funcReceiveOptions = receiveoptions;
    }

    public SendOptions(_option : SelectedAction, _position : number) {
        undefined;
    }

    public ReceiveOptions(_options : TurnChoices, _position : number) {
        undefined;
    }

    public ReceiveResults(_message : MessageSet) {
        undefined;
    }

    public ReceiveMessages(_messages : MessageSet) {
        undefined;
    }

    public TranslateMessages(_messages : MessageSet) : string[] {
        return MessageTranslator.TranslateMessages(_messages)
    }

}

export {BattleManager, IBattleManager}