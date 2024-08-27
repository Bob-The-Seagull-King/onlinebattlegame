import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { Plot } from "./terrain_plot";
import { ISide, Side } from "./terrain_side"

/**
 * Interface of the Scene object
 */
interface IScene {
    tokens      : IDEntry[],        // Tokens held by the scene
    trackers    : InfoSetGeneric,   // Misc trackers used by scene tokens
    sides       : ISide[]           // Array of sides within the scene
}

class Scene {

    public Tokens   : IDEntry[]         // Tokens held by the scene
    public Trackers : InfoSetGeneric;   // Misc trackers used by scene tokens
    public Sides    : Side[];           // Array of sides within the scene
    public Plots    : Plot[];           // Array of plots within the scene

    /**
     * Simple constructor
     * @param _data The interface representing the scene
     */
    constructor(_data : IScene) {
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Sides = [];
        this.Plots = [];
        this.SideGenerator(_data.sides)
    }

    /**
     * Takes an array of ISides and produces the relevant
     * Side and Plot objects for the Scene.
     * @param _data array of ISides
     */
    private SideGenerator(_data : ISide[]) {
        let i = 0;
        for (i = 0; i < _data.length; i++) {
            const TempSide = new Side(_data[i], this);
            this.Sides.push(TempSide);
            let j = 0;
            for (j = 0; j < TempSide.Plots.length; j++) {
                this.Plots.push(TempSide.Plots[j]);
            }
        }
    }

    /**
     * Given a Scene object, give us the
     * IScene, with all child objects also converted
     * into their respective interfaces
     * @returns the IScene reflecting this battlefield
     */
    public ConvertToInterface() {
        const _sides : ISide[] = []
        this.Sides.forEach(item => {
            _sides.push(item.ConvertToInterface())
        })
        const _interface : IScene = {
            tokens: this.Tokens,
            trackers: this.Trackers,
            sides: _sides
        }
        return _interface;
    }

}

export {Scene, IScene}