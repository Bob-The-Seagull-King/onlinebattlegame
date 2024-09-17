import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { Team } from "../team";
import { Plot } from "../terrain/terrain_plot";
import { Scene } from "../terrain/terrain_scene";

/**
 * Interface of the Item object
 */
interface IFieldEffect {
    tokens      : IDEntry[],        // Tokens held by the plot
    trackers    : InfoSetGeneric,    // Misc trackers used by plot tokens
    plots       : number[][],
    fieldEffect : IDEntry
}

class FieldEffect {

    public Tokens   : IDEntry[];        // Tokens held by the plot
    public Trackers : InfoSetGeneric;   // Misc trackers used by plot tokens
    public Plots    : Plot[]
    public Owner    : Scene;
    public Field    : IDEntry;

    /**
     * Simple constructor
     * @param _data The interface representing the item
     */
    constructor(_data : IFieldEffect, _owner : Scene) {
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Plots = this.PlotGenerator(_data.plots)
        this.Owner = _owner;
        this.Field = _data.fieldEffect;
    }

    private PlotGenerator(_data : number[][]) {
        const PlotList : Plot[] = [];
        let i = 0;
        for (i = 0; i < _data.length; i++) {
            const _plot : Plot = this.Owner.ReturnGivenPlot(_data[i][0], _data[i][1])
            PlotList.push(_plot);
            _plot.AddFieldEffect(this)
        }
        return PlotList;
    }

    /**
     * Given an ActiveItem object, give us the IActiveItem
     * @returns the IActiveItem reflecting this item
     */
    public ConvertToInterface() {
        const _plots : number[][] = []
        this.Plots.forEach(item => {
            _plots.push(item.returnCoordinates())
        })

        const _interface : IFieldEffect = {
            tokens      : this.Tokens,        // Tokens held by the plot
            trackers    : this.Trackers,    // Misc trackers used by plot tokens
            plots       : _plots,
            fieldEffect : this.Field
        }
        return _interface;
    }

}

export {IFieldEffect, FieldEffect}