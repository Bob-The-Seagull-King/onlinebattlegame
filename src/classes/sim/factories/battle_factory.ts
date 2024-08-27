import { Battle } from "../controller/battle";
import { TrainerBase } from "../controller/trainer/trainer_basic";
import { Scene } from "../models/terrain/terrain_scene";

class BattleFactory {

    /**
     * Creates a new battle based on provided objects
     * @param _trainers Array of trainers involved in the battle
     * @param _scene The battlefield it takes place in
     * @param _manager The message receiving object
     * @returns a new Battle object
     */
    static CreateBattle(_trainers : TrainerBase[], _scene : Scene, _manager : any ) {
        const battle = new Battle(_trainers, _scene, _manager)
        return battle;
    }

}

export {BattleFactory}