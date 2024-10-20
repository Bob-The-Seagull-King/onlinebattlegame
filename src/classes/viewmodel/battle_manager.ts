import { ItemBattleDex } from "../../data/static/item/item_btl";
import { ChoiceTarget, ChosenAction, ItemAction, MessageSet, MoveAction, PlaceAction, SelectedAction, TurnCharacter, TurnChoices, TurnSelect } from "../../global_types";
import { returnChoiceTargetPlots } from "../../util/sharedfunctions";
import { IBattle } from "../sim/controller/battle";
import { MessageTranslator } from "../tools/translator";
import { GamePlot } from "./game_plot";
import { GameScene } from "./game_scene";

/**
 * Battle Manager interface, currently empty
 * and used to parent related interfaces.
 */
interface IBattleManager {
}

class BattleManager {

    public funcReceiveResults   : any;  // method from the Page for receiving battle messages
    public funcReceiveOptions   : any;  // method from the Page for receiving battle options
    public funcReceivePlots   : any;  // method from the Page for receiving battle options

    public SidePosition : number = 0;
    public BattlePosition : number = 0;
    
    public MessageLog   : MessageSet[]; // Collection of all messages sent by the battle
    public ChoicesLog   : { action : TurnChoices, pos : number}[]; // Collection of choices to be made
    public TranslatedLog : string[];
    public CurrentScene : GameScene = null;
    public CurrentPlots : GamePlot[][] = [];

    public BattleState  : IBattle = {
        sides       : [],
        turns       : 0,
        scene       : {            
                weather     : [],
                field       : [],
                plots       : []  ,
                width       : 0,
                height      : 0 
        }   };  // The most recent evaluation of the battle's state sent from the battle

    /**
     * Simple constructor
     */
    constructor() {
        this.MessageLog = [];
        this.ChoicesLog = [];
        this.TranslatedLog = [];
    }

