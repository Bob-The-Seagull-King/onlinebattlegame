import { IDEntry, InfoSetGeneric } from "../../../../global_types"
import { Team } from "../team";
import { Scene } from "../terrain/terrain_scene";

/**
 * Interface of the Item object
 */
interface IWeatherEffect {
    tokens      : IDEntry[],        // Tokens held by the plot
    trackers    : InfoSetGeneric,    // Misc trackers used by plot tokens
    weatherEffect : IDEntry
}

class WeatherEffect {

    public Tokens   : IDEntry[];        // Tokens held by the plot
    public Trackers : InfoSetGeneric;   // Misc trackers used by plot tokens
    public Owner    : Scene;
    public Weather  : IDEntry;

    /**
     * Simple constructor
     * @param _data The interface representing the item
     */
    constructor(_data : IWeatherEffect, _owner : Scene) {
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.Owner = _owner;
        this.Weather = _data.weatherEffect;
    }

    /**
     * Given an ActiveItem object, give us the IActiveItem
     * @returns the IActiveItem reflecting this item
     */
    public ConvertToInterface() {
        const _interface : IWeatherEffect = {
            tokens      : this.Tokens,        // Tokens held by the plot
            trackers    : this.Trackers,    // Misc trackers used by plot tokens
            weatherEffect : this.Weather
        }
        return _interface;
    }

}

export {IWeatherEffect, WeatherEffect}