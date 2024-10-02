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
import { FieldEffect } from "../models/Effects/field_effect";
import { WeatherEffect } from "../models/Effects/weather_effect";
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

    /**
     * Given a PLACE action, perform it.
     * Take a non-fielded monster and place it in
     * an empty plot.
     * @param _action the PLACE action to perform
     * @param _trainer the trainer this action refers to
     */
    public PerformActionPLACE(_action : PlaceAction, _trainer : TrainerBase) {
        const newActive : IFieldedMonster = {
            monster : _action.monster_id,
            position : _action.target_id[0],
            hasactivated : false
        }
        const NewFielded = new FieldedMonster(newActive, _trainer.Team)
        _trainer.Team.Leads.push(NewFielded)
        
        this.Battle.MessageList.push({ "generic" : NewFielded.Monster.Nickname + " has been placed at " + NewFielded.Plot.returnCoordinates().toString()})

        this.Battle.runEvent( "SwitchInMonster", NewFielded, null, null, null, null, this.Battle.MessageList )
        this.Battle.runEvent( "MonsterEntersField", NewFielded, null, null, null, null, this.Battle.MessageList )
    }

    /**
     * Given a SWAP action, perform it.
     * Take a fielded monster and swap it out with
     * a non fielded monster in the trainers team.
     * @param _action the SWAP action to perform
     * @param _trainer the trainer this action refers to
     */
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
                this.Battle.runEvent( "SwitchOutMonster", lead, null, null, null, null, this.Battle.MessageList )
                this.Battle.runEvent( "MonsterExitsField", lead, null, null, null, null, this.Battle.MessageList )
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " has been swapped out."})

                lead.Monster = _trainer.Team.Monsters[_action.monster_id]          
                  
                this.Battle.runEvent( "SwitchInMonster", lead, null, null, null, null, this.Battle.MessageList )
                this.Battle.runEvent( "MonsterEntersField", lead, null, null, null, null, this.Battle.MessageList )
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " has been swapped in."})
            } else {
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " can't swap out."})
            }
        }
        
    }

    /**
     * Determine the Effectiveness of something's type
     * against a target monster.
     * @param _type the starting type of the effect
     * @param _source the source of the effect (null is not a monster or item)
     * @param _target the target who's effectiveness is being calculated
     * @returns a number reflecting the type matchup
     */
    public CalculateTypeEffectiveness(
        _type : number,
        _source : FieldedMonster | ActiveMonster | ActiveItem | Plot | Scene | FieldEffect | WeatherEffect | null , 
        _target: FieldedMonster
    ) {
        /*
            0 = Immune
            1 = Hyper Resist
            2 = Resist
            3 = Neutral
            4 = Weak
            5 = Hyper Weak
        */
        let TypeVal = 3;

        const TypeArray : number[] = SpeciesBattleDex[_target.Monster.GetSpecies()].type

        for (let i = 0; i < TypeArray.length; i++) {
            const Matchup = this.Battle.runEvent( "CalculateTypeMatchup", null, _target, null, TypeMatchup[_type][TypeArray[i]], null, this.Battle.MessageList );
            if (Matchup === 3) { TypeVal = 0; break; }
            if (Matchup === 2) { TypeVal -= 1; }
            if (Matchup === 1) { TypeVal += 1; }
        }

        let FinalTypeVal = this.Battle.runEvent( "ModifyFinalTypeMatchupTarget", null, _target, null, TypeVal, null, this.Battle.MessageList );
        if (_source != null) {
            FinalTypeVal = this.Battle.runEvent( "ModifyFinalTypeMatchupSource", _source, null, null, FinalTypeVal, null, this.Battle.MessageList );
        }
        return FinalTypeVal;
    }

    public returnTypeDamageMod(_typeval : number) {
        switch (_typeval) {
            case 0 : {
                return 0;
            }
            case 1 : {
                return 0.5;
            }
            case 2 : {
                return 0.75;
            }
            case 3 : {
                return 1;
            }
            case 4 : {
                return 1.25;
            }
            case 5 : {
                return 1.5;
            }
            default: return 1;
        }
    }

    public async DealDamage(
        _val : number, 
        _type : number,
        _source : FieldedMonster | ActiveMonster | ActiveItem | Plot | Scene | WeatherEffect | FieldEffect, 
        _target: FieldedMonster,
        _skipProt : boolean,
        _skipType : boolean,
        _skipMods : boolean) {

            let ProtectionModifier = 0;
            let TypeMatchupModifier = 0;
            let DamageTakenModifier = 0;
            // This means the protection of the monster will be considered
            if (!_skipProt) {
                const Protection = this.GetStatValue(_target, "pt", false, false)
                ProtectionModifier = this.Battle.runEvent( "GetTotalProtectionMod", _source, _target, null, Protection, _val, this.Battle.MessageList );
            }
            // This means type modifiers will be considered
            if (!_skipType) {
                TypeMatchupModifier = this.returnTypeDamageMod( this.CalculateTypeEffectiveness(_type, _source , _target) );
            }
            // This means additional % based modifiers will be considered
            if (!_skipMods) {
                DamageTakenModifier = this.Battle.runEvent( "GetTotalDamageMod", _source, _target, null, 1, _val, this.Battle.MessageList );
            }

            const ModifiedDamage = Math.floor( (_val - (_val * ( ( Math.min(90, ProtectionModifier * DamageTakenModifier))/100))) * TypeMatchupModifier)

            let dmg = 0;
            const FinalDamage = this.Battle.runEvent('GetFinalDamage', _source, _target, null, ModifiedDamage, null, this.Battle.MessageList )
            dmg = _target.Monster.TakeDamage(FinalDamage, this.Battle.MessageList);

            if (_target.Monster.HP_Current <= 0) {
                this.Battle.runEvent('WhenKnockedOut', _source, _target, null, null, null, this.Battle.MessageList )
                const AwaitDeathSwap = await this.Battle.AutoSwapMonster(_target.Monster)
                if (AwaitDeathSwap) {}
            }

            return dmg;
    }

    public GetStatValue(_monster : FieldedMonster | ActiveMonster, _stat : string, _skipMods : boolean, _skipBoosts : boolean) {
        
        const _mon : ActiveMonster = (_monster instanceof ActiveMonster)? _monster : _monster.Monster;
        const BaseStat = this.Battle.runEvent(('GetStatBase'+_stat), _mon, null, null, _mon.GetStat(_stat), null, this.Battle.MessageList)
        let StatMod = 1;
        let FinalStat = BaseStat;

        if (!_skipBoosts) {
            StatMod = this.Battle.runEvent(('GetStatMod'+_stat), _mon, null, null, _mon.GetStatBoost(_stat), null, this.Battle.MessageList)
        }

        FinalStat = (Math.floor(BaseStat + (Math.floor(BaseStat * (StatMod/4)))))

        if (!_skipMods) {
            FinalStat *= this.Battle.runEvent(('GetStatFinal'+_stat), _mon, null, null, 1, (Math.floor(BaseStat + (Math.floor(BaseStat * (StatMod/4))))), this.Battle.MessageList)
        }
        
        return FinalStat;
    }

}

export {BattleEvents}