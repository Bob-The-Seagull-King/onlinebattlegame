import { IDEntry } from "../../../global_types";
import { ITeam, Team } from "../models/team";
import { IPlot } from "../models/terrain/terrain_plot";
import { IScene, Scene } from "../models/terrain/terrain_scene";
import { ISide } from "../models/terrain/terrain_side";

class TerrainFactory {

    public static CreateTerrain(_terrain : IScene) {
        const newScene = new Scene(_terrain);
        return newScene;
    }

    public static CreateNewTerrain(_plots : number, _sides : number) {
        const Sides : ISide[] = [];
        let i = 0;

        for (i = 0; i < _sides; i++) {
            const Plots : IPlot[] = [];
            let j = 0;
            
            for (j = 0; j < _plots; j++) {
                const Plot : IPlot = { position : j, tokens : [], trackers : {} }
                Plots.push(Plot);
            }
            const Side : ISide = { position : i, tokens : [], trackers : {}, plots : Plots }
            Sides.push(Side);
        }

        const freshScene : IScene = {
            tokens : [],
            trackers : {},
            sides: Sides
        }
        return TerrainFactory.CreateTerrain(freshScene);
    }

}

export {TerrainFactory}