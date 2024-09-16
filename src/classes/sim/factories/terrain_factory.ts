import { Battle } from "../controller/battle";
import { IPlot } from "../models/terrain/terrain_plot";
import { IScene, Scene } from "../models/terrain/terrain_scene";

class TerrainFactory {

    /**
     * Return a Scene object from the Interface equivilent
     * @param _terrain the Scene interface
     * @returns a new Scene object
     */
    public static CreateTerrain(_terrain : IScene, _owner : Battle) {
        const newScene = new Scene(_terrain, _owner);
        return newScene;
    }

    /**
     * Create a new Scene, filled with plots, based on the
     * relevant side specifications.
     * @param _plots the maximum number of monsters that can be active at once per team
     * @param _sides the maximum number of teams that can be in play
     * @returns a new Scene object
     */
    public static CreateNewTerrain(_width : number, _height : number, _owner : Battle) {

        const Plots : IPlot[][] = [];

        for (let i = 0; i < _width; i++) {
            const Row : IPlot[] = []

            for (let j = 0; j < _height; j++) {
                const Plot : IPlot = {
                    position  : [i,j],           // The row this plot is in
                    tokens      : [],        // Tokens held by the plot
                    trackers    : {}    // Misc trackers used by plot tokens
                }

                Row.push(Plot);
            }

            Plots.push(Row)
        }

        const freshScene : IScene = {
            field: [],
            weather: [],
            plots: Plots
        }

        return TerrainFactory.CreateTerrain(freshScene, _owner);
    }

    public static CreateIScene(_width : number, _height : number) {
        const Plots : IPlot[][] = [];

        for (let i = 0; i < _width; i++) {
            const Row : IPlot[] = []

            for (let j = 0; j < _height; j++) {
                const Plot : IPlot = {
                    position  : [i,j],           // The row this plot is in
                    tokens      : [],        // Tokens held by the plot
                    trackers    : {}    // Misc trackers used by plot tokens
                }

                Row.push(Plot);
            }

            Plots.push(Row)
        }

        const freshScene : IScene = {
            field: [],
            weather: [],
            plots: Plots
        }

        return freshScene
    }

}

export {TerrainFactory}