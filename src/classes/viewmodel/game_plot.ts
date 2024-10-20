import { FieldInfoDex } from "../../data/static/field/field_inf";
import { SpeciesBattleDex } from "../../data/static/species/species_btl";
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
    public ValIndex : any;
    public TurnVal : ChosenAction;
    public Owner : BattleManager;
    public HasEffects: boolean;

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
        this.HasEffects = false;
        this.UpdateTooltips();
    }

    /**
     * Set the current state of the plot display
     * @param _active if the plot is active
     * @param _subactive if the plot isn't active, but still should be shown
     * @param _index the index of the plot's position in the actions position array
     * @param _turn what turn, if any, should be returned
     */
    public setClickableState(_active : boolean, _subactive :boolean, _index : any, _turn : ChosenAction) {
        this.IsActive = _active;
        this.IsSubActive = _subactive;
        this.ValIndex = _index;
        this.TurnVal = _turn;

        this.UpdateTooltips();

        this.funcUpdateVals();
    }

    /**
     * Set if the plot should sub-display
     * @param _subactive the sub-state of the plot
     */
    public setSubState(_subactive :boolean) {
        this.IsSubActive = _subactive;
        this.UpdateTooltips();
        this.funcUpdateVals();
    }

    /**
     * Activates on mouseEnter, adds all relevant sub-selects
     */
    public RunSubItemCheck() {
        if (this.TurnVal) {
            if (this.TurnVal.type === "MOVE") {
                const myClonedArray  = Object.assign([], this.ValIndex);
                this.Owner.UpdatePlotsSub(myClonedArray.slice(1))
            }
            if (this.TurnVal.type === "ITEM") {
                const myClonedArray  = Object.assign([], this.ValIndex);
                this.Owner.UpdatePlotsSub(myClonedArray.slice(1))
            }
        }
    }

    /**
     * Activates on mouseExit, removes all relevant sub-selects
     */
    public ClearSubItem() {
        if (this.TurnVal) {
            if (this.TurnVal.type === "MOVE") {
                const myClonedArray  = Object.assign([], this.ValIndex);
                this.Owner.ClearPlotsSub(myClonedArray.slice(1))
            }
            if (this.TurnVal.type === "ITEM") {
                const myClonedArray  = Object.assign([], this.ValIndex);
                this.Owner.ClearPlotsSub(myClonedArray.slice(1))
            }
        }
    }

    /**
     * Checks if any terrain effects are on this plot
     * @returns Bool of if any terrain effects share this plot
     */
    public CheckEffects() {
        let ValEffect = false;
        for (let i = 0; i < this.Owner.BattleState.scene.field.length; i++) {
            for (let j = 0; j <  this.Owner.BattleState.scene.field[i].plots.length; j++) {
                if ((this.Owner.BattleState.scene.field[i].plots[j][1] === this.Plot.position[1]) && (this.Owner.BattleState.scene.field[i].plots[j][0] === this.Plot.position[0])) {
                    ValEffect = true;
                }
            }
        }
        return ValEffect;
    }

    /**
     * Updates the list of text-items to display when hovering
     * over a plot based on the monsters on it, the terrain effects
     * it has, and if it is selectable.
     */
    private UpdateTooltips() {
        this.Tooltip = []
        this.Tooltip.push("Position: " + this.Plot.position[0] + " - " + this.Plot.position[1])
        if (this.IsActive) {
            this.Tooltip.push("Selectable Plot")
        }
        const Mon = this.CheckForMon()
        if (Mon != "") {
            this.Tooltip.push("Features: " + Mon)
        }
        
        for (let i = 0; i < this.Owner.BattleState.scene.field.length; i++) {
            for (let j = 0; j <  this.Owner.BattleState.scene.field[i].plots.length; j++) {
                if ((this.Owner.BattleState.scene.field[i].plots[j][1] === this.Plot.position[1]) && (this.Owner.BattleState.scene.field[i].plots[j][0] === this.Plot.position[0])) {
                    this.HasEffects = true;
                    this.Tooltip.push("Effect: " + FieldInfoDex[this.Owner.BattleState.scene.field[i].fieldEffect].name)
                }
            }
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

    /**
     * Checks if any monster shares the space of this plot, if so it returns their nickname
     * @returns String representing the nickname, if any, of a monster on this plot
     */
    public CheckForMon() {
        let MonName = ""
        this.Owner.BattleState.sides.forEach(_side => 
        { _side.trainers.forEach(_trainer =>  {  _trainer.team.active.forEach(_active => {
            if ((_active.position[0] === this.Plot.position[0]) && (_active.position[1] === this.Plot.position[1])) {
                MonName = _trainer.team.monsters[_active.monster].nickname + " HP: " + _trainer.team.monsters[_active.monster].hp_cur + "/" + SpeciesBattleDex[_trainer.team.monsters[_active.monster].species].stats.hp
                return;
            }
        }) }) })
        return MonName;
    }

}

export {GamePlot, IGamePlot}