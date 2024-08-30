import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { MessageTranslator } from "../tools/translator";

/**
 * Battle Manager interface, currently empty
 * and used to parent related interfaces.
 */
interface IBattleManager {
}

class BattleManager {

    public funcReceiveResults   : any;  // method from the Page for receiving battle messages
    public funcReceiveOptions   : any;  // method from the Page for receiving battle options
    
    public MessageLog   : MessageSet[]; // Collection of all messages sent by the battle
    public ChoicesLog   : { action : TurnChoices, pos : number}[]; // Collection of choices to be made
    public TranslatedLog : string[];

    public BattleState  : IBattle;  // The most recent evaluation of the battle's state sent from the battle

    /**
     * Simple constructor
     */
    constructor() {
        this.MessageLog = [];
        this.ChoicesLog = [];
        this.TranslatedLog = [];
    }

    /**
     * Assign the method for updating the page's list of battle messages
     * @param receiveresults the react function involved
     */
    public setResultFuncs(receiveresults : any) {
        this.funcReceiveResults = receiveresults;
    }

    /**
     * Assign the method for updating the page's list of battle options
     * @param receiveoptions the react function involved
     */
    public setOptionsFuncs(receiveoptions : any) {
        this.funcReceiveOptions = receiveoptions;
    }

    /**
     * Send the chosen option to the battle by triggering
     * an event.
     * @param _option the SelectedAction chosen
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     */
    public SendOptions(_type : string, _index : number, _element: number, _position : number) {
        undefined;
    }

    /**
     * Received a list of possible choices from the battle and prompts
     * the user to select one of them
     * @param _options collection of possible actions to take
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     * @param _battle current state of the battle
     */
    public ReceiveOptions(_options : TurnChoices, _position : number, _battle: IBattle) {
        undefined;
    }

    /**
     * Receive battle action results from the battle
     * @param _message sent messages
     */
    public ReceiveResults(_message : MessageSet) {
        undefined;
    }

    /**
     * Receive general messages
     * @param _messages send messages
     */
    public ReceiveMessages(_messages : MessageSet) {
        this.MessageLog.push(_messages);
        
        this.TranslatedLog.push.apply(this.TranslatedLog, this.TranslateMessages(_messages));
        this.funcReceiveResults();   
    }

    /**
     * With a given set of messages, return them
     * in a human-readable format
     * @param _messages the collection of messages
     * @returns human readable string
     */
    public TranslateMessages(_messages : MessageSet) : string[] {
        return MessageTranslator.TranslateMessages(_messages, this.BattleState)
    }

}

export {BattleManager, IBattleManager}