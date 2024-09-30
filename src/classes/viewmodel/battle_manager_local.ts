import { ChosenAction, SelectedAction, TurnChoices, TurnSelect, TurnSelectReturn } from "../../global_types";
import { Battle, IBattle } from "../sim/controller/battle";
import { ITrainer } from "../sim/controller/trainer/trainer_basic";
import { ITrainerBot, TrainerBot } from "../sim/controller/trainer/trainer_bot";
import { ITrainerLocal, TrainerLocal } from "../sim/controller/trainer/trainer_local";
import { ITrainerUser } from "../sim/controller/trainer/trainer_user";
import { BattleFactory } from "../sim/factories/battle_factory";
import { MonsterFactory } from "../sim/factories/monster_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { TerrainFactory } from "../sim/factories/terrain_factory";
import { IFieldEffect } from "../sim/models/Effects/field_effect";
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
            this.GameBattle.BattleBegin();
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

        const FieldEffectObstacle : IFieldEffect = {
            tokens      : [],        // Tokens held by the plot
            trackers    : {},    // Misc trackers used by plot tokens
            plots       : [[2,2],[2,3],[3,2],[3,3],[4,3]],
            fieldEffect : 'obstacle'
        }
        
        const Trainers : ITrainer[][] = [];
        const newScene : IScene = TerrainFactory.CreateIScene(6,6)
        newScene.field.push(FieldEffectObstacle);
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
    public ReceiveOptions(_options : TurnSelect) {
        _options.Options.forEach(item => {
            this.ChoicesLog.push({ action : item.Choices, pos : item.Position})
        })
        this.UpdateBattleState(_options.Battle);
        this.funcReceiveOptions();
        return new Promise((resolve) => {
            const handleEvent = (event: CustomEvent<EventAction>) => {
              resolve(event.detail.payload);
              document.removeEventListener('selectAction', handleEvent as EventListener);
            };
        
            document.addEventListener('selectAction', handleEvent as EventListener);
          });
    }

    /**
     * Update the manager's view of the battle
     * @param _battle the new state of the battle
     */
    public UpdateState(_battle : IBattle) {
        this.UpdateBattleState(_battle);
    }
    
    /**
     * Send the chosen option to the battle by triggering
     * an event.
     * @param _option the SelectedAction chosen
     * @param _position the index of the choice made (for when multiple monsters are on the field at once)
     */
    public SendOptions(_action : ChosenAction) {
        const event = new CustomEvent<EventAction>('selectAction', { detail: {type : "CHOICE", payload: _action} });
        document.dispatchEvent(event);
        this.ChoicesLog = []
        this.ClearSelectShow();
        this.funcReceiveOptions();
    }

}

export {OfflineBattleManager}