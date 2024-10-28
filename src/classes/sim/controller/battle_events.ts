import { MonsterType, TypeMatchup } from "../../../data/enum/types";
import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ActionInfoDex } from "../../../data/static/action/action_inf";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { ItemInfoDex } from "../../../data/static/item/item_inf";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { ActionAction, IDEntry, IEffectData, ItemAction, MessageSet, MoveAction, PlaceAction, SelectedAction, SwapAction, TargetSet } from "../../../global_types";
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
        const RelevantItemData = ItemBattleDex[RelevantItem.Item]
        const RelevantTargetSpaces = returnChoiceTargetPlots(this.Battle.ConvertToInterface(), RelevantItemData, _action.target_id[0])
        
        RelevantItem.Used = true;
        this.Battle.MessageList.push({ "generic" : _trainer.Name + " used the item " + ItemInfoDex[RelevantItem.Item].name})
       
        const _effectadded : FieldEffect = await this.Battle.runEvent( "GenerateFieldEffect", null, null, RelevantItem, null, null, this.Battle.MessageList )

        for (let i = 0; i < RelevantTargetSpaces.length; i++) {
            const Plot = this.Battle.Scene.ReturnGivenPlot(RelevantTargetSpaces[i][0],RelevantTargetSpaces[i][1])
            const Monster = this.Battle.GetMonsterFromCoordinate(RelevantTargetSpaces[i])

            if (RelevantItemData.target_type != "MONSTER") {
                
                let CanApplyToPlot = await this.Battle.runEvent( "CanUseItemOnPlot", Plot, Plot, RelevantItem, true, null, this.Battle.MessageList )
                if (Monster != null) {
                    CanApplyToPlot = await this.Battle.runEvent( "CanUseItemOnPlot", Monster, Plot, RelevantItem, CanApplyToPlot, null, this.Battle.MessageList )
                }

                if (CanApplyToPlot) {
                    await this.Battle.runEvent( "UseItemOnPlot", null, Plot, RelevantItem, null, (i === 0), this.Battle.MessageList )
                    if (_effectadded != null) {
                        Plot.AddFieldEffect(_effectadded);
                    }
                }
            }
            if ((RelevantItemData.target_type != "TERRAIN") && (Monster != null)) {
                let CanApplyToMonster = await this.Battle.runEvent( "CanUseItemOnMonster", Plot, Monster, RelevantItem, await this.Battle.runEvent( "CanUseItemOnMonster", Monster, Monster, RelevantItem, true, null, this.Battle.MessageList ), null, this.Battle.MessageList )
                if (CanApplyToMonster) {
                    if ((RelevantItemData.target_team != "SELF") && (Monster.Owner.Owner != _trainer)) {
                        await this.Battle.runEvent( "UseItemOnEnemyMonster", null, Monster, RelevantItem, null, (i === 0), this.Battle.MessageList )
                    } else if ((RelevantItemData.target_team != "ENEMY")  && (Monster.Owner.Owner === _trainer)) {
                        await this.Battle.runEvent( "UseItemOnSelfMonster", null, Monster, RelevantItem, null, (i === 0), this.Battle.MessageList )
                    }
                    
                    await this.Battle.runEvent( "UseItemOnAnyMonster", null, Monster, RelevantItem, null, (i === 0), this.Battle.MessageList )
                }
            }
        }
        
        await this.Battle.UpdateBattleState();

        return true;        
    }

    /**
     * Given a ACTION action, perform it.
     * @param _action the ACTION action to perform
     * @param _trainer the trainer this action refers to
     */
    public async PerformActionACTION(_action : ActionAction, _trainer : TrainerBase) {
        const TargetLead : FieldedMonster = _trainer.Team.Leads[_action.source_id];

        let MainTarget : FieldedMonster | null = null;
        const AltTargets : FieldedMonster[] = [];
        const PlotTargets : Plot[] = [];

        if (TargetLead) {
            TargetLead.Activated = true;   
            
            const RelevantAction = TargetLead.Monster.Actions_Current[_action.action_id]
            const RelevantActionData = ActionBattleDex[RelevantAction.Action]
            const RelevantTargetSpaces = returnChoiceTargetPlots(this.Battle.ConvertToInterface(), RelevantActionData, _action.target_id[0], TargetLead.Position)

            // See if the Action can be done

            let CanUseAction = RelevantAction.HasUsesRemaining();
            if (!CanUseAction) { return true; }

            CanUseAction = await this.Battle.runEvent( "MonsterCanUseAction", TargetLead, null, RelevantAction, true, null, this.Battle.MessageList )
            if (!CanUseAction) { return true; }

            this.Battle.MessageList.push({ "generic" : TargetLead.Monster.Nickname + " used the move " + ActionInfoDex[RelevantAction.Action].name})

            // Gather Targets

            const Plot = this.Battle.Scene.ReturnGivenPlot(RelevantTargetSpaces[0][0],RelevantTargetSpaces[0][1])
            PlotTargets.push(Plot)
            const Monster = this.Battle.GetMonsterFromCoordinate(RelevantTargetSpaces[0])
            if ((RelevantActionData.target_type != "TERRAIN") && (Monster != null)) {
                MainTarget = Monster;
            }

            for (let i = 1; i < RelevantTargetSpaces.length; i++) {
                const Plot = this.Battle.Scene.ReturnGivenPlot(RelevantTargetSpaces[i][0],RelevantTargetSpaces[i][1])
                PlotTargets.push(Plot)
                const Monster = this.Battle.GetMonsterFromCoordinate(RelevantTargetSpaces[i])
                if ((RelevantActionData.target_type != "TERRAIN") && (Monster != null)) {
                    AltTargets.push(Monster);
                }
            }

            // Target Main Monster

            if (MainTarget != null) {

                let HitAsMainTarget = await this.Battle.runEvent( "MonsterUseActionOnMainTarget", TargetLead, MainTarget, RelevantAction, true, null, this.Battle.MessageList )
                if (await this.Battle.runEvent( "CareAboutType", TargetLead, MainTarget, RelevantAction, true, null, this.Battle.MessageList ) === true) {
                    if (await this.CalculateTypeEffectiveness(RelevantActionData.type, RelevantAction, MainTarget) === 0 ) {
                        HitAsMainTarget = false;
                    }
                }

                if (HitAsMainTarget) {
                    let HitCount = 1;

                    if (RelevantActionData.events["multihit"]) {
                        const Min = RelevantActionData.events["multihit"]["min"]
                        const Max = RelevantActionData.events["multihit"]["max"]
                        
                        let minhit = (Min)? ((typeof Min === 'number')? Min : 1) : 1;
                        let maxhit = (Max)? ((typeof Max === 'number')? Max : 1) : 1;

                        const rnmd = Math.max(1, Math.floor(Math.random() * (1 + (maxhit - minhit)) + minhit));
                        HitCount = rnmd;
                    }

                    for (let i = 0; i < HitCount; i++) {
                        if (MainTarget.Monster.IsAlive()) {
                            const DoesHit = await this.MakeAccuracyCheck(TargetLead, RelevantAction, MainTarget, true)
                            if (DoesHit === true) {
                                HitAsMainTarget = true;
                                if ((RelevantActionData.damage_mod != false) || (typeof RelevantActionData.damage_mod === 'number')) {
                                    
                                    let DamageOut = (RelevantActionData.damage_mod === true) ? await this.Battle.runEvent( "GetActionSpecialDamage", TargetLead, MainTarget, RelevantAction, 0, true, this.Battle.MessageList ) : await this.MakeDamageOut(TargetLead, RelevantAction, MainTarget, true);
                                    
                                    if (DamageOut > 0) {
                                        const DamageDealt = await this.DealDamage(
                                            DamageOut, RelevantActionData.type, TargetLead, MainTarget,
                                            await this.Battle.runEvent( "UseDMGProt", TargetLead, MainTarget, RelevantAction, false, true, this.Battle.MessageList ),
                                            await this.Battle.runEvent( "UseDMGType", TargetLead, MainTarget, RelevantAction, false, true, this.Battle.MessageList ),
                                            await this.Battle.runEvent( "UseDMGMods", TargetLead, MainTarget, RelevantAction, false, true, this.Battle.MessageList ) )

                                        await this.Battle.runEvent( "AfterDamageDealt", TargetLead, MainTarget, RelevantAction, DamageDealt, true, this.Battle.MessageList )
                                    } else {
                                        this.Battle.MessageList.push({ "generic" : TargetLead.Monster.Nickname + " did no damage!"})
                                    }
                                }

                                for (let j = 0; j < RelevantActionData.effects.length; j++) {
                                    if ((RelevantActionData.effects[j].target_type === "MAIN") || (RelevantActionData.effects[j].target_type === "MONSTER")) {
                                        const DoesApply = await this.MakeEffectCheck(TargetLead, RelevantAction, MainTarget, RelevantActionData.effects[j])

                                        if (DoesApply) {
                                            await this.ApplyEffect(TargetLead, RelevantAction, MainTarget, RelevantActionData.effects[j])
                                        } else {
                                            await this.Battle.runEvent( "OnEffectNotApply", TargetLead, MainTarget, RelevantAction, RelevantActionData.effects[j], true, this.Battle.MessageList )
                                        }
                                    }
                                }
                                await this.Battle.runEvent( "RunExtraEffects", TargetLead, MainTarget, RelevantAction, null, true, this.Battle.MessageList )
                            } else {
                                this.Battle.MessageList.push({ "generic" : TargetLead.Monster.Nickname + " missed " + MainTarget.Monster.Nickname + "!"})
                                await this.Battle.runEvent( "OnMiss", TargetLead, MainTarget, RelevantAction, null, true, this.Battle.MessageList )
                            }
                        } else { i = HitCount; }
                    }
                }           

                if (RelevantActionData.events["musthitmain"]) {
                    if ((RelevantActionData.events["musthitmain"] === true) && (HitAsMainTarget === false)) { return true }
                }
            }

            // Target Secondary Monsters

            for (let k = 0; k < AltTargets.length; k++) {
                
                let HitAsSecondaryTarget = await this.Battle.runEvent( "MonsterUseActionOnSecondaryTarget", TargetLead, AltTargets[k], RelevantAction, true, null, this.Battle.MessageList )
                if (await this.Battle.runEvent( "CareAboutType", TargetLead, AltTargets[k], RelevantAction, true, null, this.Battle.MessageList ) === true) {
                    if (await this.CalculateTypeEffectiveness(RelevantActionData.type, RelevantAction, AltTargets[k]) === 0 ) {
                        HitAsSecondaryTarget = false;
                    }
                }

                if (HitAsSecondaryTarget) {
                    let HitCount = 1;

                    if (RelevantActionData.events["multihit"]) {
                        const Min = RelevantActionData.events["multihit"]["min"]
                        const Max = RelevantActionData.events["multihit"]["max"]
                        
                        let minhit = (Min)? ((typeof Min === 'number')? Min : 1) : 1;
                        let maxhit = (Max)? ((typeof Max === 'number')? Max : 1) : 1;

                        const rnmd = Math.max(1, Math.floor(Math.random() * (1 + (maxhit - minhit)) + minhit));
                        HitCount = rnmd;
                    }

                    for (let i = 0; i < HitCount; i++) {
                        if (AltTargets[k].Monster.IsAlive()) {
                            const DoesHit = await this.MakeAccuracyCheck(TargetLead, RelevantAction, AltTargets[k], true)

                            if (DoesHit) {
                                if ((RelevantActionData.damage_mod != false) || (typeof RelevantActionData.damage_mod === 'number')) {
                                    let DamageOut = (RelevantActionData.damage_mod === true)? await this.Battle.runEvent( "GetActionSpecialDamage", TargetLead, AltTargets[k], RelevantAction, 0, false, this.Battle.MessageList ) : await this.MakeDamageOut(TargetLead, RelevantAction, AltTargets[k], false);
                                    
                                    if (DamageOut > 0) {
                                        const DamageDealt = await this.DealDamage(
                                            DamageOut, RelevantActionData.type, TargetLead, AltTargets[k],
                                            await this.Battle.runEvent( "UseDMGProt", TargetLead, AltTargets[k], RelevantAction, false, false, this.Battle.MessageList ),
                                            await this.Battle.runEvent( "UseDMGType", TargetLead, AltTargets[k], RelevantAction, false, false, this.Battle.MessageList ),
                                            await this.Battle.runEvent( "UseDMGMods", TargetLead, AltTargets[k], RelevantAction, false, false, this.Battle.MessageList ) )

                                        await this.Battle.runEvent( "AfterDamageDealt", TargetLead, AltTargets[k], RelevantAction, DamageDealt, false, this.Battle.MessageList )
                                    } else {
                                        this.Battle.MessageList.push({ "generic" : TargetLead.Monster.Nickname + " did no damage!"})
                                    }
                                }

                                for (let j = 0; j < RelevantActionData.effects.length; j++) {
                                    if ((RelevantActionData.effects[j].target_type === "SECONDARY") || (RelevantActionData.effects[j].target_type === "MONSTER")) {
                                        const DoesApply = await this.MakeEffectCheck(TargetLead, RelevantAction, AltTargets[k], RelevantActionData.effects[j])

                                        if (DoesApply) {
                                            await this.ApplyEffect(TargetLead, RelevantAction, AltTargets[k], RelevantActionData.effects[j])
                                        } else {
                                            await this.Battle.runEvent( "OnEffectNotApply", TargetLead, AltTargets[k], RelevantAction, RelevantActionData.effects[j], false, this.Battle.MessageList )
                                        }
                                    }
                                }
                                await this.Battle.runEvent( "RunExtraEffects", TargetLead, AltTargets[k], RelevantAction, null, false, this.Battle.MessageList )
                            } else {
                                this.Battle.MessageList.push({ "generic" : TargetLead.Monster.Nickname + " missed " + AltTargets[k].Monster.Nickname + "!"})
                                await this.Battle.runEvent( "OnMiss", TargetLead, AltTargets[k], RelevantAction, null, false, this.Battle.MessageList )
                            }
                        } else { i = HitCount; }
                    }
                }   

            }

            // Target Plots
            const _effectadded : FieldEffect = await this.Battle.runEvent( "GenerateFieldEffect", TargetLead, null, RelevantAction, null, null, this.Battle.MessageList )
            for (let i = 0; i < PlotTargets.length; i++) {                
                const Plot = PlotTargets[i]
                const Monster = this.Battle.GetMonsterFromCoordinate(Plot.returnCoordinates())
                let CanApplyToPlot = await this.Battle.runEvent( "CanUseActionOnPlot", Plot, Plot, RelevantAction, true, null, this.Battle.MessageList )
                if (Monster != null) {
                    CanApplyToPlot = await this.Battle.runEvent( "CanUseActionOnPlot", Monster, Plot, RelevantAction, CanApplyToPlot, null, this.Battle.MessageList )
                }

                if (CanApplyToPlot) {
                    await this.Battle.runEvent( "UseActionOnPlot", null, Plot, RelevantAction, null, (i === 0), this.Battle.MessageList )
                    if (_effectadded != null) {
                        Plot.AddFieldEffect(_effectadded);
                    }
                }
            }
            
            await this.Battle.UpdateBattleState();
        }        

        return true;        
    }

    public async MakeEffectCheck(source : FieldedMonster, effect : ActiveAction, target: FieldedMonster, skilleffect : IEffectData) : Promise<boolean> {

        const BaseChance = await this.Battle.runEvent( "GetActionBaseAcc", source, target, effect, skilleffect.baseChance, skilleffect, this.Battle.MessageList );
        const SkillMod = await this.Battle.runEvent( "ModifySKMod", source, target, effect, this.GetStatValue(source, "sk", await this.Battle.runEvent( "UseSKMods", source, target, effect, false, skilleffect, this.Battle.MessageList ), await this.Battle.runEvent( "UseSKBoosts", source, target, effect, false, skilleffect, this.Battle.MessageList )), skilleffect, this.Battle.MessageList ) 
        const ResistMod = await this.Battle.runEvent( "ModifyRSMod", source, target, effect, this.GetStatValue(source, "rs", await this.Battle.runEvent( "UseRSMods", source, target, effect, false, skilleffect, this.Battle.MessageList ), await this.Battle.runEvent( "UseRSBoosts", source, target, effect, false, skilleffect, this.Battle.MessageList )), skilleffect, this.Battle.MessageList ) 
        const TotalChance = Math.min(100, BaseChance + SkillMod - ResistMod);
        
        const rnmd = Math.floor(Math.random() * 100) + 1;

        return (rnmd <= TotalChance);
    }

    public async ApplyEffect(source : FieldedMonster, effect : ActiveAction, target: FieldedMonster, skilleffect : IEffectData) {
        const CanApply = await this.Battle.runEvent( "CanApplyToTarget", source, target, effect, true, skilleffect, this.Battle.MessageList );

        if (CanApply) {            
            await this.Battle.runEvent( "ApplySelfToTarget", source, target, effect, null, skilleffect, this.Battle.MessageList )
            await this.Battle.runEvent( "OnEffectApply", source, target, effect, null, skilleffect, this.Battle.MessageList )
        } else {
            await this.Battle.runEvent( "OnEffectCanNotApply", source, target, effect, null, skilleffect, this.Battle.MessageList )
        }
    }

    public async MakeDamageOut(source : FieldedMonster, effect : ActiveAction, target: FieldedMonster, isMain : boolean): Promise<number> {
        const DamageLow = await this.Battle.runEvent( "GetDLValue", source, target, effect, this.GetStatValue(source, "dl", await this.Battle.runEvent( "UseDLMods", source, target, effect, false, isMain, this.Battle.MessageList ), await this.Battle.runEvent( "UseDLBoosts", source, target, effect, false, isMain, this.Battle.MessageList )), isMain, this.Battle.MessageList )
        const DamageHgh = await this.Battle.runEvent( "GetDHValue", source, target, effect, this.GetStatValue(source, "dh", await this.Battle.runEvent( "UseDHMods", source, target, effect, false, isMain, this.Battle.MessageList ), await this.Battle.runEvent( "UseDHBoosts", source, target, effect, false, isMain, this.Battle.MessageList )), isMain, this.Battle.MessageList )

        const Range = ((DamageHgh - DamageLow) <= 0) ? 1: (DamageHgh - DamageLow);
        let ActionMod = 1;
        if (typeof ActionBattleDex[effect.Action].damage_mod === 'number') {
            ActionMod += (ActionBattleDex[effect.Action].damage_mod as number) / 100
        }
        const randomValue = Math.floor( ActionMod * (Math.random() * (Range)));
        const DealtDamage = await this.Battle.runEvent( "GetDamageNumberModified", source, target, effect, (randomValue + DamageLow), isMain, this.Battle.MessageList );

        const TypeMod = (SpeciesBattleDex[(source.Monster.GetSpecies())].type.includes(ActionBattleDex[effect.Action].type))? 1.25 : 1;
        const ModifiedTypeMod = await this.Battle.runEvent( "GetSTABModified", source, target, effect, TypeMod , isMain, this.Battle.MessageList );
        
        return await this.Battle.runEvent( "GetFinalDamageOut", source, target, effect, (DealtDamage * ModifiedTypeMod) , isMain, this.Battle.MessageList );
    }

    public async MakeAccuracyCheck(source : FieldedMonster, effect : ActiveAction, target: FieldedMonster, isMain : boolean) : Promise<boolean> {
        const RelevantActionData = ActionBattleDex[effect.Action]

        if (RelevantActionData.accuracy === true) {
            return true;
        }

        const BaseAcc = await this.Battle.runEvent( "GetActionBaseAcc", source, target, effect, RelevantActionData.accuracy, isMain, this.Battle.MessageList );
        const AccMod = await this.Battle.runEvent( "ModifyAccMod", source, target, effect, this.GetStatValue(source, "ac", await this.Battle.runEvent( "UseAccMods", source, target, effect, false, isMain, this.Battle.MessageList ), await this.Battle.runEvent( "UseAccBoosts", source, target, effect, false, isMain, this.Battle.MessageList )), isMain, this.Battle.MessageList ) 
        const TotalChance = Math.min(100, BaseAcc + AccMod);
        
        const rnmd = Math.floor(Math.random() * 100) + 1;

        return (rnmd <= TotalChance);
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
        _source : FieldedMonster | ActiveMonster | ActiveAction | ActiveItem | Plot | Scene | FieldEffect | WeatherEffect | null , 
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
     * Given an amount of HP to recover, determine the final
     * recovery amount and apply it to a monster
     * @param _val the base amount of HP to recover
     * @param _type the type of recovery
     * @param _source the reason for this recovery to happen
     * @param _target the monster being healed
     * @param _trainer the trainer associated with the source
     * @param _targetTrainer the trainer associated with the target
     * @param _messageList list of messages to add to
     * @param _skipMod if % based modifiers should be ignored
     * @param _skipAll if final modifiers should be ignored
     */
    public async HealDamage(
        _val : number, 
        _type : number,
        _source : FieldedMonster | ActiveMonster | ActiveItem | Scene | Plot, 
        _target: ActiveMonster, 
        _trainer : TrainerBase | null, 
        _targetTrainer : TrainerBase | null,
        _messageList : MessageSet,
        _skipMod : boolean,
        _skipAll : boolean) {
            
            let DamageRecoveredModifier = 0;
            
            // This means additional % based modifiers will be considered
            if (!_skipMod) {
                DamageRecoveredModifier = await this.Battle.runEvent('GetDamageRecoveredModifiers', _source, _target, null, 1, null, this.Battle.MessageList )
            }
            const ModifiedRecovery = Math.floor( _val + (_val * ((DamageRecoveredModifier)/100)))
            
            if (_skipAll) {
                return _target.HealDamage(ModifiedRecovery, _messageList, await this.GetStatValue(_target, 'hp', false, false));
            } else {
                const FinalRecovery = await this.Battle.runEvent('GetFinalRecovery',  _source, _target, null, ModifiedRecovery, null, this.Battle.MessageList)
                return _target.HealDamage(FinalRecovery, _messageList,  await this.GetStatValue(_target, 'hp', false, false));
            }
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