import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { FieldEffect } from "../Effects/field_effect";
import { FieldedMonster } from "../team";
import { Scene } from "./terrain_scene";

interface IMovePlot {
    self        : Plot,
    cost_enter  : number,
    cost_exit   : number,
    cost_f      : number,
    valid       : boolean,
    parent      : Plot | null,
    neighbours  : Plot[]
}

/**
 * Interface of the Plot object
 */
interface IPlot {
    position : number[]
    tokens      : IDEntry[],        // Tokens held by the plot
    trackers    : InfoSetGeneric    // Misc trackers used by plot tokens
}

class Plot {
    public Row : number;           // The Row
    public Column : number;         // The Column
    public Tokens   : IDEntry[];        // Tokens held by the plot
    public Trackers : InfoSetGeneric;   // Misc trackers used by plot tokens
    public Scene    : Scene;            // The scene this plot is within
    public FieldEffects : FieldEffect[] = []
    public MovePlot : IMovePlot = null;
    
    /**
     * Simple constructor
     * @param _data The interface representing the Side
     * @param _side The side this plot is inside of
     */
    constructor(_data : IPlot, _scene : Scene) {
        this.Row = _data.position[1];
        this.Column = _data.position[0];
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Scene = _scene;
    }

    /**
     * Given a Plot object, give us the IPlot
     * @returns the IPlot reflecting this battlefield
     */
    public ConvertToInterface() {
        const _interface : IPlot = {
            position: [this.Column, this.Row],
            tokens: this.Tokens,
            trackers: this.Trackers
        }
        return _interface;
    }

    public returnCoordinates() {
        return [this.Column, this.Row]
    }

    public AddFieldEffect(_effect : FieldEffect) {
        this.FieldEffects.push(_effect);
    }

    public async IsPlaceable() {
        let HasMonster = false;

        this.Scene.Owner.Sides.forEach( _side => {
            _side.Trainers.forEach(_trainer => {
                _trainer.Team.Leads.forEach( _lead => {
                    if (_lead.Plot === this) {
                        HasMonster = true;
                    }
                })
            })
        })

        const IsPlacable : boolean = await this.Scene.Owner.runEvent('CanHaveOccupant', this, null, null, !HasMonster, HasMonster, this.Scene.Owner.MessageList);
        return IsPlacable;
    }
    
    public RemoveFieldEffect(_effect : FieldEffect) {
        for (let i = 0; i < this.FieldEffects.length; i++) {
            if (this.FieldEffects[i] === _effect) {
                this.FieldEffects.splice(i, 1);
                break;
            }
        }
    }

    public async UpdateMovePlot(_sourceMonster : FieldedMonster) {


        const NeighbourList : Plot[] = [];

        if (this.Column < (this.Scene.Width - 1)) {  NeighbourList.push(this.Scene.Plots[this.Column + 1][this.Row]) }
        if (this.Column > (0)) {  NeighbourList.push(this.Scene.Plots[this.Column - 1][this.Row]) }
        if (this.Row < (this.Scene.Height - 1)) {  NeighbourList.push(this.Scene.Plots[this.Column][this.Row + 1]) }
        if (this.Row > (0)) {  NeighbourList.push(this.Scene.Plots[this.Column][this.Row - 1]) }

        const SelfPlot : IMovePlot = {
            self        : this,
            cost_enter  : await this.Scene.Owner.runEvent('PlotEnterCost', this, _sourceMonster, null, 1, null, this.Scene.Owner.MessageList),
            cost_exit   : await this.Scene.Owner.runEvent('PlotExitCost', this, _sourceMonster, null, 0, null, this.Scene.Owner.MessageList),
            cost_f      : null,
            valid       : await this.IsPlaceable(),
            parent      : null,
            neighbours  : NeighbourList
        }

        this.MovePlot = SelfPlot;

        return SelfPlot;
    }

}

export {Plot, IPlot, IMovePlot}