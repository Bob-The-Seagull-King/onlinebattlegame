import { SelectedAction, TurnChoices, TurnSelectReturn } from "../../global_types";
import { Battle, IBattle } from "../sim/controller/battle";
import { ITrainer } from "../sim/controller/trainer/trainer_basic";
import { ITrainerBot, TrainerBot } from "../sim/controller/trainer/trainer_bot";
import { ITrainerLocal, TrainerLocal } from "../sim/controller/trainer/trainer_local";
import { ITrainerUser } from "../sim/controller/trainer/trainer_user";
import { BattleFactory } from "../sim/factories/battle_factory";
import { MonsterFactory } from "../sim/factories/monster_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { TerrainFactory } from "../sim/factories/terrain_factory";
import { IFieldedMonster, FieldedMonster, Team, ITeam } from "../sim/models/team";
import { IScene, Scene } from "../sim/models/terrain/terrain_scene";
import { BattleManager } from "./battle_manager";

// Used for handling events
type EventAction = {
    type: string; // The name of the event
    payload?: any; // The content of the event message
  };

class OfflineBattleManager extends BattleManager {

    public GameBattle   : Battle = null;        // The game being played locally
    public Trainer      : TrainerLocal = null;  // The local user's trainer

    /**
     * Creates and then starts a new battle.
     */
    public StartBattle() {
        if (this.GameBattle === null) {
            this.GameBattle = this.GenerateBattle();
            this.ReceiveMessages([{"generic" : "Battle Generated"}])
        } else {
            this.ReceiveMessages([{"generic" : "Battle Already In Place"}])
        }
    }

    /**
     * Generates a Battle
     * @returns the newly created battle
     */
    public GenerateBattle() {
        const myTeam : ITeam = this.TempNewTeam();
        const myTrainer : ITrainerLocal = {team: myTeam, pos: 0, manager: this, name: "Local", type: 'local'};

        const otherTeam : ITeam = this.TempBotTeam();
        const otherTrainer : ITrainerBot = {type : 'bot', team: otherTeam, pos: 1, behaviour: ['random'], name: "Bot"};

        
        const Trainers : ITrainer[][] = [];
        const newScene : IScene = TerrainFactory.CreateIScene(6,6)
        Trainers.push([myTrainer]);
        Trainers.push([otherTrainer]);

        const newBattle : Battle = BattleFactory.CreateNewBattle(Trainers, newScene, this, 2);
        this.Trainer = newBattle.Sides[0].Trainers[0] as TrainerLocal;
        return newBattle;
    }

    
    private TempNewTeam() : ITeam {
        const _Team : Team = TeamFactory.CreateNewTeam('TempTeam', null);

        _Team.AddFreshMonster("cleric");
        _Team.AddFreshMonster("terrain");
        _Team.AddFreshMonster("nimble");
        _Team.AddFreshMonster("bruiser");
        _Team.AddFreshMonster("arcane");
        _Team.AddFreshMonster("evolvea");

        const _teamfinal : ITeam =  _Team.ConvertToInterface();
        return _teamfinal;
    }

    private TempBotTeam() : ITeam {
        const _Team : Team = TeamFactory.CreateNewTeam('TeamTeam', null);

        _Team.AddFreshMonster("cleric");
        _Team.AddFreshMonster("terrain");
        _Team.AddFreshMonster("nimble");
        _Team.AddFreshMonster("bruiser");
        _Team.AddFreshMonster("arcane");
        _Team.AddFreshMonster("evolvea");
        
        const _teamfinal : ITeam =  _Team.ConvertToInterface();
        return _teamfinal;
    }

    /**
     * Received a list of possible choices from the battle and prompts
     * the user to select one of them
     * @param _options collection of possible actions to take
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     * @param _battle current state of the battle
     */
    public ReceiveOptions(_options : TurnChoices, _position : number, _battle: IBattle) {
        this.BattleState = _battle;
        this.ChoicesLog.push({ action : _options, pos : _position})
        this.funcReceiveOptions();
        return new Promise((resolve) => {
            const handleEvent = (event: CustomEvent<EventAction>) => {
              resolve(event.detail.payload);
              document.removeEventListener('selectAction'+_position, handleEvent as EventListener);
            };
        
            document.addEventListener('selectAction'+_position, handleEvent as EventListener);
          });
    }

    public UpdateState(_battle : IBattle) {
        this.UpdateBattleState(_battle);
    }
    
    /**
     * Send the chosen option to the battle by triggering
     * an event.
     * @param _option the SelectedAction chosen
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     */
    public SendOptions(_type : string, _index : number, _element: number, _position : number) {
        const TempMandatory : TurnSelectReturn = {actiontype : _type, itemIndex: _index, subItemIndex: _element}
        const event = new CustomEvent<EventAction>('selectAction'+_position, { detail: {type : "CHOICE", payload: TempMandatory} });
        document.dispatchEvent(event);
        this.ChoicesLog = this.ChoicesLog.filter(item => item.pos !== _position)
        this.funcReceiveOptions();
    }

}

export {OfflineBattleManager}