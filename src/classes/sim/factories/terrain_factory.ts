import { IPlot } from "../models/terrain/terrain_plot";
import { IScene, Scene } from "../models/terrain/terrain_scene";
import { ISide } from "../models/terrain/terrain_side";

class TerrainFactory {

    /**
     * Return a Scene object from the Interface equivilent
     * @param _terrain the Scene interface
     * @returns a new Scene object
     */
    public static CreateTerrain(_terrain : IScene) {
        const newScene = new Scene(_terrain);
        return newScene;
    }

    /**
     * Create a new Scene, filled with plots, based on the
     * relevant side specifications.
     * @param _plots the maximum number of monsters that can be active at once per team
     * @param _sides the maximum number of teams that can be in play
     * @returns a new Scene object
     */
    public static CreateNewTerrain(_plots : number, _sides : number) {
        const Sides : ISide[] = [];

        for (let i = 0; i < _sides; i++) {
            const Plots : IPlot[] = [];            
            for (let j = 0; j < _plots; j++) {
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