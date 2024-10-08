import { SelectedAction, TurnChoices, TurnSelectReturn } from "../../global_types";
import { Battle, IBattle } from "../sim/controller/battle";
import { TrainerBot } from "../sim/controller/trainer/trainer_bot";
import { TrainerLocal } from "../sim/controller/trainer/trainer_local";
import { BattleFactory } from "../sim/factories/battle_factory";
import { MonsterFactory } from "../sim/factories/monster_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { TerrainFactory } from "../sim/factories/terrain_factory";
import { ActivePos, Team } from "../sim/models/team";
import { Scene } from "../sim/models/terrain/terrain_scene";
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
        const myTeam : Team = this.TempNewTeam();
        const myTrainer : TrainerLocal = new TrainerLocal({team: myTeam.ConvertToInterface(), pos: 0, manager: this, name: "Local"});
        this.Trainer = myTrainer;

        const otherTeam : Team = this.TempBotTeam();
        const otherTrainer : TrainerBot = new TrainerBot({team: otherTeam.ConvertToInterface(), pos: 1, behaviour: ['random'], name: "Bot"});

        const battleScene : Scene = TerrainFactory.CreateNewTerrain(1,2)

        const newBattle : Battle = BattleFactory.CreateBattle([myTrainer, otherTrainer], battleScene, this)
        return newBattle;
    }

    
    private TempNewTeam() : Team {
        const _Team : Team = TeamFactory.CreateNewTeam('TempTeam');

        _Team.AddFreshItem('blueherb')
        _Team.AddFreshItem('greenherb')
        _Team.AddFreshItem('savouryberry')
        _Team.AddFreshItem('strongsoil')

        _Team.AddFreshMonster('marrowdread')
        _Team.Monsters[0].AddFreshAction('sparkup')
        _Team.Monsters[0].AddFreshAction('nausea')
        _Team.Monsters[0].AddFreshAction('braindrain')
        _Team.Monsters[0].AddFreshAction('stinger')
        _Team.Monsters[0].Traits.push('vampire')

        _Team.AddFreshMonster('humbood')
        _Team.Monsters[1].AddFreshAction('deeproots')
        _Team.Monsters[1].AddFreshAction('flytrap')
        _Team.Monsters[1].AddFreshAction('pressurecannon')
        _Team.Monsters[1].AddFreshAction('rockthrow')
        _Team.Monsters[1].Traits.push('firstdefense')

        _Team.AddFreshMonster('stalagmitendon')
        _Team.Monsters[2].AddFreshAction('superhotslam')
        _Team.Monsters[2].AddFreshAction('scatter')
        _Team.Monsters[2].AddFreshAction('rockthrow')
        _Team.Monsters[2].AddFreshAction('regrow')
        _Team.Monsters[2].Traits.push('solidcomposition')

        _Team.AddFreshMonster('impound')
        _Team.Monsters[3].AddFreshAction('harshthenoise')
        _Team.Monsters[3].AddFreshAction('flytrap')
        _Team.Monsters[3].AddFreshAction('mindread')
        _Team.Monsters[3].AddFreshAction('slam')
        _Team.Monsters[3].Traits.push('sacrificialaltar')

        _Team.AddFreshMonster('stratate')
        _Team.Monsters[4].AddFreshAction('stormwinds')
        _Team.Monsters[4].AddFreshAction('raindance')
        _Team.Monsters[4].AddFreshAction('blindinglight')
        _Team.Monsters[4].AddFreshAction('slam')
        _Team.Monsters[4].Traits.push('scaryface')

        _Team.Leads.push(new ActivePos(0,0,_Team));

        return _Team;
    }

    private TempBotTeam() : Team {
        const _Team : Team = TeamFactory.CreateNewTeam('TeamTeam');

        _Team.AddFreshItem('blueherb')
        _Team.AddFreshItem('greenherb')
        _Team.AddFreshItem('savouryberry')
        _Team.AddFreshItem('strongsoil')

        _Team.AddFreshMonster('marrowdread')
        _Team.Monsters[0].AddFreshAction('sparkup')
        _Team.Monsters[0].AddFreshAction('nausea')
        _Team.Monsters[0].AddFreshAction('braindrain')
        _Team.Monsters[0].AddFreshAction('stinger')
        _Team.Monsters[0].Traits.push('vampire')

        _Team.AddFreshMonster('humbood')
        _Team.Monsters[1].AddFreshAction('deeproots')
        _Team.Monsters[1].AddFreshAction('flytrap')
        _Team.Monsters[1].AddFreshAction('pressurecannon')
        _Team.Monsters[1].AddFreshAction('rockthrow')
        _Team.Monsters[1].Traits.push('firstdefense')

        _Team.AddFreshMonster('stalagmitendon')
        _Team.Monsters[2].AddFreshAction('superhotslam')
        _Team.Monsters[2].AddFreshAction('scatter')
        _Team.Monsters[2].AddFreshAction('rockthrow')
        _Team.Monsters[2].AddFreshAction('regrow')
        _Team.Monsters[2].Traits.push('solidcomposition')

        _Team.AddFreshMonster('impound')
        _Team.Monsters[3].AddFreshAction('harshthenoise')
        _Team.Monsters[3].AddFreshAction('flytrap')
        _Team.Monsters[3].AddFreshAction('mindread')
        _Team.Monsters[3].AddFreshAction('slam')
        _Team.Monsters[3].Traits.push('sacrificialaltar')

        _Team.AddFreshMonster('stratate')
        _Team.Monsters[4].AddFreshAction('stormwinds')
        _Team.Monsters[4].AddFreshAction('raindance')
        _Team.Monsters[4].AddFreshAction('blindinglight')
        _Team.Monsters[4].AddFreshAction('slam')
        _Team.Monsters[4].Traits.push('scaryface')

        _Team.Leads.push(new ActivePos(0,0,_Team));

        return _Team;
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