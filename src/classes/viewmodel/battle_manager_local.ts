import { MessageSet, SelectedAction, TurnChoices } from "../../global_types";
import { Battle } from "../sim/controller/battle";
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
        myTeam.AddFreshMonster("temp");
        myTeam.Monsters[0].AddFreshAction("temp");
        myTeam.Leads.push(new ActivePos( myTeam.Monsters[0], 0))
        myTeam.AddFreshMonster("temp");
        myTeam.Monsters[1].AddFreshAction("temp");
        myTeam.Leads.push(new ActivePos( myTeam.Monsters[1], 1))
        const myTrainer : TrainerLocal = new TrainerLocal({team: myTeam, pos: 0, manager: this, name: "Local"});
        this.Trainer = myTrainer;

        const otherTeam : Team = TeamFactory.CreateNewTeam();
        otherTeam.AddFreshMonster("temp");
        otherTeam.Monsters[0].AddFreshAction("temp");
        otherTeam.Leads.push(new ActivePos( otherTeam.Monsters[0], 0))
        const otherTrainer : TrainerBot = new TrainerBot({team: otherTeam, pos: 1, behaviour: [], name: "Bot"});

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

    public ReceiveOptions(_options : TurnChoices, _position : number) {
        Object.keys(_options).forEach(item =>  {
            _options[item].forEach(element => {
            this.ChoicesLog.push({ action : element, pos : _position})
            })
        })
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