import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { FieldEffect } from "../Effects/field_effect";
import { FieldedMonster } from "../team";
import { Scene } from "./terrain_scene";

interface IMovePlot {
    self        : Plot,
    cost_enter  : number,
    cost_exit   : number,
    cost_f      : number,
    cost_g      : number,
    valid       : boolean,
    parent      : IMovePlot | null,
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

    /**
     * Gets the coordinates in a 2-length array
     * @returns number array
     */
    public returnCoordinates() {
        return [this.Column, this.Row]
    }

    /**
     * Appends a field effect to the plot's
     * internal list.
     * @param _effect The effect to add
     */
    public AddFieldEffect(_effect : FieldEffect) {
        this.FieldEffects.push(_effect);
        _effect.Plots.push(this);
    }

    /**
     * Determines if this plot allows monsters to
     * enter or move through them.
     * @returns If a monster can enter this space (true) or not (false)
     */
    public async IsPlaceable() {
        let HasMonster = await this.IsOccupied();

        const IsPlacable : boolean = await this.Scene.Owner.runEvent('CanHaveOccupant', this, null, null, !HasMonster, HasMonster, this.Scene.Owner.MessageList);
        return IsPlacable;
    }

    /**
     * @returns if a monster is in this plot
     */
    public async IsOccupied() {
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

        return HasMonster
    }
    
    /**
     * Removes an effect from the plot, assuming
     * that this plot has that effect.
     * @param _effect The effect to remove
     */
    public RemoveFieldEffect(_effect : FieldEffect) {
        for (let i = 0; i < this.FieldEffects.length; i++) {
            if (this.FieldEffects[i] === _effect) {
                this.FieldEffects.splice(i, 1);
                break;
            }
        }
    }

    /**
     * Creates a MovePlot for this plot, a MovePlot
     * contains information needed for searching through
     * possible paths.
     * @param _sourceMonster The monster a move plot is being generated for
     * @returns The move plot being created
     */
    public async UpdateMovePlot(_sourceMonster : FieldedMonster) {
        const NeighbourList : Plot[] = [];

        if (this.Column < (this.Scene.Width - 1)) {  NeighbourList.push(this.Scene.Plots[this.Column + 1][this.Row]) }
        if (this.Column > (0)) {  NeighbourList.push(this.Scene.Plots[this.Column - 1][this.Row]) }
        if (this.Row < (this.Scene.Height - 1)) {  NeighbourList.push(this.Scene.Plots[this.Column][this.Row + 1]) }
        if (this.Row > (0)) {  NeighbourList.push(this.Scene.Plots[this.Column][this.Row - 1]) }

        const SelfPlot : IMovePlot = {
            self        : this,
            cost_enter  : await this.Scene.Owner.runEvent('PlotEnterCost', this, null, null, 1, null, this.Scene.Owner.MessageList),
            cost_exit   : await this.Scene.Owner.runEvent('PlotExitCost', this, null, null, 0, null, this.Scene.Owner.MessageList),
            cost_f      : null,
            cost_g      : null,
            valid       : await this.IsPlaceable(),
            parent      : null,
            neighbours  : NeighbourList
        }

        this.MovePlot = SelfPlot;
        return SelfPlot;
    }

}

export {Plot, IPlot, IMovePlot}