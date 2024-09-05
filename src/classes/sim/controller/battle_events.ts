import { MonsterType, TypeMatchup } from "../../../data/enum/types";
import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ActionInfoDex } from "../../../data/static/action/action_inf";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { ItemInfoDex } from "../../../data/static/item/item_inf";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { ActionAction, IDEntry, ItemAction, MessageSet, SelectedAction, SwitchAction, TargetSet } from "../../../global_types";
import { ActiveAction } from "../models/active_action";
import { ActiveItem } from "../models/active_item";
import { ActiveMonster } from "../models/active_monster";
import { ActivePos } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { Scene } from "../models/terrain/terrain_scene";
import { Side } from "../models/terrain/terrain_side";
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
     * Once given the actions being taken by trainers, it determines the appropriate
     * order and then performs them.
     * @param _choices The actions that will be performed (or attempted) this turn of play
     * @returns boolean value deciding if the battle should continue
     */
    public runTurns(_choices : SelectedAction[]): boolean {
        const OrderedChoices : SelectedAction[] = this.orderTurns(_choices);
        
        OrderedChoices.forEach(element => {
                this.runTurn(element)
            })


        // Run after all turns occur
        
        const Messages : MessageSet = []

        this.Battle.Trainers.forEach(trainer => {
            trainer.Team.Leads.forEach(lead => {
                this.Battle.runEvent('RoundEnd', trainer, null, null, lead, null, null, null, Messages);
            })
        })
        
        // Emit Messages
        this.Battle.SendOutMessage(Messages);

        return this.Battle.IsBattleAlive();
    }

    /**
     * Perform a single action
     * @param _action The action to run
     */
    public runTurn(_action : SelectedAction) {
        if (_action.type === "SWITCH") {            
            this.performSwitch(_action as SwitchAction);
        } else if (_action.type === "ITEM") {
            this.performItem(_action as ItemAction);
        } else if (_action.type === "ACTION") {
            this.performAction(_action as ActionAction);
        } else {
            const DuplicateAction : SelectedAction = _action 
            DuplicateAction.trainer = new TrainerBase({ team : DuplicateAction.trainer.Team.ConvertToInterface(), pos : DuplicateAction.trainer.Position, name: DuplicateAction.trainer.Name })
            const Message : {[id : IDEntry]: any} = { "choice" : DuplicateAction}
            this.Battle.SendOutMessage([Message]);
        }
    }

    /**
     * Given a trainer selects to have a monster act, perform
     * this action.
     * @param _action The Action to have a monster use
     */
    public performAction(_action : ActionAction) {
        // Prep Messages
        const Messages : MessageSet = []
        Messages.push({ "generic" : _action.source.Monster.Nickname + " used " + ActionInfoDex[_action.action.Action].name})

        // Find All Targets
        const TargetList : TargetSet = this.GetTargets(_action.target, ActionBattleDex[_action.action.Action].type_target)

        // Check if the action can be used at all
        let CanUseAction = (_action.action.HasUsesRemaining());
        TargetList.forEach(target => {
            let Trainer : TrainerBase | null = this.GetTrainer(target);
            CanUseAction = this.Battle.runEvent('AttemptActionAtAll', _action.trainer, Trainer, target, _action.source, _action.action, CanUseAction, null, Messages);
        })

        if (CanUseAction) {
            if (this.Battle.runEvent('AttemptActionAtAll', _action.trainer, null, null, _action.source, _action.action, true, null, Messages)) {
                _action.action.UseActionUp()                
            }
            TargetList.forEach(target => {
                let Trainer : TrainerBase | null = this.GetTrainer(target);
                let ContinueMove = true;

                // Get Number Of Hits
                const MaxHits = this.GetNumberOfHits(_action, target, Trainer, Messages )
                let CurrentHits = 0;

                // Continue Hitting
                while (ContinueMove) {
                    CurrentHits += 1;
                    
                    const IsTargetAlive = (target instanceof ActivePos)? (target.Monster.HP_Current > 0) : true
                    const UseOnTarget = this.Battle.runEvent('AttemptAction', _action.trainer, Trainer, target, _action.source, _action.action, IsTargetAlive, null, Messages);
    
                    if ((UseOnTarget)) {
                        ContinueMove = this.RunActionOnTarget(_action, target, Trainer, Messages);
                    } else { ContinueMove = false; }

                    if (CurrentHits >= MaxHits) { ContinueMove = false; }
                }

                // If the user is dead, stop using the Action
                if (_action.source.Monster.HP_Current <= 0) {
                    return false;
                }
                
            })
        } else {
            Messages.push({ "generic" : "But the action couldn't be used!"})
        }

        // Emit Messages
        this.Battle.SendOutMessage(Messages);
    }

    /**
     * Find the number of times for a move to hit a target.
     * @param _action The action being checked
     * @param _target The current target of the action
     * @param _trainer The target's associated trainer, if any
     * @param _messages List of messages to add to.
     * @returns The number of times to perform the move against a target (multihit moves)
     */
    public GetNumberOfHits(_action : ActionAction, _target : ActivePos | Scene | Side | Plot, _trainer : TrainerBase | null, _messages : MessageSet) {
        if (ActionBattleDex[_action.action.Action].events["multihit"]) {
            const MinimumCount = this.Battle.runEvent('GetHitMinimum', _action.trainer, _trainer, _target, _action.source, _action.action, ActionBattleDex[_action.action.Action].events["multihit"][0], null, _messages);
            const MaximumCount = this.Battle.runEvent('GetHitMaximum', _action.trainer, _trainer, _target, _action.source, _action.action, ActionBattleDex[_action.action.Action].events["multihit"][1], null, _messages);

            const Range = ((MaximumCount - MinimumCount) < 0)? 0 : (MaximumCount - MinimumCount)

            const randomValue = Math.random() * (1+(Range));
            return randomValue;
        }
        return 1;
    }

    /**
     * Actually perform the Action on a target.
     * @param _action The action being run
     * @param _target The current target of the action
     * @param _trainer The target's associated trainer, if any
     * @param _messages List of messages to add to.
     * @returns if the move should continue to be run against the target
     */
    public RunActionOnTarget(_action : ActionAction, _target : ActivePos | Scene | Side | Plot, _trainer : TrainerBase | null, _messages : MessageSet) {
        const ActionBattleData = ActionBattleDex[_action.action.Action];
        const ActionInfoData = ActionInfoDex[_action.action.Action];

        // Get Accuracy
        let IsHit : boolean;

        if (ActionBattleData.accuracy === true) {
            IsHit = true;
        } else {
            // Get relevant numbers to determine accuracy
            const UserAccuracy = this.GetStatValue(_action.trainer, _action.source, "ac", _messages)
            const ActionAccuracy = this.Battle.runEvent('GetActionAccuracy', _action.trainer, _trainer, _target, _action.source, _action.action, ActionBattleData.accuracy, null, _messages);
            const AccuracyMultiplier = this.Battle.runEvent('GetAccuracyModifier', _action.trainer, _trainer, _target, _action.source, _action.action, 1, null, _messages);

            // Calculate final accuracy (floor of 5%)
            let FinalAccuracy = Math.floor((UserAccuracy + ActionAccuracy) * AccuracyMultiplier);
            if (FinalAccuracy < 5) {FinalAccuracy = 5}

            // Determine if the move hits
            const randomValue = Math.random() * (100);
            IsHit = (randomValue <= FinalAccuracy)            
        }

        if (IsHit) {

            // Only do damage if the move targets a monster
            if ((_target instanceof ActivePos)) {
                // If relevant, have the move do damage
                if (ActionBattleData.damage_mod !== false) {
                    // Determine total damage to deal
                    let DamageDealt = 0;
                    if (ActionBattleData.damage_mod === true) {
                        // If the action uses some alternative method to determine damage dealt
                        DamageDealt = this.Battle.runEvent('DealCustomDamage', _action.trainer, _trainer, _target, _action.source, _action.action, 0, null, _messages);
                    } else if (typeof ActionBattleData.damage_mod === 'number') {                    
                        // Determine any skipped parts of the damage getting process
                        const SkipMods = this.Battle.runEvent('SkipDamageMods', _action.trainer, _trainer, _target, _action.source, _action.action, (ActionBattleData.events['skipmods'])? ActionBattleData.events['skipmods'] : false, null, _messages);
                        const SkipAll = this.Battle.runEvent('SkipDamageChanges', _action.trainer, _trainer, _target, _action.source, _action.action, (ActionBattleData.events['skipall'])? ActionBattleData.events['skipall'] : false, null, _messages);

                        DamageDealt = this.GetDamage(_action, _target, _trainer, SkipMods, SkipAll, _messages)
                    }
                    
                    // Determine any skipped parts of the damage process
                    const SkipProt = this.Battle.runEvent('SkipDamageDealProtection', _action.trainer, _trainer, _target, _action.source, _action.action, (ActionBattleData.events['skipdealtprotection'])? ActionBattleData.events['skipdealtprotection'] : false, null, _messages);
                    const SkipMod = this.Battle.runEvent('SkipDamageDealModifiers', _action.trainer, _trainer, _target, _action.source, _action.action, (ActionBattleData.events['skipdealtmods'])? ActionBattleData.events['skipdealtmods'] : false, null, _messages);
                    const SkipAll = this.Battle.runEvent('SkipDamageDealAll', _action.trainer, _trainer, _target, _action.source, _action.action, (ActionBattleData.events['skipdealtall'])? ActionBattleData.events['skipdealtall'] : false, null, _messages);

                    // Deal that damage
                    const DamageSuffered = this.DealDamage(DamageDealt, ActionBattleData.type, _action.source, _target.Monster, _action.trainer, this.GetTrainer(_target), _messages, SkipProt, SkipMod, SkipAll)

                    // After dealing damage
                    this.Battle.runEvent('AfterDealingDamage', _action.trainer, _trainer, _target, _action.source, _action.action, null, DamageSuffered, _messages);
                    if (_target.Monster.HP_Current <= 0) {
                        this.Battle.runEvent('AfterKnockOut', _action.trainer, _trainer, _target, _action.source, _action.action, null, DamageSuffered, _messages);
                    }

                    // Draining
                    if ((ActionBattleData.events['drain'])) {
                        const DrainVal = this.Battle.runEvent('ModifyDrainVal', _action.trainer, _trainer, _target, _action.source, _action.action, ActionBattleData.events['drain'], null, _messages);
                        const HealedAmount = this.HealDamage((Math.floor(DamageSuffered * DrainVal)), ActionBattleData.type, _action.source, _action.source.Monster, _action.trainer, _action.trainer, _messages, false, false);
                        this.Battle.runEvent('AfterHealingDamage', _action.trainer, _trainer, _target, _action.source, _action.action, null, HealedAmount, _messages);
                    }
                }
            }            

            // Effects
            this.Battle.runEvent('RunActionEvents', _action.trainer, _trainer, _target, _action.source, _action.action, null, null, _messages )

            // Misc
            if ((ActionBattleData.events['heal'])) {
                const SkipHealMod = this.Battle.runEvent('SkipHealModifiers', _action.trainer, _trainer, _target, _action.source, _action.action, (ActionBattleData.events['skihealmods'])? ActionBattleData.events['skihealmods'] : false, null, _messages);
                const SkipHealAll = this.Battle.runEvent('SkipHealAll', _action.trainer, _trainer, _target, _action.source, _action.action, (ActionBattleData.events['skiphealall'])? ActionBattleData.events['skiphealall'] : false, null, _messages);

                const AmountToHeal = this.Battle.runEvent('ReturnHealVal', _action.trainer, _trainer, _target, _action.source, _action.action, 0, null, _messages);
                const HealedAmount = this.HealDamage(AmountToHeal, ActionBattleData.type, _action.source, _action.source.Monster, _action.trainer, _action.trainer, _messages, SkipHealMod, SkipHealAll);
                this.Battle.runEvent('AfterHealingDamage', _action.trainer, _trainer, _target, _action.source, _action.action, null, HealedAmount, _messages);
            }
     
            return true;
        } else {
            this.Battle.runEvent('ActionMiss', _action.trainer, _trainer, _target, _action.source, _action.action, null, null, _messages);
            _messages.push({ "generic" : "But " + ActionInfoData.name + " missed!"})        
            return false;
        }        
    }

    /**
     * Use an item on one or multiple monsters
     * and/or terrain pieces.
     * @param _action 
     */
    public performItem(_action : ItemAction) {
        // Prep Messages
        const Messages : MessageSet = []
        Messages.push({ "generic" : _action.trainer.Name + " used " + ItemInfoDex[_action.item.Item].name})

        // Find All Targets
        const TargetList : TargetSet = this.GetTargets(_action.target, ItemBattleDex[_action.item.Item].type_target)
       
        // Check if the item can be used at all
        let CanUseItem = !(_action.item.Used);
        TargetList.forEach(target => {
            let Trainer : TrainerBase | null = this.GetTrainer(target);
            CanUseItem = this.Battle.runEvent('AttemptItemAtAll', _action.trainer, Trainer, target, _action.trainer, _action.item, CanUseItem, null, Messages);
        })

        if (CanUseItem) {
            _action.item.Used = true;
            TargetList.forEach(target => {
                let Trainer : TrainerBase | null = this.GetTrainer(target);
                const IsTargetAlive = (target instanceof ActivePos)? (target.Monster.HP_Current > 0) : true
                const UseOnTarget = this.Battle.runEvent('AttemptItem', _action.trainer, Trainer, target, _action.trainer, _action.item, IsTargetAlive, null, Messages);

                if (UseOnTarget) {
                    this.Battle.runEvent('ItemOnApply', _action.trainer, Trainer, target, _action.trainer, _action.item, true, null, Messages);
                }
            })
        } else {
            Messages.push({ "generic" : "But the item couldn't be used!"})
        }

        // Emit Messages
        this.Battle.SendOutMessage(Messages);
    }
    
    /**
     * Basic method that runs a check to see if an effect
     * triggers, this involved no modifications to the process
     * and skips no checks. Used when an effect is very simple.
     * @param 
     * @param _baseskill the base chance a skill has to trigger
     * @param trainerTarget the trainer of the target
     * @param target the target of the action
     * @param effectName string name of the effect, used for events
     * @param messageList list of messages to add to
     * @returns true if the effect triggers, false otherwise
     */
    public SimpleEffectTriggerCheck(
        _trainer : TrainerBase,
        _source : ActivePos,
        _sourceeffect : ActiveAction,
        _baseskill : number,
        trainerTarget : TrainerBase, 
        target : ActiveMonster | Side | Plot | Scene, 
        effectName : string,
        messageList: MessageSet) {
        // Get base chances
        const Skill = this.GetSkillChance(_trainer, _source, _sourceeffect, _baseskill, false, false, trainerTarget, target, effectName, messageList)
        const Resistance = this.GetSkillResistance(_trainer, _source, _sourceeffect, ActionBattleDex[ _sourceeffect.Action ].type, false, trainerTarget, target, effectName, messageList)

        // Get result
        return this.GetDoesEffectTrigger( _trainer, _source, _sourceeffect, Skill, Resistance, false, trainerTarget, target, effectName, messageList )
    }

    /**
     * Gets the chance a monster has to apply an effect
     * to their target.
     * @param _action the action taking place
     * @param _baseskill the base skill of the effect being triggered
     * @param _skipbasemods if modifiers to the effect's base skill should be used
     * @param _skipallmods if modifiers to the end chance should be used
     * @param trainerTarget the trainer of the target
     * @param target the target of the effect
     * @param effectName the name of the effect, used for events
     * @param messageList list of messages to add to
     * @returns numerical chance/100 for an effect to occur
     */
    public GetSkillChance(
        _trainer : TrainerBase,
        _source : ActivePos,
        _sourceeffect : ActiveAction,
        _baseskill : number,
        _skipbasemods : boolean,
        _skipallmods : boolean,
        trainerTarget : TrainerBase, 
        target : ActiveMonster | Side | Plot | Scene, 
        effectName : string,
        messageList: MessageSet) {
        // Setup base values
        const BaseChance = _baseskill
        const SkillStat = this.GetStatValue(_trainer, _source, "sk", messageList)
        let BaseMods = 1
        let AllMods = 1
        
        // Get Additional Modifiers
        if (!_skipbasemods) {
            BaseMods = this.Battle.runEvent('GetSkillBaseModifiers', _trainer, trainerTarget, target, _source, _sourceeffect, BaseMods, effectName, messageList)
        }
        if (!_skipallmods) {
            AllMods = this.Battle.runEvent('GetSkillAllModifiers', _trainer, trainerTarget, target, _source, _sourceeffect, AllMods, effectName, messageList)
        }
        
        // Get STAB modifier
        let TypeModifier = 1;
        for (let i = 0; i < SpeciesBattleDex[_source.Monster.GetSpecies()].type.length; i++) {
            if (SpeciesBattleDex[_source.Monster.GetSpecies()].type[i] === ActionBattleDex[_sourceeffect.Action].type) {
                TypeModifier += 0.25
            }
        }

        // Return base chance
        return Math.floor( ( (Math.floor(BaseChance * BaseMods)) + SkillStat ) * AllMods * TypeModifier )
    }

    /**
     * Gets the penalty a monster applies to the chance
     * of incoming effects triggering
     * 
     * @param _type the type of the action involved
     * @param _skipbasemods if modifiers to the resistance should be ignored
     * @param trainerTarget the trainer of the target
     * @param target the target of the action
     * @param effectName the name of the effect, used for events
     * @param messageList list of messages to add to
     * @returns numerical reduction to the chance/100 of an effect to trigger
     */
    public GetSkillResistance(
        _trainer : TrainerBase,
        _source : ActivePos,
        _sourceeffect : ActiveAction,
        _type : number,
        _skipbasemods : boolean,
        trainerTarget : TrainerBase,
        target : ActiveMonster | Side | Plot | Scene,
        effectName : string,
        messageList: MessageSet) {
        // Setup modifiers
        let SkillStat = 0;
        let BaseMods = 1
        let TypeModifier = 1; 
        
        // If the target is a monster, get their stats and account for type
        if ((target instanceof ActiveMonster)) {
            for (const type in SpeciesBattleDex[target.GetSpecies()].type) {
                const Matchup = TypeMatchup[_type][type];
                if (Matchup === 1) { TypeModifier -= 0.25;
                } else if (Matchup === 2) { TypeModifier += 0.25;
                } else if (Matchup === 3) { return 10000000 }
            }
            SkillStat = this.GetStatValue(_trainer, _source, "rs", messageList)
        }
        
        // Get Additional Modifiers
        if (!_skipbasemods) {
            BaseMods = this.Battle.runEvent('GetSkillResistModifiers', _trainer, trainerTarget, target, _source, _sourceeffect, BaseMods, effectName, messageList)
        }

        // Return effect chance penalty
        return Math.floor( SkillStat * BaseMods * TypeModifier )
    }

    /**
     * Determines if an effect will trigger
     * 
     * @param _skill the final skill chance of the effect user
     * @param _resistance the final resistance pently of the defending monster
     * @param _skipEndMods if final modifiers are ignored
     * @param trainerTarget the trainer of the target
     * @param target the target of the effect
     * @param effectName the name of the effect, used in events
     * @param messageList list of messages to add to
     * @returns true if the effect triggers, false otherwise
     */
    public GetDoesEffectTrigger(
        _trainer : TrainerBase,
        _source : ActivePos,
        _sourceeffect : ActiveAction,
        _skill : number,
        _resistance : number,
        _skipEndMods : boolean, 
        trainerTarget : TrainerBase, 
        target : ActiveMonster | Side | Plot | Scene, 
        effectName : string,
        messageList: MessageSet) {

        // Find chance
        let SkillChance = (_skill - _resistance)
        if (SkillChance < 0) {SkillChance = 0;}

        if (!_skipEndMods) {
            SkillChance = this.Battle.runEvent('ModifyFinalSkillChance', _trainer, trainerTarget, target, _source, _sourceeffect, SkillChance, effectName, messageList)
        }
        
        // Determine if the move hits
        const randomValue = Math.random() * (100);
        const DoesTrigger = (randomValue <= Math.floor(SkillChance))    
        if (DoesTrigger) {
            this.Battle.runEvent('EffectApply', _trainer, _trainer, target, _source, _sourceeffect, null, effectName, messageList);  
        }
        return DoesTrigger;
    }

    /**
     * Given an action, determine the amount of damage
     * to deal to a given target
     * @param _action the action being performed
     * @param _target the target of the action
     * @param _trainer the trainer of the target
     * @param _skipmods if muliplicative modifiers will be applied
     * @param _skipall if other modifiers will be applied
     * @param _messages list of messages to add to
     * @returns the amount of damage for this action to output
     */
    public GetDamage(
        _action     : ActionAction, 
        _target     : ActivePos | Scene | Side | Plot, 
        _trainer    : TrainerBase | null, 
        _skipmods   : boolean,
        _skipall    : boolean,
        _messages   : MessageSet) {
        let DamageMin = this.GetStatValue(_action.trainer, _action.source, "dl", _messages);
        let DamageMax = this.GetStatValue(_action.trainer, _action.source, "dh", _messages);
        let DamageMod = 1;

        // Modify range of damage
        if (!_skipmods) {

            // Get STAB modifier
            let TypeModifier = 1;
            for (let i = 0; i < SpeciesBattleDex[_action.source.Monster.GetSpecies()].type.length; i++) {
                if (SpeciesBattleDex[_action.source.Monster.GetSpecies()].type[i] === ActionBattleDex[_action.action.Action].type) {
                    TypeModifier += 0.25
                }
            }
            
            DamageMod = this.Battle.runEvent('GetDamageRangeModifiers', _action.trainer, _trainer, _target, _action.source, _action.action, TypeModifier, null, _messages )
            
            DamageMin = Math.floor(DamageMin * (DamageMod))
            DamageMax = Math.floor(DamageMax * (DamageMod))
        }

        // Get damage number
        const Range = ((DamageMax - DamageMin) <= 0) ? (DamageMax - DamageMin): 1;
        const randomValue = Math.random() * (Range);

        const DealtDamage = (randomValue + DamageMin)

        // Modify damage
        if (!_skipall) {
            const FinalDamageDealt = this.Battle.runEvent('GetFinalDamageDealt', _action.trainer, _trainer, _target, _action.source, _action.action, DealtDamage, null, _messages )
            return FinalDamageDealt;
        } else {
            return DealtDamage
        }
    }

    /**
     * Given an amount of incoming damage, calculate the final
     * damage dealt and apply that to the monster.
     * @param _val the incoming damage number
     * @param _type the type of the damage
     * @param _source the source of the damage
     * @param _target monster the damage is being applied to
     * @param _trainer trainer associated with the source
     * @param _targetTrainer trainer associated with the target
     * @param _messageList list of messages to add to
     * @param _skipProt if protection will be ignored
     * @param _skipMod if % based modifiers will be ignored
     * @param _skipAll if all adjustments to the damage will be ignores
     */
    public DealDamage(
        _val : number, 
        _type : number,
        _source : ActivePos | ActiveMonster | ActiveItem | Scene | Side | Plot, 
        _target: ActiveMonster, 
        _trainer : TrainerBase | null, 
        _targetTrainer : TrainerBase | null,
        _messageList : MessageSet,
        _skipProt : boolean,
        _skipMod : boolean,
        _skipAll : boolean) {
            let Protection = 0;
            let ProtectionModifier = 0;
            let DamageTakenModifier = 0;
            // This means the protection of the monster will be considered
            if (!_skipProt) {
                Protection = this.GetStatValue(_targetTrainer, _target, "pt", _messageList)
                
                ProtectionModifier = this.Battle.runEvent('GetProtectionModifiers', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, 1, null, _messageList )
            }
            // This means additional % based modifiers will be considered
            if (!_skipMod) {
                DamageTakenModifier = this.Battle.runEvent('GetDamageTakenModifiers', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, 1, null, _messageList )
            }

            let FinalProtection = Math.floor( Protection * ProtectionModifier )
            
            let TypeModifier = 1;            
            for (const type in SpeciesBattleDex[_target.GetSpecies()].type) {
                const Matchup = TypeMatchup[_type][type];
                if (Matchup === 1) { TypeModifier -= 0.25;
                } else if (Matchup === 2) { TypeModifier += 0.25;
                } else if (Matchup === 3) { TypeModifier = 0; break; }
            }

            const ModifiedDamage = Math.floor( (_val - (_val * ( ( Math.min(90, FinalProtection * DamageTakenModifier))/100))) * TypeModifier)

            let dmg = 0;
            if (_skipAll) {
                dmg = _target.TakeDamage(ModifiedDamage, _messageList);
            } else {
                const FinalDamage = this.Battle.runEvent('GetFinalDamage', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, ModifiedDamage, null, _messageList )
                dmg = _target.TakeDamage(FinalDamage, _messageList);
            }
            if (_target.HP_Current <= 0) {
                this.Battle.runEvent('WhenKnockedOut', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, null, null, _messageList )
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
    public HealDamage(
        _val : number, 
        _type : number,
        _source : ActivePos | ActiveMonster | ActiveItem | Scene | Side | Plot, 
        _target: ActiveMonster, 
        _trainer : TrainerBase | null, 
        _targetTrainer : TrainerBase | null,
        _messageList : MessageSet,
        _skipMod : boolean,
        _skipAll : boolean) {
            
            let DamageRecoveredModifier = 0;
            
            // This means additional % based modifiers will be considered
            if (!_skipMod) {
                DamageRecoveredModifier = this.Battle.runEvent('GetDamageRecoveredModifiers', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, 1, null, _messageList )
            }
            const ModifiedRecovery = Math.floor( _val + (_val * ((DamageRecoveredModifier)/100)))
            
            if (_skipAll) {
                return _target.HealDamage(ModifiedRecovery, _messageList, this.GetStatValue(this.GetTrainer(_target), _target, 'hp', _messageList));
            } else {
                const FinalRecovery = this.Battle.runEvent('GetFinalRecovery', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, ModifiedRecovery, null, _messageList )
                return _target.HealDamage(FinalRecovery, _messageList, this.GetStatValue(this.GetTrainer(_target), _target, 'hp', _messageList));
            }
    }

    /**
     * For a given object, attempt to find the right
     * trainer associated with it.
     * @param _obj the object to check
     * @returns the trainer, if one can be found, or null otherwise
     */
    public GetTrainer(_obj : any) {
        if (_obj instanceof Side) {
            return this.Battle.Trainers[_obj.Position]
        } else if (_obj instanceof Plot) {
            return this.Battle.Trainers[_obj.ScenePos]
        } else if (_obj instanceof ActivePos) {
            for (let i = 0; i < this.Battle.Trainers.length; i++) {
                for (let j = 0; j < this.Battle.Trainers[i].Team.Monsters.length; j++) {
                    if (this.Battle.Trainers[i].Team.Monsters[j] === _obj.Monster) { 
                        return this.Battle.Trainers[i]; }
                }
            }        
        } else if (_obj instanceof ActiveMonster) {
            for (let i = 0; i < this.Battle.Trainers.length; i++) {
                for (let j = 0; j < this.Battle.Trainers[i].Team.Monsters.length; j++) {
                    if (this.Battle.Trainers[i].Team.Monsters[j] === _obj) { 
                        return this.Battle.Trainers[i]; }
                }
            }                  
        } else if (_obj instanceof ActiveItem) {
            for (let i = 0; i < this.Battle.Trainers.length; i++) {
                for (let j = 0; j < this.Battle.Trainers[i].Team.Items.length; j++) {
                    if (this.Battle.Trainers[i].Team.Items[j] === _obj) { 
                        return this.Battle.Trainers[i]; }
                }
            }           
        }

        return null;
    } 

    /**
     * Given a list of targets, and the type of targets,
     * return an array listing every object affected.
     * @param _targets The coordinates of each target
     * @param _targettype the type of target (Monster, Terrain, or Both)
     * @returns Array of Scene, Plot, Side, and ActivePos objects
     */
    public GetTargets(_targets : number[][], _targettype : string): TargetSet {
        const Targets : TargetSet = []

        // If empty, return the scene
        if (_targets.length <= 0) {
            if ((_targettype === "ALL") || (_targettype === "MONSTER")) {
                this.Battle.Trainers.forEach(trainer => {
                    trainer.Team.Leads.forEach(lead => { Targets.push(lead); })
                })
            }
            if ((_targettype === "ALL") || (_targettype === "TERRAIN")) {
                Targets.push(this.Battle.Scene);
            }
        } else { // Otherwise locate the relevant side/plot/monster
            _targets.forEach(target => {
                if (target.length === 2) { 
                    // If plot coordinates are given
                    if ((_targettype === "ALL") || (_targettype === "MONSTER")) {
                        this.Battle.Trainers[target[0]].Team.Leads.forEach(lead => {
                            if (lead.Position === target[1]) {
                                Targets.push(lead);
                            }
                        })
                    }
                    if ((_targettype === "ALL") || (_targettype === "TERRAIN")) {
                        Targets.push(this.Battle.Scene.Sides[target[0]].Plots[target[1]])
                    }
                } else if (target.length === 1) {
                    // If side coordinates are given
                    if ((_targettype === "ALL") || (_targettype === "MONSTER")) {
                        this.Battle.Trainers[target[0]].Team.Leads.forEach(lead => {
                            Targets.push(lead);
                        })
                    }
                    if ((_targettype === "ALL") || (_targettype === "TERRAIN")) {
                        Targets.push(this.Battle.Scene.Sides[target[0]])
                    }
                }
            })
        }

        return Targets;
    }

    /**
     * Switch out one monster for another
     * @param _action the SwitchAction containing information on who to swap into who
     */
    public performSwitch(_action : SwitchAction) {
        
        // Prep Messages
        const Messages : MessageSet = []

        // Run Switch
        let CanSwitch = this.Battle.runEvent('AttemptSwitch', _action.trainer, _action.trainer, _action.newmon, _action.current, null, true, null, Messages);
        _action.trainer.Team.Leads.forEach(item => {
            if (item.Monster === _action.newmon) {
                CanSwitch = false;
            }
        })
        
        if (CanSwitch) {
            Messages.push({ "generic" : _action.current.Monster.Nickname + " come back!"})
            this.Battle.runEvent('SwitchOut', _action.trainer, null, null, _action.current, null, null, null, Messages);

            _action.current.SwapMon(_action, _action.trainer.Team);
            
            Messages.push({ "generic" : (_action.newmon.Nickname) + " it's your turn!"})
            this.Battle.runEvent('SwitchIn', _action.trainer, null, null, _action.current, null, null, null, Messages);
        } else {            
            Messages.push({ "generic" : "But " + _action.current.Monster.Nickname + " couldn't switch!"})
        }

        // Emit Messages
        this.Battle.SendOutMessage(Messages);
    }

    /**
     * Takes a list of actions and sorts them in order
     * of play with the first item being run first, the
     * second being run second, and so on.
     * @param _choices the SelectedAction list to organize
     * @returns an organized array of SelectedAction objects
     */
    public orderTurns(_choices : SelectedAction[]): SelectedAction[] {

        // Prep Messages
        const Messages : MessageSet = []

        const OrderedTurnArray : SelectedAction[] = [];

        // ---------------------------------------- Populate Arrays ---------------------------------------

        const NoneTurnArray : SelectedAction[] = [];
        const SwitchTurnArray : SwitchAction[] = [];
        const ItemTurnArray : ItemAction[] = [];
        const ActionTurnArray : ActionAction[] = [];
        const OtherTurnArray : SelectedAction[] = [];

        _choices.forEach(choice => {
            if (choice.type === "NONE") {
                NoneTurnArray.push(choice);
            } else if (choice.type === "SWITCH") {
                SwitchTurnArray.push(choice as SwitchAction)
            } else if (choice.type === "ITEM") {
                ItemTurnArray.push(choice as ItemAction)
            } else if (choice.type === "ACTION") {
                ActionTurnArray.push(choice as ActionAction)
            } else {
                OtherTurnArray.push(choice)
            }
        })        

        // ---------------------------------------- Turn Skip ---------------------------------------------
        const OrderedNoneTurnArray : SelectedAction[] = [];
        NoneTurnArray.forEach(item => {
            OrderedNoneTurnArray.push(item);
        })

        // ---------------------------------------- Switch Monster ----------------------------------------
        const OrderedSwitchTurnArray : SwitchAction[] = [];

        // Sort By Speed
        var sorted = {};
        for( let i = 0, max = SwitchTurnArray.length; i < max ; i++ ){
            if( sorted[this.GetStatValue(SwitchTurnArray[i].trainer, SwitchTurnArray[i].current, "sp", Messages)] == undefined ){
                sorted[this.GetStatValue(SwitchTurnArray[i].trainer, SwitchTurnArray[i].current, "sp", Messages)] = [];
            }
            sorted[this.GetStatValue(SwitchTurnArray[i].trainer, SwitchTurnArray[i].current, "sp", Messages)].push(SwitchTurnArray[i]);
        }

        // Order the speed tiers
        const sortedEntries = Object.entries(sorted).sort((a, b) => { return parseInt(b[0].toString()) - parseInt(a[0].toString())})
        const sortedDictionary: {} = Object.fromEntries(sortedEntries);

        // Shuffle within speed tiers and add to turn order
        for (let i = (Object.keys(sortedDictionary).length - 1); i >= 0; i--) {
            OrderedSwitchTurnArray.push.apply(OrderedSwitchTurnArray, this.shuffleArray(sortedDictionary[Object.keys(sortedDictionary)[i]]))
        }
        
        // ---------------------------------------- Use Item ----------------------------------------------
        const OrderedItemTurnArray : ItemAction[] = [];

        // Group Item usage by impact on the field
        // Scene-affecting items go first, then items
        // for the trainer, then items affecting an
        // opposing team.
        const ItemScene : ItemAction[] = [];
        const ItemSelf : ItemAction[] = [];
        const ItemOther : ItemAction[] = [];

        ItemTurnArray.forEach(item => {
            if (item.target.length === 0) {
                ItemScene.push(item)
            } else {                
                if (item.target[0][0] === item.trainer.Position) {
                    ItemSelf.push(item);
                } else { ItemOther.push(item) }
            }
        })
        
        // Shuffle within Item groups and add to turn order
        OrderedItemTurnArray.push.apply(OrderedItemTurnArray, this.shuffleArray(ItemScene))
        OrderedItemTurnArray.push.apply(OrderedItemTurnArray, this.shuffleArray(ItemSelf))
        OrderedItemTurnArray.push.apply(OrderedItemTurnArray, this.shuffleArray(ItemOther))

        // ---------------------------------------- Perform Action ----------------------------------------
        const OrderedActionTurnArray : ActionAction[] = [];

        // Sort By priority
        var sorted = {};
        for( let i = 0, max = ActionTurnArray.length; i < max ; i++ ){
            if( sorted[ActionBattleDex[ActionTurnArray[i].action.Action].priority] == undefined ){
                sorted[ActionBattleDex[ActionTurnArray[i].action.Action].priority] = [];
            }
            sorted[ActionBattleDex[ActionTurnArray[i].action.Action].priority].push(ActionTurnArray[i]);
        }
        
        // Order the priority tiers
        const sortedActionEntries = Object.entries(sorted).sort((a, b) => {
            return parseInt(b[0].toString()) - parseInt(a[0].toString())})
        const sortedActionDictionary: {} = Object.fromEntries(sortedActionEntries);

        // Iterate through each tier of priority
        for (let i = (Object.keys(sortedActionDictionary).length - 1); i >= 0; i--) {
            const ArrayOfActions : ActionAction[] = sortedActionDictionary[Object.keys(sortedActionDictionary)[i]];

            // Organize by speed within priority
            var sorted = {};
            for( let i = 0, max = ArrayOfActions.length; i < max ; i++ ){
                if( sorted[this.GetStatValue(ArrayOfActions[i].trainer, ArrayOfActions[i].source.Monster, "sp", Messages)] == undefined ){
                    sorted[this.GetStatValue(ArrayOfActions[i].trainer, ArrayOfActions[i].source.Monster, "sp", Messages)] = [];
                }
                sorted[this.GetStatValue(ArrayOfActions[i].trainer, ArrayOfActions[i].source.Monster, "sp", Messages)].push(ArrayOfActions[i]);
            }

            // Order the speed tiers
            const sortedPriorityActionEntries = Object.entries(sorted).sort((a, b) => { return parseInt(b[0].toString()) - parseInt(a[0].toString())})
            const sortedPriorityActionDictionary: {} = Object.fromEntries(sortedPriorityActionEntries);
            // Shuffle within speed tiers and add to turn order
            for (let i = (Object.keys(sortedPriorityActionDictionary).length - 1); i >= 0; i--) {
                OrderedActionTurnArray.push.apply(OrderedActionTurnArray, this.shuffleArray(sortedPriorityActionDictionary[Object.keys(sortedPriorityActionDictionary)[i]]))
            }
        }

        // ---------------------------------------- Emergency Misc Dump -----------------------------------
        const OrderedOtherTurnArray : SelectedAction[] = [];

        OtherTurnArray.forEach(item => {
            OrderedOtherTurnArray.push(item)
        })

        // ---------------------------------------- Combine Arrays ----------------------------------------

        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedNoneTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedSwitchTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedItemTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedActionTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedOtherTurnArray);
        
        // Emit Messages
        this.Battle.SendOutMessage(Messages);

        return OrderedTurnArray;
    }

    /**
     * Given an array of objects, randomise their order
     * @param array the array to shuffle
     * @returns the array, with objects randomly swapped around
     */
    public shuffleArray(array: any[]): any[] {
        const newArray = array.slice();
    
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
    
        return newArray;
    }

    /**
     * Given a particular stat, get the base value of that stat
     * @param _trainer the trainer of the relevant monster
     * @param _monster the monster to get the stat from
     * @param _stat the stat to find
     * @returns returns a number or number[], based on the stat
     */
    public GetStatValue(_trainer : TrainerBase, _monster : ActivePos | ActiveMonster, _stat : string, messageList: MessageSet) {
        
        const _mon : ActiveMonster = (_monster instanceof ActiveMonster)? _monster : _monster.Monster;

        const BaseStat = this.Battle.runEvent(('GetStatBase'+_stat),_trainer, null, null, _mon, null, _mon.GetStat(_stat), messageList)
        const StatMod = (this.Battle.runEvent(('GetStatMod'+_stat),_trainer, null, null, _mon, null, _mon.GetStatBoost(_stat), messageList))
        const FinalStat = this.Battle.runEvent(('GetStatFinal'+_stat),_trainer, null, null, _mon, null, (Math.floor(BaseStat + (Math.floor(BaseStat * (StatMod/4))))), messageList)
        
        return FinalStat;
    }
}

export {BattleEvents}