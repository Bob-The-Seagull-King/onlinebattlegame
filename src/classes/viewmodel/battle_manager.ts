import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";

interface IBattleManager {
}

class BattleManager {

    public funcReceiveResults : any;
    public funcReceiveOptions : any;
    public MessageLog : MessageSet[];
    public ChoicesLog : { action : SelectedAction, pos : number}[];

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
        const MessageList : string[] = [];
        
        _messages.forEach(element => {
            Object.keys(element).forEach(item => {
                let MessageStr = ""
                if (item === 'choice') {
                    MessageStr = "Selected Action: "
                    if (element[item].type === 'NONE') { MessageStr += "Trainer " + element[item].trainer.Name +  " Did Nothing" }
                } else if (item === 'generic') {
                    MessageStr = element[item]
                }
                MessageList.push(MessageStr);
            })
        })

        return MessageList;
    }

}

export {BattleManager, IBattleManager}