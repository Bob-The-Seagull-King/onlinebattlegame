import { Battle } from "../sim/controller/battle";
import { TrainerBase } from "../sim/controller/trainer/trainer_basic";
import { TrainerBot } from "../sim/controller/trainer/trainer_bot";
import { TrainerLocal } from "../sim/controller/trainer/trainer_local";
import { BattleFactory } from "../sim/factories/battle_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { TerrainFactory } from "../sim/factories/terrain_factory";
import { Team } from "../sim/models/team";
import { Scene } from "../sim/models/terrain/terrain_scene";
import { BattleManager, IBattleManager } from "./battle_manager";

class OfflineBattleManager extends BattleManager {

    public GameBattle : Battle = null;


    public StartBattle() {
        if (this.GameBattle === null) {
            this.GameBattle = this.GenerateBattle();
            this.ReturnMessage({message:"Battle Generated"});
        } else {
            this.ReturnMessage({message:"Battle Already In Place"});
        }
    }

    public GenerateBattle() {
        
        const myTeam : Team = TeamFactory.CreateNewTeam();
        const otherTeam : Team = TeamFactory.CreateNewTeam();

        const myTrainer : TrainerLocal = new TrainerLocal({team: myTeam, pos: 0});
        const otherTrainer : TrainerBot = new TrainerBot({team: otherTeam, pos: 1, behaviour: []});

        const battleScene : Scene = TerrainFactory.CreateNewTerrain(1,2)

        const newBattle : Battle = BattleFactory.CreateBattle([myTrainer, otherTrainer], battleScene)
        return newBattle;
    }

}

export {OfflineBattleManager}