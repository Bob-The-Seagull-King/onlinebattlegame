import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { Scene } from "./terrain_scene";
import { Side } from "./terrain_side";

/**
 * Interface of the Plot object
 */
interface IPlot {
    position    : number,           // The position the plot has within its side
    tokens      : IDEntry[],        // Tokens held by the plot
    trackers    : InfoSetGeneric    // Misc trackers used by plot tokens
}

class Plot {
    public Position : number;           // The position the plot has within its side
    public Tokens   : IDEntry[];        // Tokens held by the plot
    public Trackers : InfoSetGeneric;   // Misc trackers used by plot tokens
    public Side     : Side;             // The side this plot is within
    public Scene    : Scene;            // The scene this plot is within
    public ScenePos : number;           // The position this plot's side has within the scene
    
    /**
     * Simple constructor
     * @param _data The interface representing the Side
     * @param _side The side this plot is inside of
     */
    constructor(_data : IPlot, _side : Side) {
        this.Position = _data.position;
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Side = _side;
        this.Scene = _side.Scene;
        this.ScenePos = _side.Position;
    }

    /**
     * Given a Plot object, give us the IPlot
     * @returns the IPlot reflecting this battlefield
     */
    public ConvertToInterface() {
        const _interface : IPlot = {
            position: this.Position,
            tokens: this.Tokens,
            trackers: this.Trackers
        }
        return _interface;
    }

}

export {Plot, IPlot}