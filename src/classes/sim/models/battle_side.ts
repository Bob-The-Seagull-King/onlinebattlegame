import { IDEntry, InfoSetGeneric } from "../../../global_types"
import { Battle } from "../controller/battle";
import { ITrainer, TrainerBase } from "../controller/trainer/trainer_basic";
import { TrainerFactory } from "../factories/trainer_factory";
import { Plot } from "./terrain/terrain_plot";

/**
 * Interface of the Item object
 */
interface IBattleSide {
    plots : number[][],
    trainers : ITrainer[],
    position : number
}

class BattleSide {

    public Owner : Battle;
    public Plots : Plot[];
    public Trainers : TrainerBase[]
    public Position : number;


    /**
     * Simple constructor
     * @param _data The interface representing the item
     */
    constructor(_data : IBattleSide, _owner : Battle) {
        this.Owner = _owner;
        this.Trainers = this.TrainerGenerator(_data.trainers)
        this.Plots = this.PlotGenerator(_data.plots)
        this.Position = _data.position;
    }

    private PlotGenerator(_data : number[][]) {
        const PlotList : Plot[] = [];
        let i = 0;
        for (i = 0; i < _data.length; i++) {
            const _plot : Plot = this.Owner.Scene.ReturnGivenPlot(_data[i][0], _data[i][1])
            PlotList.push(_plot);
        }
        return PlotList;
    }

    
    /**
     * Converts the IActiveItems to usable ActiveItem
     * objects.
     * @param _items List of items to recreate
     * @returns Array of ActiveItem objects
     */
    private TrainerGenerator(_items : ITrainer[]) {
        const ItemList : TrainerBase[] = [];
        let i = 0;
        for (i = 0; i < _items.length; i++) {
            const _trainer : TrainerBase = TrainerFactory.CreateTrainer(_items[i], this)
            _trainer.Position = i;
            ItemList.push(_trainer)
        }
        return ItemList;
    }

    /**
     * Given an ActiveItem object, give us the IActiveItem
     * @returns the IActiveItem reflecting this item
     */
    public ConvertToInterface() {
        const _plots : number[][] = []
        const _trainers : ITrainer[] = []
        this.Plots.forEach(item => {
            _plots.push(item.returnCoordinates())
        })
        this.Trainers.forEach(item => {
            _trainers.push(item.ConvertToInterface())
        })
        const _interface : IBattleSide = {
            position : this.Position,
            plots : _plots,
            trainers : _trainers
        }
        return _interface;
    }

    public IsSideAlive() {
        let IsAlive = false;

        for (let i = 0; i < this.Trainers.length; i++) {
            if (this.Trainers[i].Team.IsTeamAlive() === true) {
                IsAlive = true;
                break;
            }
        }

        return IsAlive
    }

}

export {IBattleSide, BattleSide}