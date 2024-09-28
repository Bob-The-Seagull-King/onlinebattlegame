import { MonsterType, TypeMatchup } from "../../../data/enum/types";
import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ActionInfoDex } from "../../../data/static/action/action_inf";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { ItemInfoDex } from "../../../data/static/item/item_inf";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { ActionAction, IDEntry, ItemAction, MessageSet, PlaceAction, SelectedAction, SwapAction, TargetSet } from "../../../global_types";
import { ActiveAction } from "../models/active_action";
import { ActiveItem } from "../models/active_item";
import { ActiveMonster } from "../models/active_monster";
import { FieldedMonster, IFieldedMonster } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { Scene } from "../models/terrain/terrain_scene";
import { Battle } from "./battle"
import { TrainerBase } from "./trainer/trainer_basic";

class BattleEvents {

    public Battle : Battle; // The battle that is using this Events object

    /**
     * Simple constructor
     * @param _battle the parent Battle that created this BattleEvents
     */
    constructor(_battle : Battle) {
        this.Battle = _battle;
    }

    public PerformActionPLACE(_action : PlaceAction, _trainer : TrainerBase) {
        const newActive : IFieldedMonster = {
            monster : _action.monster_id,
            position : _action.target_id[0],
            hasactivated : false
        }
        const NewFielded = new FieldedMonster(newActive, _trainer.Team)
        _trainer.Team.Leads.push(NewFielded)
        
        this.Battle.MessageList.push({ "generic" : NewFielded.Monster.Nickname + " has been placed at " + NewFielded.Plot.returnCoordinates().toString()})

        this.Battle.runEvent( "SwitchInMonster", NewFielded.Monster, null, null, null, null, this.Battle.MessageList )
        this.Battle.runEvent( "MonsterEntersField", NewFielded.Monster, null, null, null, null, this.Battle.MessageList )
    }

    public PerformActionSWAP(_action : SwapAction, _trainer : TrainerBase) {
        
        let lead = null;

        for(let i = 0; i < _trainer.Team.Leads.length; i++) {
            if ((_trainer.Team.Leads[i].Position[0] === _action.target_id[0][0]) &&
                (_trainer.Team.Leads[i].Position[1] === _action.target_id[0][1])) {
                lead = _trainer.Team.Leads[i]
            }
        }

        if (lead != null) {     
            const CanSwap = this.Battle.runEvent( "CanSwapOut", lead.Monster, null, null, true, null, this.Battle.MessageList )

            if (CanSwap) {
                this.Battle.runEvent( "SwitchOutMonster", lead.Monster, null, null, null, null, this.Battle.MessageList )
                this.Battle.runEvent( "MonsterExitsField", lead.Monster, null, null, null, null, this.Battle.MessageList )
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " has been swapped out."})

                lead.Monster = _trainer.Team.Monsters[_action.monster_id]          
                  
                this.Battle.runEvent( "SwitchInMonster", lead.Monster, null, null, null, null, this.Battle.MessageList )
                this.Battle.runEvent( "MonsterEntersField", lead.Monster, null, null, null, null, this.Battle.MessageList )
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " has been swapped in."})
            } else {
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " can't swap out."})
            }
        }
        
    }

}

export {BattleEvents}