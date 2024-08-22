import { BattleManager } from "../../viewmodel/battle_manager";
import { Battle } from "../controller/battle";
import { TrainerBase } from "../controller/trainer/trainer_basic";
import { Scene } from "../models/terrain/terrain_scene";

class BattleFactory {

    static CreateBattle(_trainers : TrainerBase[], _scene : Scene, _manager : any ) {
        const battle = new Battle(_trainers, _scene, _manager)
        return battle;
    }

}

export {BattleFactory}