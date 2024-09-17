import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { FieldEffect } from "../Effects/field_effect";
import { Scene } from "./terrain_scene";

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

    public IsPlaceable() {
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

        const IsPlacable = this.Scene.Owner.runEvent('CanHaveOccupant', this, null, null, !HasMonster, HasMonster, this.Scene.Owner.MessageList);
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

}

export {Plot, IPlot}