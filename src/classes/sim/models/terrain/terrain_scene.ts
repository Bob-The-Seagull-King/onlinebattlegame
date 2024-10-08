import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { Battle } from "../../controller/battle";
import { FieldEffect, IFieldEffect } from "../Effects/field_effect";
import { IWeatherEffect, WeatherEffect } from "../Effects/weather_effect";
import { FieldedMonster } from "../team";
import { IPlot, Plot, IMovePlot } from "./terrain_plot";



/**
 * Interface of the Scene object
 */
interface IScene {
    weather     : IWeatherEffect[],
    field       : IFieldEffect[],
    plots       : IPlot[][],           // Array of plots within the scene
    width       : number,
    height      : number
}

class Scene {

    public Weather  : WeatherEffect[]
    public Field    : FieldEffect[]
    public Plots    : Plot[][];           // Array of plots within the scene
    public Owner    : Battle
    public Width    : number
    public Height   : number

    /**
     * Simple constructor
     * @param _data The interface representing the scene
     */
    constructor(_data : IScene, _owner : Battle) {
        this.Owner = _owner;
        this.Width = _data.width;
        this.Height = _data.height;
        this.Plots = [];
        this.PlotGenerator(_data.plots)
        this.Weather = [];
        this.WeatherGenerator(_data.weather)
        this.Field = [];
        this.FieldGenerator(_data.field)
    }

    /**
     * Takes an array of ISides and produces the relevant
     * Side and Plot objects for the Scene.
     * @param _data array of ISides
     */
    private PlotGenerator(_data : IPlot[][]) {
        for (let i = 0; i < _data.length; i++) {
            const Row : Plot[] = []

            for (let j = 0; j < _data[i].length; j++) {
                const _plot = new Plot(_data[i][j], this);
                Row.push(_plot);
            }

            this.Plots.push(Row);
        }
    }

    /**
     * Takes an array of ISides and produces the relevant
     * Side and Plot objects for the Scene.
     * @param _data array of ISides
     */
    private WeatherGenerator(_data : IWeatherEffect[]) {
        for (let i = 0; i < _data.length; i++) {            
            const _plot = new WeatherEffect(_data[i], this);
            this.Weather.push(_plot);
        }
    }

    /**
     * Takes an array of ISides and produces the relevant
     * Side and Plot objects for the Scene.
     * @param _data array of ISides
     */
    private FieldGenerator(_data : IFieldEffect[]) {
        for (let i = 0; i < _data.length; i++) {            
            const _plot = new FieldEffect(_data[i], this);
            this.Field.push(_plot);
        }
    }

    public ReturnGivenPlot(column : number, row : number) {
        return this.Plots[column][row]
    }

    /**
     * Given a Scene object, give us the
     * IScene, with all child objects also converted
     * into their respective interfaces
     * @returns the IScene reflecting this battlefield
     */
    public ConvertToInterface() {
        const _plots : IPlot[][] = []
        const _field : IFieldEffect[] = []
        const _weather : IWeatherEffect[] = []
        this.Plots.forEach(item => {
            const column : IPlot[] = []
            item.forEach(plot => {
                column.push(plot.ConvertToInterface())
            })
            _plots.push(column)
        })
        this.Weather.forEach(item => {
            _weather.push(item.ConvertToInterface())
        })
        this.Field.forEach(item => {
            _field.push(item.ConvertToInterface())
        })            

        const _interface : IScene = {
            plots: _plots,
            field: _field,
            weather : _weather,
            width: this.Width,
            height: this.Height
        }
        return _interface;
    }

    public async GenerateMovesetPlots(_sourceMonster : FieldedMonster): Promise<IMovePlot[]> {
        const MovePlots : IMovePlot[] = []

        for (let i = 0; i < this.Plots.length; i++) {
            const MovePromise = this.Plots[i].map(async _plot => {
                const moveplot : IMovePlot = await _plot.UpdateMovePlot(_sourceMonster)
                if (moveplot) { MovePlots.push(moveplot); }})
                    
            await Promise.all(MovePromise);
        }
        
        return MovePlots;
    }

}

export {Scene, IScene}