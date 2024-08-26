import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { Plot } from "./terrain_plot";
import { ISide, Side } from "./terrain_side"

interface IScene {
    tokens      : IDEntry[],
    trackers    : InfoSetGeneric,
    sides       : ISide[]
}

class Scene {

    public Tokens: IDEntry[]
    public Trackers : InfoSetGeneric;
    public Sides : Side[];
    public Plots : Plot[];

    constructor(_data : IScene) {
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Sides = [];
        this.Plots = [];
        this.SideGenerator(_data.sides)
    }

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