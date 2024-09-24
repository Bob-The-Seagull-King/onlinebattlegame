import { ChosenAction, MessageSet, SelectedAction, TurnChoices, TurnSelect } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { IPlot } from "../sim/models/terrain/terrain_plot";
import { MessageTranslator } from "../tools/translator";

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

    public funcUpdateVals   : any;

    /**
     * Simple constructor
     */
    constructor(_plot: IPlot) {
        this.Plot = _plot
        this.IsActive = false;
        this.IsSubActive = false;
        this.ValIndex = null;
        this.TurnVal = null;
    }

    public setClickableState(_active : boolean, _subactive :boolean, _index : number, _turn : ChosenAction) {
        this.IsActive = _active;
        this.IsSubActive = _subactive;
        this.ValIndex = _index;
        this.TurnVal = _turn;
        this.funcUpdateVals();
    }

    public setUpdateFuncs(updateresults : any) {
        this.funcUpdateVals = updateresults;
    }

}

export {GamePlot, IGamePlot}