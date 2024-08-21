import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { Scene } from "./terrain_scene";
import { Side } from "./terrain_side";

interface IPlot {
    position    : number,
    tokens      : IDEntry[],
    trackers    : InfoSetGeneric
}

class Plot {
    public Position : number;
    public Tokens : IDEntry[];
    public Trackers : InfoSetGeneric;
    public Side : Side;
    public Scene : Scene;
    public ScenePos : number;
    
    constructor(_data : IPlot, _side : Side) {
        this.Position = _data.position;
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Side = _side;
        this.Scene = _side.Scene;
        this.ScenePos = _side.Position;
    }

}

export {Plot, IPlot}