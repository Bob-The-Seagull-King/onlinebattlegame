import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";
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
    public Trainer : TrainerLocal = null;

    public StartBattle() {
        if (this.GameBattle === null) {
            this.GameBattle = this.GenerateBattle();
            this.funcReceiveResults("Battle Generated");
        } else {
            this.funcReceiveResults("Battle Already In Place");
        }
    }

    public GenerateBattle() {
        const myTeam : Team = TeamFactory.CreateNewTeam();
        const myTrainer : TrainerLocal = new TrainerLocal({team: myTeam, pos: 0, manager: this});
        this.Trainer = myTrainer;

        const otherTeam : Team = TeamFactory.CreateNewTeam();
        const otherTrainer : TrainerBot = new TrainerBot({team: otherTeam, pos: 1, behaviour: []});

        const battleScene : Scene = TerrainFactory.CreateNewTerrain(1,2)

        const newBattle : Battle = BattleFactory.CreateBattle([myTrainer, otherTrainer], battleScene, this)
        return newBattle;
    }

    public ReceiveMessages(_messages : MessageSet) {
        let Val = "";
        _messages.forEach(element => {
            Object.keys(element).forEach(item => {
                Val += "\n" + item + " : " + element[item].type + element[item].trainer.Position;
            })
        })
        this.funcReceiveResults(Val.toString())
    }

    public GetTurnsTest() {
        this.GameBattle.GetTurns();
    }

    public ReceiveOptions(_options : TurnChoices) {
        this.funcReceiveOptions(_options);
    }

    public SendOptions(_option : SelectedAction) {
        console.log(_option);
    }

}

export {OfflineBattleManager}