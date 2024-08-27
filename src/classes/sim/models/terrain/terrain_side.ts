import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { IPlot, Plot } from "./terrain_plot"
import { Scene } from "./terrain_scene"

/**
 * Interface of the Side object
 */
interface ISide {
    position    : number,           // The position this side has inside the scene
    tokens      : IDEntry[],        // Tokens held by this side
    trackers    : InfoSetGeneric,   // Misc trackers used by side tokens
    plots       : IPlot[]           // Array of plots within this side
}

class Side {
    public Position : number;           // The position this side takes inside the scene
    public Tokens   : IDEntry[];        // Tokens held by this side
    public Trackers : InfoSetGeneric;   // Misc trackers used by side tokens
    public Plots    : Plot[];           // Array of all Plots on this side of the scene
    public Scene    : Scene;            // The scene this Side is a part of

    /**
     * Simple constructor
     * @param _data The interface representing the Side
     * @param _scene The scene this side is inside of
     */
    constructor(_data : ISide, _scene : Scene) {
        this.Scene = _scene;
        this.Position = _data.position;
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Plots = this.PlotGenerator(_data.plots)
    }

    /**
     * Takes an array of IPlots and produces the relevant
     * Plot objects for this Side.
     * @param _data array of IPlots
     */
    private PlotGenerator(_data : IPlot[]) {
        const NewPlots : Plot[] = [];
        let i = 0;
        for (i = 0; i < _data.length; i++) {
            const TempPlot = new Plot(_data[i], this)
            NewPlots.push(TempPlot);
        }
        return NewPlots;
    }

    /**
     * Given a Side object, give us the
     * ISide, with all child objects also converted
     * into their respective interfaces
     * @returns the ISide reflecting this battlefield
     */
    public ConvertToInterface() {
        const _plots : IPlot[] = []
        this.Plots.forEach(item => {
            _plots.push(item.ConvertToInterface())
        })
        const _interface : ISide = {
            position: this.Position,
            tokens: this.Tokens,
            trackers: this.Trackers,
            plots: _plots
        }
        return _interface;
    }

}

export {Side, ISide}