    public SetUserInfo(_sidepos : number, _battlepos : number) {
        this.SidePosition = _sidepos;
        this.BattlePosition = _battlepos;
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
     * Assign the method for updating the page's list of battle options
     * @param receiveoptions the react function involved
     */
    public setPlotsFuncs(receiveoptions : any) {
        this.funcReceivePlots = receiveoptions;
    }

    /**
     * Send the chosen option to the battle by triggering
     * an event.
     * @param _option the SelectedAction chosen
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     */
    public SendOptions(_action : ChosenAction) {
        undefined;
    }

    /**
     * Received a list of possible choices from the battle and prompts
     * the user to select one of them
     * @param _options collection of possible actions to take
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     * @param _battle current state of the battle
     */
    public ReceiveOptions(_options : TurnSelect) {
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
     * Update the manager's view of the battle
     * @param _battle the new state of the battle
     */
    public UpdateBattleState(_battle : IBattle) {
        this.BattleState = _battle;
        this.CurrentScene = null;
        this.CurrentPlots = [];
        this.CurrentScene = new GameScene( _battle.scene);
        for(let i = 0; i < this.CurrentScene.Scene.plots.length; i++) {
            const newRow : GamePlot[] = []
            for (let j = 0; j < this.CurrentScene.Scene.plots[i].length; j++) {
                newRow.push(new GamePlot(this.CurrentScene.Scene.plots[i][j], this))
            }
            this.CurrentPlots.push(newRow);
        }
        this.funcReceivePlots();
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

    /**
     * Update the state of the battle plots based on a given PLACE action
     * @param _action the given action to select positions for
     * @param _pos the position this action comes from
     * @param _turnchar the turnchar object this action comes from
     */
    public UpdatePlotsPlace(_action : PlaceAction, _pos : number, _turnchar : any) {
        this.ClearSelectShow();
        for(let i = 0; i < this.CurrentPlots.length; i++) {
            for (let j = 0; j < this.CurrentPlots[i].length; j++) {
                const relevantPlot = this.CurrentPlots[i][j]
                
                let _active = false;
                let _index = null;

                _action.target_id.forEach(id => 
                {
                    if ( (id[0] === relevantPlot.Plot.position[0]) && (id[1] === relevantPlot.Plot.position[1])) {
                        _active = true;
                        _index = _action.target_id.indexOf(id);
                        let _charindex = -1
                        for(let k = 0; k < this.ChoicesLog.length; k++) {
                            if (this.ChoicesLog[k].pos === _pos) {
                                _charindex = k;
                            }
                        }
                        const Action : ChosenAction = {
                            type: "PLACE",
                            type_index : _turnchar.action["PLACE"].indexOf(_action),
                            hypo_index : _charindex, 
                            hype_index : _index
                        }
    
                        relevantPlot.setClickableState(_active, false, _index, Action);
                        relevantPlot.funcUpdateVals();
                    }
                }
                )
                
            }
        }
    }

    /**
     * Update the state of the battle plots based on a given SWAP action
     * @param _action the given action to select positions for
     * @param _pos the position this action comes from
     * @param _turnchar the turnchar object this action comes from
     */
    public UpdatePlotsSwap(_action : PlaceAction, _pos : number, _turnchar : any) {
        this.ClearSelectShow();
        for(let i = 0; i < this.CurrentPlots.length; i++) {
            for (let j = 0; j < this.CurrentPlots[i].length; j++) {
                const relevantPlot = this.CurrentPlots[i][j]
                
                let _active = false;
                let _index = null;

                _action.target_id.forEach(id => 
                {
                    if ( (id[0] === relevantPlot.Plot.position[0]) && (id[1] === relevantPlot.Plot.position[1])) {
                        _active = true;
                        _index = _action.target_id.indexOf(id);
                        let _charindex = -1
                        for(let k = 0; k < this.ChoicesLog.length; k++) {
                            if (this.ChoicesLog[k].pos === _pos) {
                                _charindex = k;
                            }
                        }
                        const Action : ChosenAction = {
                            type: "SWITCH",
                            type_index : _turnchar.action["SWITCH"].indexOf(_action),
                            hypo_index : _charindex, 
                            hype_index : _index
                        }
    
                        relevantPlot.setClickableState(_active, false, _index, Action);
                        relevantPlot.funcUpdateVals();
                    }
                }
                )
                
            }
        }
    }

    /**
     * Update the state of the battle plots based on a given SWAP action
     * @param _action the given action to select positions for
     * @param _pos the position this action comes from
     * @param _turnchar the turnchar object this action comes from
     */
    public UpdatePlotsItem(_action : ItemAction, _pos : number, _turnchar : any) {
        this.ClearSelectShow();
        for(let i = 0; i < this.CurrentPlots.length; i++) {
            for (let j = 0; j < this.CurrentPlots[i].length; j++) {
                const relevantPlot = this.CurrentPlots[i][j]
                
                let _active = false;
                let _index = null;

                _action.target_id.forEach(id => 
                {
                    if ( (id[0] === relevantPlot.Plot.position[0]) && (id[1] === relevantPlot.Plot.position[1])) {
                        _active = true;
                        _index = _action.target_id.indexOf(id);
                        let _charindex = -1
                        for(let k = 0; k < this.ChoicesLog.length; k++) {
                            if (this.ChoicesLog[k].pos === _pos) {
                                _charindex = k;
                            }
                        }
                        const Action : ChosenAction = {
                            type: "ITEM",
                            type_index : _turnchar.action["ITEM"].indexOf(_action),
                            hypo_index : _charindex, 
                            hype_index : _index
                        }
    
                        const gamedata = ItemBattleDex[this.BattleState.sides[this.BattlePosition].trainers[this.SidePosition].team.items[(_action).item].item]
                        
                        relevantPlot.setClickableState(_active, false, returnChoiceTargetPlots(this.BattleState, gamedata, id), Action);
                        relevantPlot.funcUpdateVals();
                    }
                }
                )
                
            }
        }
    }

    /**
     * Updates a number of plots to activate them as
     * sub-select plots.
     * @param _plots list of plots to update
     */
    public UpdatePlotsSub(_plots : number[][]) {
        for(let i = 0; i < this.CurrentPlots.length; i++) {
            for (let j = 0; j < this.CurrentPlots[i].length; j++) {
                const relevantPlot = this.CurrentPlots[i][j]               

                _plots.forEach(id => 
                {
                    if ( (id[0] === relevantPlot.Plot.position[0]) && (id[1] === relevantPlot.Plot.position[1])) {
                        relevantPlot.setSubState(true)
                        relevantPlot.funcUpdateVals();
                    }
                }
                )
                
            }
        }
    }

    /**
     * Updates a number of plots to deactivate them
     * as sub-select plots.
     * @param _plots list of plots to update
     */
    public ClearPlotsSub(_plots : number[][]) {
        for(let i = 0; i < this.CurrentPlots.length; i++) {
            for (let j = 0; j < this.CurrentPlots[i].length; j++) {
                const relevantPlot = this.CurrentPlots[i][j]               

                _plots.forEach(id => 
                {
                    if ( (id[0] === relevantPlot.Plot.position[0]) && (id[1] === relevantPlot.Plot.position[1])) {
                        relevantPlot.setSubState(false)
                        relevantPlot.funcUpdateVals();
                    }
                }
                )
                
            }
        }
    }

    /**
     * Update the state of the battle plots based on a given MOVE action
     * @param _action the given action to select positions for
     * @param _pos the position this action comes from
     * @param _turnchar the turnchar object this action comes from
     */
    public UpdatePlotsMove(_action : MoveAction, _pos : number, _turnchar : any) {
        this.ClearSelectShow();
        for(let i = 0; i < this.CurrentPlots.length; i++) {
            for (let j = 0; j < this.CurrentPlots[i].length; j++) {
                const relevantPlot = this.CurrentPlots[i][j]
                
                let _active = false;
                let _index = null;

                _action.paths.forEach(id => 
                {
                    if ( (id[0][0] === relevantPlot.Plot.position[0]) && (id[0][1] === relevantPlot.Plot.position[1])) {
                        _active = true;
                        _index = _action.paths.indexOf(id);
                        let _charindex = -1
                        for(let k = 0; k < this.ChoicesLog.length; k++) {
                            if (this.ChoicesLog[k].pos === _pos) {
                                _charindex = k;
                            }
                        }
                        const Action : ChosenAction = {
                            type: "MOVE",
                            type_index : _turnchar.action["MOVE"].indexOf(_action),
                            hypo_index : _charindex, 
                            hype_index : _index
                        }
    
                        relevantPlot.setClickableState(_active, false, id, Action);
                        relevantPlot.funcUpdateVals();
                    }
                }
                )
                
            }
        }
    }

    /**
     * Reset the state of all plot objects
     */
    public ClearSelectShow() {
        this.CurrentPlots.forEach(_plotlist => {
            _plotlist.forEach(_plot => {                
                _plot.IsActive = false;
                _plot.IsSubActive = false;
                _plot.ValIndex = null;
                _plot.TurnVal = null;
                _plot.funcUpdateVals();                
            })
        })

        this.CurrentScene.IsActive = false
        this.CurrentScene.TurnVal = null
    }

}

export {BattleManager, IBattleManager}