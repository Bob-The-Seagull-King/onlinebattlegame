import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { IPlot, Plot } from "./terrain_plot"
import { Scene } from "./terrain_scene"

interface ISide {
    position    : number,
    tokens      : IDEntry[],
    trackers    : InfoSetGeneric,
    plots       : IPlot[]
}

class Side {
    public Position : number;
    public Tokens : IDEntry[];
    public Trackers : InfoSetGeneric;
    public Plots : Plot[];
    public Scene : Scene;

    constructor(_data : ISide, _scene : Scene) {
        this.Scene = _scene;
        this.Position = _data.position;
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Plots = this.PlotGenerator(_data.plots)
    }

    private PlotGenerator(_data : IPlot[]) {
        const NewPlots : Plot[] = [];
        let i = 0;
        for (i = 0; i < _data.length; i++) {
            const TempPlot = new Plot(_data[i], this)
            NewPlots.push(TempPlot);
        }
        return NewPlots;
    }

}

export {Side, ISide}