import { MonsterType, TypeMatchup } from "../../../data/enum/types";
import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ActionInfoDex } from "../../../data/static/action/action_inf";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { ItemInfoDex } from "../../../data/static/item/item_inf";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { ActionAction, IDEntry, ItemAction, MessageSet, MoveAction, PlaceAction, SelectedAction, SwapAction, TargetSet } from "../../../global_types";
import { returnChoiceTargetPlots } from "../../../util/sharedfunctions";
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
    public async PerformActionPLACE(_action : PlaceAction, _trainer : TrainerBase) : Promise<boolean> {
        const newActive : IFieldedMonster = {
            monster : _action.monster_id,
            position : _action.target_id[0],
            hasactivated : false
        }
        const NewFielded = new FieldedMonster(newActive, _trainer.Team)
        _trainer.Team.Leads.push(NewFielded)
        
        this.Battle.MessageList.push({ "generic" : NewFielded.Monster.Nickname + " has been placed at " + NewFielded.Plot.returnCoordinates().toString()})

        await this.Battle.runEvent( "SwitchInMonster", NewFielded, null, null, null, null, this.Battle.MessageList )
        await this.Battle.runEvent( "MonsterEntersField", NewFielded, null, null, null, null, this.Battle.MessageList )

        return true;

    }

    /**
     * Given a SWAP action, perform it.
     * Take a fielded monster and swap it out with
     * a non fielded monster in the trainers team.
     * @param _action the SWAP action to perform
     * @param _trainer the trainer this action refers to
     */
    public async PerformActionSWAP(_action : SwapAction, _trainer : TrainerBase) {
        
        let lead = null;

        for(let i = 0; i < _trainer.Team.Leads.length; i++) {
            if ((_trainer.Team.Leads[i].Position[0] === _action.target_id[0][0]) &&
                (_trainer.Team.Leads[i].Position[1] === _action.target_id[0][1])) {
                lead = _trainer.Team.Leads[i]
            }
        }

        if (lead != null) {     
            const CanSwap = await this.Battle.runEvent( "CanSwapOut", lead.Monster, null, null, true, null, this.Battle.MessageList )

            if (CanSwap) {
                await this.Battle.runEvent( "SwitchOutMonster", lead, null, null, null, null, this.Battle.MessageList )
                await this.Battle.runEvent( "MonsterExitsField", lead, null, null, null, null, this.Battle.MessageList )
                await this.Battle.runEvent( "MonsterExitsPlot", lead, null, null, null, null, this.Battle.MessageList )
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " has been swapped out."})

                lead.Monster = _trainer.Team.Monsters[_action.monster_id]          
                  
                await this.Battle.runEvent( "SwitchInMonster", lead, null, null, null, null, this.Battle.MessageList )
                await this.Battle.runEvent( "MonsterEntersField", lead, null, null, null, null, this.Battle.MessageList )
                await this.Battle.runEvent( "MonsterEntersPlot", lead, null, null, null, null, this.Battle.MessageList )
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " has been swapped in."})
            } else {
                this.Battle.MessageList.push({ "generic" : lead.Monster.Nickname + " can't swap out."})
            }
        }

        return true;
        
    }

    /**
     * Given a ITEM action, perform it.
     * Use an item from the trainer's inventory
     * @param _action the ITEM action to perform
     * @param _trainer the trainer this action refers to
     */
    public async PerformActionITEM(_action : ItemAction, _trainer : TrainerBase) {
        
        const RelevantItem = _trainer.Team.Items[_action.item]
        const RelevantTargetSpaces = returnChoiceTargetPlots(this.Battle.ConvertToInterface(), ItemBattleDex[RelevantItem.Item], _action.target_id[0])
        
        console.log(RelevantItem)
        console.log(RelevantTargetSpaces)

        return true;
        
    }

    /**
     * Given a MOVE action, perform it.
     * Take a fielded monster and move it through
     * each plot on the path
     * @param _action the MOVE action to perform
     * @param _trainer the trainer this action refers to
     */
    public async PerformActionMOVE(_action : MoveAction, _trainer : TrainerBase) {
        
        const TargetLead : FieldedMonster = _trainer.Team.Leads[_action.source_id];
        const TargetPath : number[][] = _action.paths[0];

        if (TargetLead && TargetPath) {
            TargetLead.Activated = true;

            for (let i = TargetPath.length - 2; i >= 0; i--) {
                const Coords = TargetPath[i];
                const TargetPlot = this.Battle.Scene.Plots[Coords[0]][Coords[1]];
                const SourcePlot = TargetLead.Plot;

                const TakeStep = await this.MoveMonster(TargetLead, SourcePlot, TargetPlot, _trainer);
                
                await this.Battle.UpdateBattleState();
                const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
                await delay(500);
                if (TakeStep === false) {
                    break;
                }
            }
            
            this.Battle.MessageList.push({ "generic" : TargetLead.Monster.Nickname + " moved from Position " + TargetPath[TargetPath.length - 1] + " to Position " + TargetLead.Plot.returnCoordinates()})
        }

        return true;        
    }

    /**
     * Move a plot across a single plot from their original position
     * @param _sourceMonster The monster being moved
     * @param _sourcePlot The plot this monster starts on
     * @param _targetPlot The plot this monster will move onto
     * @param _trainer The trainer associated with this action
     * @returns True if the monster is still alive (false otherwise)
     */
    public async MoveMonster(
        _sourceMonster : FieldedMonster,
        _sourcePlot : Plot,
        _targetPlot : Plot,
        _trainer : TrainerBase
    ) {
        const RefMonster = _sourceMonster.Monster;

        await this.Battle.runEvent( "MonsterExitsPlot", _sourceMonster, null, null, null, null, this.Battle.MessageList )

        if (_sourceMonster.Monster === RefMonster) {
            _sourceMonster.Plot = _targetPlot;
            _sourceMonster.Position = _targetPlot.returnCoordinates();
            await this.Battle.runEvent( "MonsterEntersPlot", _sourceMonster, null, null, null, null, this.Battle.MessageList )
            if (_sourceMonster.Monster === RefMonster) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
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
    public async CalculateTypeEffectiveness(
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
            const Matchup = await this.Battle.runEvent( "CalculateTypeMatchup", null, _target, null, TypeMatchup[_type][TypeArray[i]], null, this.Battle.MessageList );
            if (Matchup === 3) { TypeVal = 0; break; }
            if (Matchup === 2) { TypeVal -= 1; }
            if (Matchup === 1) { TypeVal += 1; }
        }

        let FinalTypeVal = await this.Battle.runEvent( "ModifyFinalTypeMatchupTarget", null, _target, null, TypeVal, null, this.Battle.MessageList );
        if (_source != null) {
            FinalTypeVal = await this.Battle.runEvent( "ModifyFinalTypeMatchupSource", _source, null, null, FinalTypeVal, null, this.Battle.MessageList );
        }
        return FinalTypeVal;
    }

    /**
     * Determines the impact a type interaction has on damage
     * @param _typeval The value of the type interaction
     * @returns The modifier on damage based on the type interaction
     */
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

    /**
     * Deals damage to a monster
     * @param _val How much damage is being applied to the target
     * @param _type The type of the damage
     * @param _source The source of the damage
     * @param _target The monster taking the damage
     * @param _skipProt If the target's protection modifier should be ignored
     * @param _skipType If the target's type should be ignored
     * @param _skipMods If other modifiers on damage should be ignored
     * @returns the amount of damage dealt
     */
    public async DealDamage(
        _val : number, 
        _type : number,
        _source : FieldedMonster | ActiveMonster | ActiveItem | Plot | Scene | WeatherEffect | FieldEffect, 
        _target: FieldedMonster,
        _skipProt : boolean,
        _skipType : boolean,
        _skipMods : boolean) : Promise<number> {

            let ProtectionModifier = 0;
            let TypeMatchupModifier = 0;
            let DamageTakenModifier = 0;
            // This means the protection of the monster will be considered
            if (!_skipProt) {
                const Protection = this.GetStatValue(_target, "pt", false, false)
                ProtectionModifier = await this.Battle.runEvent( "GetTotalProtectionMod", _source, _target, null, Protection, _val, this.Battle.MessageList );
            }
            // This means type modifiers will be considered
            if (!_skipType) {
                TypeMatchupModifier = this.returnTypeDamageMod( await this.CalculateTypeEffectiveness(_type, _source , _target) );
            }
            // This means additional % based modifiers will be considered
            if (!_skipMods) {
                DamageTakenModifier = await this.Battle.runEvent( "GetTotalDamageMod", _source, _target, null, 1, _val, this.Battle.MessageList );
            }

            const ModifiedDamage = Math.floor( (_val - (_val * ( ( Math.min(90, ProtectionModifier * DamageTakenModifier))/100))) * TypeMatchupModifier)

            let dmg;
            const FinalDamage = await this.Battle.runEvent('GetFinalDamage', _source, _target, null, ModifiedDamage, null, this.Battle.MessageList )
            dmg = await _target.Monster.TakeDamage(FinalDamage, this.Battle.MessageList);

            if (dmg) {
                if (_target.Monster.HP_Current <= 0) {
                    this.Battle.runEvent('WhenKnockedOut', _source, _target, null, null, null, this.Battle.MessageList )
                    let IsDead = true;
                    while (IsDead) {

                        const AwaitDeathSwap = await this.Battle.AutoSwapMonster(_target.Monster)
                        if (AwaitDeathSwap === true) {IsDead = false}
                        if (AwaitDeathSwap === false) {
                            IsDead = false
                            _target.Owner.RemoveFielded(_target);
                            await this.Battle.UpdateBattleState();
                        }
                    }
                }
            }

            return dmg;
    }

    /**
     * Finds a given monster's stat value.
     * @param _monster The monster who's stat is being looked for
     * @param _stat The name of the stat to find
     * @param _skipMods If modifiers of the stat should be skipped
     * @param _skipBoosts If stat boosts should be ignored
     * @returns The final value of the stat
     */
    public async GetStatValue(_monster : FieldedMonster | ActiveMonster, _stat : string, _skipMods : boolean, _skipBoosts : boolean) {
        
        const _mon : ActiveMonster = (_monster instanceof ActiveMonster)? _monster : _monster.Monster;
        const BaseStat = await this.Battle.runEvent(('GetStatBase'+_stat), _mon, null, null, _mon.GetStat(_stat), null, this.Battle.MessageList)
        let StatMod : number = 1;
        let FinalStat : number = BaseStat;

        if (!_skipBoosts) {
            StatMod = await this.Battle.runEvent(('GetStatMod'+_stat), _mon, null, null, _mon.GetStatBoost(_stat), null, this.Battle.MessageList)
        }

        FinalStat = await (Math.floor(BaseStat + (Math.floor(BaseStat * (StatMod/4)))))

        if (!_skipMods) {
            FinalStat *= await this.Battle.runEvent(('GetStatFinal'+_stat), _mon, null, null, 1, (Math.floor(BaseStat + (Math.floor(BaseStat * (StatMod/4))))), this.Battle.MessageList)
        }
        
        return FinalStat;
    }

}

export {BattleEvents}