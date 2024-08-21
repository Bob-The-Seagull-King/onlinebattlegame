import { Battle } from "../controller/battle";
import { TrainerBase } from "../controller/trainer/trainer_basic";
import { Scene } from "../models/terrain/terrain_scene";

class BattleFactory {

    static CreateBattle(_trainers : TrainerBase[], _scene : Scene ) {
        const battle = new Battle(_trainers, _scene)
        return battle;
    }

}

export {BattleFactory}