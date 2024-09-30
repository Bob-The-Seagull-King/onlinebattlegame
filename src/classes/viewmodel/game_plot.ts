import { ChosenAction, MessageSet, SelectedAction, TurnChoices, TurnSelect } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { IFieldedMonster } from "../sim/models/team";
import { IPlot } from "../sim/models/terrain/terrain_plot";
import { MessageTranslator } from "../tools/translator";
import { BattleManager } from "./battle_manager";

/**
 * Battle Manager interface, currently empty
 * and used to parent related interfaces.
 */
interface IGamePlot {
}

class GamePlot {

    public Plot : IPlot;
    public IsActive : boolean;
    public IsSubActive : boolean;
    public ValIndex : number;
    public TurnVal : ChosenAction;
    public Owner : BattleManager;

    public Tooltip: string[] = []

    public funcUpdateVals   : any;

    /**
     * Simple constructor
     */
    constructor(_plot: IPlot, _manager : BattleManager) {
        this.Plot = _plot
        this.IsActive = false;
        this.IsSubActive = false;
        this.ValIndex = null;
        this.TurnVal = null;
        this.Owner = _manager;
        
        this.UpdateTooltips();
    }

    /**
     * Set the current state of the plot display
     * @param _active if the plot is active
     * @param _subactive if the plot isn't active, but still should be shown
     * @param _index the index of the plot's position in the actions position array
     * @param _turn what turn, if any, should be returned
     */
    public setClickableState(_active : boolean, _subactive :boolean, _index : number, _turn : ChosenAction) {
        this.IsActive = _active;
        this.IsSubActive = _subactive;
        this.ValIndex = _index;
        this.TurnVal = _turn;

        this.UpdateTooltips();

        this.funcUpdateVals();
    }

    private UpdateTooltips() {
        this.Tooltip = []
        this.Tooltip.push("Position: " + this.Plot.position[0] + " - " + this.Plot.position[1])
        if (this.IsActive) {
            this.Tooltip.push("Selectable Plot")
        }
        const Mon = this.CheckForMon()
        if (Mon != "") {
            this.Tooltip.push("Features " + Mon)
        }
    }

    /**
     * Set the function for this manager to
     * trigger the plot update
     * @param updateresults the react component function
     */
    public setUpdateFuncs(updateresults : any) {
        this.funcUpdateVals = updateresults;
    }

    public CheckForMon() {
        let MonName = ""
        this.Owner.BattleState.sides.forEach(_side => 
        { _side.trainers.forEach(_trainer =>  {  _trainer.team.active.forEach(_active => {
            if ((_active.position[0] === this.Plot.position[0]) && (_active.position[1] === this.Plot.position[1])) {
                MonName = _trainer.team.monsters[_active.monster].nickname;
                return;
            }
        }) }) })
        return MonName;
    }

}

export {GamePlot, IGamePlot}