import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";
import { Battle, IBattle } from "../sim/controller/battle";
import { TrainerBase } from "../sim/controller/trainer/trainer_basic";
import { TrainerBot } from "../sim/controller/trainer/trainer_bot";
import { TrainerLocal } from "../sim/controller/trainer/trainer_local";
import { BattleFactory } from "../sim/factories/battle_factory";
import { MonsterFactory } from "../sim/factories/monster_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { TerrainFactory } from "../sim/factories/terrain_factory";
import { ActivePos, Team } from "../sim/models/team";
import { Scene } from "../sim/models/terrain/terrain_scene";
import { BattleManager, IBattleManager } from "./battle_manager";

// Define the Action type
type EventAction = {
    type: string;
    payload?: any;
  };

class OfflineBattleManager extends BattleManager {

    public GameBattle : Battle = null;
    public Trainer : TrainerLocal = null;

    public StartBattle() {
        if (this.GameBattle === null) {
            this.GameBattle = this.GenerateBattle();
            this.ReceiveMessages([{"generic" : "Battle Generated"}])
        } else {
            this.ReceiveMessages([{"generic" : "Battle Already In Place"}])
        }
    }

    public GenerateBattle() {
        const myTeam : Team = TeamFactory.CreateNewTeam();
        myTeam.AddFreshMonster("larvin");
        myTeam.AddFreshMonster("larvin");
        myTeam.Monsters[0].AddFreshAction("tackle");
        myTeam.Monsters[1].AddFreshAction("tackle");
        myTeam.AddFreshItem("temp");
        myTeam.Leads.push(new ActivePos( 0, 0, myTeam))
        const myTrainer : TrainerLocal = new TrainerLocal({team: myTeam.ConvertToInterface(), pos: 0, manager: this, name: "Local"});
        this.Trainer = myTrainer;

        const otherTeam : Team = TeamFactory.CreateNewTeam();
        otherTeam.AddFreshMonster("larvin");
        otherTeam.AddFreshMonster("larvin");
        otherTeam.Monsters[0].AddFreshAction("tackle");
        otherTeam.AddFreshItem("temp");
        otherTeam.Leads.push(new ActivePos(0, 0,otherTeam))
        const otherTrainer : TrainerBot = new TrainerBot({team: otherTeam.ConvertToInterface(), pos: 1, behaviour: [], name: "Bot"});

        const battleScene : Scene = TerrainFactory.CreateNewTerrain(1,2)

        const newBattle : Battle = BattleFactory.CreateBattle([myTrainer, otherTrainer], battleScene, this)
        return newBattle;
    }

    public ReceiveMessages(_messages : MessageSet) {
        this.MessageLog.push(_messages);
        this.funcReceiveResults();   
    }

    public GetTurnsTest() {
        this.GameBattle.GetTurns();
    }

    public ReceiveOptions(_options : TurnChoices, _position : number, _battle: IBattle) {
        console.log(_battle)
        this.ChoicesLog.push({ action : _options, pos : _position})
        this.funcReceiveOptions();
        return new Promise((resolve) => {
            const handleEvent = (event: CustomEvent<EventAction>) => {
              resolve(event.detail);
              document.removeEventListener('selectAction'+_position, handleEvent as EventListener);
            };
        
            document.addEventListener('selectAction'+_position, handleEvent as EventListener);
          });
    }

    public SendOptions(_option : SelectedAction, _position : number) {
        const event = new CustomEvent<EventAction>('selectAction'+_position, { detail: _option });
        document.dispatchEvent(event);
        this.ChoicesLog = this.ChoicesLog.filter(item => item.pos !== _position)
        this.funcReceiveOptions();
    }

}

export {OfflineBattleManager}