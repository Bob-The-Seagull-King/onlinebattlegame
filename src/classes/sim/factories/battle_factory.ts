import { Battle, IBattle } from "../controller/battle";
import { ITrainer, TrainerBase } from "../controller/trainer/trainer_basic";
import { IBattleSide } from "../models/battle_side";
import { IScene, Scene } from "../models/terrain/terrain_scene";

class BattleFactory {

    /**
     * Creates a new battle based on provided objects
     * @param _trainers Array of trainers involved in the battle
     * @param _scene The battlefield it takes place in
     * @param _manager The message receiving object
     * @returns a new Battle object
     */
    static CreateBattle(_battle : IBattle, _manager : any ) {
        const battle = new Battle(_battle, _manager)
        return battle;
    }

    static CreateNewBattle(_trainers : ITrainer[][], _scene : IScene, _manager : any, _turns : number) {
        const sides : IBattleSide[] = []

        // Assumes Only Two Sets Of Trainers
        // Assumes scenes are square
            for (let i = 0; i < _trainers.length; i++) {
                const plotsides: number[][] = []

                const parity = (i % 2)
                const rows = _scene.plots[0].length;
                const columns = _scene.plots.length

                for (let j = 0; j < columns; j++) {
                    for (let k = 0; k < (Math.floor(rows/2)); k++) {
                        plotsides.push([j,(((parity === 0)? (rows-1-k) : k) )])
                    }
                }

                const _side : IBattleSide = {
                    position : i,
                    plots : plotsides,
                    trainers : _trainers[i]
                }
                sides.push(_side);
            }

        //

        const _battle : IBattle = {
            sides       : sides,
            scene       : _scene,        // The interface form of the battle Scene
            turns       : _turns
        }

        return BattleFactory.CreateBattle(_battle, _manager);
    }

}

export {BattleFactory}