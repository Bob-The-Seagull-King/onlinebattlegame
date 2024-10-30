import { ActionBattleTable, IEffectData, MessageSet } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";
import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { ActiveItem } from "../../../classes/sim/models/active_item";
import { IFieldEffect, FieldEffect } from "../../../classes/sim/models/Effects/field_effect";

/**
 * Action mechanical information database
 */
export const ActionBattleDex : ActionBattleTable = {
    strike: {
        id                  : 0,
        type                : MonsterType.None,
        cost                : 10,
        uses                : 10,
        accuracy            : 100,
        damage_mod          : 0,
        category            : [ActionCategory.Attack],
        events              : {},
        effects             : [
            {
            effectval   : 'enveloped',
            baseChance  : 150,
            trackerVal  : 3,
            target_type : "MONSTER"
            }],
        target_team         : "ALL",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 4
    },    
    blast: {
        id                  : 1,
        type                : MonsterType.None,
        cost                : 15,
        uses                : 5,
        accuracy            : 90,
        damage_mod          : -25,
        category            : [ActionCategory.Attack],
        events              : {},
        effects             : [],
        target_team         : "ENEMY",
        target_pos          : "SMALL",
        target_type         : "MONSTER",
        target_fill         : "MIN",
        target_direction    : "BOTH", 
        target_choice       : "ALL",
        target_range        : 3
    },    
    help: {
        id                  : 2,
        type                : MonsterType.None,
        cost                : 5,
        uses                : 5,
        accuracy            : true,
        damage_mod          : false,
        category            : [ActionCategory.Recovery, ActionCategory.Help],
        events              : {},
        effects             : [],
        target_team         : "ALLY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "CARDINAL", 
        target_choice       : "MONSTER",
        target_range        : 2,
        async onRunExtraEffects(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {            
            const BaseHeal = await this.Events.GetStatValue(target, 'hp', false, false)
            const HealVal = await this.Events.HealDamage(Math.ceil(BaseHeal/10), 0, source, target.Monster, source.Owner.Owner, target.Owner.Owner, messageList, false, false)
        }
    },    
    ritualblade: {
        id                  : 3,
        type                : MonsterType.Accursed,
        cost                : 15,
        uses                : 5,
        accuracy            : true,
        damage_mod          : false,
        category            : [ActionCategory.Recovery, ActionCategory.Help],
        events              : {},
        effects             : [],
        target_team         : "TEAM",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 3,
        async onRunExtraEffects(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {            
            const BaseVal = await this.Events.GetStatValue(target, 'hp', false, false)
            if (BaseVal) {
                const dmg = await this.Events.DealDamage((Math.ceil(BaseVal/10)), 0, eventSource, target, true, true, true)

                messageList.push({ "generic" : target.Monster.Nickname + " has been ritually hurt."})

                if (!target.Monster.Tokens.includes("undying")) {
                    target.Monster.Tokens.push("undying")
                }
            }
        }
    },    
    rotshot: {
        id                  : 4,
        type                : MonsterType.Accursed,
        cost                : 10,
        uses                : 10,
        accuracy            : 100,
        damage_mod          : -60,
        category            : [ActionCategory.Attack],
        events              : {},
        effects             : [],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 2,
        async onGetActionModifier(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : number, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {
            const BaseVal = await this.Events.GetStatValue(target, 'hp', false, false)
            const Proportion = 10 - (Math.ceil((10/BaseVal) * target.Monster.HP_Current))
            return relayVar + (20 * Proportion);
        }
    },    
    mindwipe: {
        id                  : 5,
        type                : MonsterType.Bizarro,
        cost                : 15,
        uses                : 10,
        accuracy            : 100,
        damage_mod          : -50,
        category            : [ActionCategory.Attack, ActionCategory.Debuff],
        events              : {},
        effects             : [
            {
            effectval   : 'dizzy',
            baseChance  : 50,
            trackerVal  : 3,
            target_type : "MONSTER"
            }
        ],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 3,        
        async onApplySelfToTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            if (!target.Monster.Tokens.includes('dizzy')) {
                target.Monster.Tokens.push('dizzy');
            }
            if (target.Monster.Trackers['dizzy']) {
                target.Monster.Trackers['dizzy'] = Math.max(3, target.Monster.Trackers['dizzy']);
            } else {
                target.Monster.Trackers['dizzy'] = 3;
            }
        }
    },    
    tractorbeam: {
        id                  : 6,
        type                : MonsterType.Bizarro,
        cost                : 15,
        uses                : 5,
        accuracy            : 100,
        damage_mod          : false,
        category            : [ActionCategory.Debuff],
        events              : {},
        effects             : [
            {
            effectval   : 'dizzy',
            baseChance  : 75,
            trackerVal  : 4,
            target_type : "MONSTER"
            }
        ],
        target_team         : "ENEMY",
        target_pos          : "SMALL",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 10,        
        async onApplySelfToTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            if (!target.Monster.Tokens.includes('dizzy')) {
                target.Monster.Tokens.push('dizzy');
            }
            if (target.Monster.Trackers['dizzy']) {
                target.Monster.Trackers['dizzy'] = Math.max(4, target.Monster.Trackers['dizzy']);
            } else {
                target.Monster.Trackers['dizzy'] = 4;
            }
        }
    },    
    radiate: {
        id                  : 7,
        type                : MonsterType.Charred,
        cost                : 10,
        uses                : 10,
        accuracy            : 100,
        damage_mod          : -80,
        category            : [ActionCategory.Debuff, ActionCategory.Attack],
        events              : {},
        effects             : [
            {
            effectval   : 'weakened',
            baseChance  : 75,
            trackerVal  : 4,
            target_type : "MONSTER"
            }
        ],
        target_team         : "ALL",
        target_pos          : "LARGE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 0,        
        async onApplySelfToTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            if (!target.Monster.Tokens.includes('weakened')) {
                target.Monster.Tokens.push('weakened');
            }
            if (target.Monster.Trackers['weakened']) {
                target.Monster.Trackers['weakened'] = Math.max(4, target.Monster.Trackers['weakened']);
            } else {
                target.Monster.Trackers['weakened'] = 4;
            }
        },
        async onMonsterUseActionOnMainTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : boolean, messageList : MessageSet, fromSource : boolean) { return false; }
    },    
    oilspit: {
        id                  : 8,
        type                : MonsterType.Charred,
        cost                : 10,
        uses                : 10,
        accuracy            : 100,
        damage_mod          : -80,
        category            : [ActionCategory.Terraform, ActionCategory.Attack],
        events              : {},
        effects             : [
            {
            effectval   : 'weakened',
            baseChance  : 75,
            trackerVal  : 4,
            target_type : "MONSTER"
            }
        ],
        target_team         : "ALL",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_fill         : "ALL",
        target_direction    : "ORTHOGONAL", 
        target_choice       : "ALL",
        target_range        : 3, 
        async onMonsterUseActionOnSecondaryTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : boolean, messageList : MessageSet, fromSource : boolean) { return false; },
        async onGenerateFieldEffect(this : Battle, eventSource : any, sourceEffect : ActiveItem, messageList : MessageSet, fromSource : boolean) {
            const _interface : IFieldEffect = {
                tokens      : [],        // Tokens held by the plot
                trackers    : {},    // Misc trackers used by plot tokens
                plots       : [],
                fieldEffect : "dangerousterrain"
            }
            const Effect : FieldEffect = new FieldEffect(_interface,this.Scene )
            return Effect;
        }
    },    
    intothepit: {
        id                  : 9,
        type                : MonsterType.Dungeon,
        cost                : 5,
        uses                : 5,
        accuracy            : 100,
        damage_mod          : false,
        category            : [ActionCategory.Debuff],
        events              : {},
        effects             : [
            {
            effectval   : 'enveloped',
            baseChance  : 150,
            trackerVal  : 3,
            target_type : "MONSTER"
            }
        ],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "ALL",
        target_range        : 4, 
        async onApplySelfToTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            if (!target.Monster.Tokens.includes('enveloped')) {
                target.Monster.Tokens.push('enveloped');
            }
            if (target.Monster.Trackers['enveloped']) {
                target.Monster.Trackers['enveloped'] = Math.max(4, target.Monster.Trackers['enveloped']);
            } else {
                target.Monster.Trackers['enveloped'] = 4;
            }
        }
    },    
    graveyard: {
        id                  : 10,
        type                : MonsterType.Dungeon,
        cost                : 15,
        uses                : 5,
        accuracy            : true,
        damage_mod          : false,
        category            : [ActionCategory.Terraform],
        events              : {},
        effects             : [],
        target_team         : "ANY",
        target_pos          : "SINGLE",
        target_type         : "TERRAIN",
        target_direction    : "ALL", 
        target_choice       : "TERRAIN",
        target_range        : 1, 
        async onGenerateFieldEffect(this : Battle, eventSource : any, sourceEffect : ActiveItem, messageList : MessageSet, fromSource : boolean) {
            const _interface : IFieldEffect = {
                tokens      : [],        // Tokens held by the plot
                trackers    : {},    // Misc trackers used by plot tokens
                plots       : [],
                fieldEffect : "obstacle"
            }
            const Effect : FieldEffect = new FieldEffect(_interface,this.Scene )
            return Effect;
        }
    },    
    dance: {
        id                  : 11,
        type                : MonsterType.Enchanted,
        cost                : 20,
        uses                : 5,
        accuracy            : true,
        damage_mod          : false,
        category            : [ActionCategory.Buff],
        events              : {},
        effects             : [],
        target_team         : "SELF",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 0, 
        async onApplySelfToTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            for (let i = 0; i < source.Owner.Leads.length; i++) {
                if (!source.Owner.Leads[i].Monster.Tokens.includes('whimsical')) {
                    source.Owner.Leads[i].Monster.Tokens.push('whimsical');
                }
                if (source.Owner.Leads[i].Monster.Trackers['whimsical']) {
                    source.Owner.Leads[i].Monster.Trackers['whimsical'] = Math.max(4, source.Owner.Leads[i].Monster.Trackers['whimsical']);
                } else {
                    source.Owner.Leads[i].Monster.Trackers['whimsical'] = 4;
                }
            }
            
        }
    },   
    pixiedust: {
        id                  : 12,
        type                : MonsterType.Enchanted,
        cost                : 15,
        uses                : 10,
        accuracy            : true,
        damage_mod          : -75,
        category            : [ActionCategory.Recovery, ActionCategory.Attack],
        events              : {},
        effects             : [],
        target_team         : "ANY",
        target_pos          : "MEDIUM",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "ALL",
        target_range        : 2,
        async onMonsterUseActionOnSecondaryTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : boolean, messageList : MessageSet, fromSource : boolean) { 
            if (source.Owner === target.Owner) {
                const BaseHeal = await this.Events.GetStatValue(target, 'hp', false, false)
                const HealVal = await this.Events.HealDamage(Math.ceil(BaseHeal/5), 0, source, target.Monster, source.Owner.Owner, target.Owner.Owner, messageList, false, false)
                return false; 
            } else {
                return relayVar;
            }
        },        
        async onMonsterUseActionOnMainTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : boolean, messageList : MessageSet, fromSource : boolean) { 
            if (source.Owner === target.Owner) {
                const BaseHeal = await this.Events.GetStatValue(target, 'hp', false, false)
                const HealVal = await this.Events.HealDamage(Math.ceil(BaseHeal/5), 0, source, target.Monster, source.Owner.Owner, target.Owner.Owner, messageList, false, false)
                return false; 
            } else {
                return relayVar;
            }
        }
    },   
    whirlgang: {
        id                  : 13,
        type                : MonsterType.Flooded,
        cost                : 10,
        uses                : 5,
        accuracy            : true,
        damage_mod          : -40,
        category            : [ActionCategory.Buff, ActionCategory.Attack],
        events              : {},
        effects             : [],
        target_team         : "ALL",
        target_pos          : "MEDIUM",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "ALL",
        target_range        : 0,        
        async onMonsterUseActionOnMainTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : boolean, messageList : MessageSet, fromSource : boolean) { 
            if (source === target) {
                if (!source.Monster.Tokens.includes('tempest')) {
                    source.Monster.Tokens.push('tempest');
                }
                return false; 
            } else {
                return relayVar;
            }
        },        
        async onMonsterUseActionOnSecondaryTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : boolean, messageList : MessageSet, fromSource : boolean) { 
            if (source.Owner === target.Owner) {
                return false; 
            } else {
                return relayVar;
            }
        }
    },   
    purepressure: {
        id                  : 14,
        type                : MonsterType.Flooded,
        cost                : 5,
        uses                : 10,
        accuracy            : 75,
        damage_mod          : 75,
        category            : [ ActionCategory.Attack],
        events              : {},
        effects             : [],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "BOTH", 
        target_choice       : "MONSTER",
        target_range        : 4
    },    
    collectcall: {
        id                  : 15,
        type                : MonsterType.Gilded,
        cost                : 5,
        uses                : 5,
        accuracy            : true,
        damage_mod          : false,
        category            : [ActionCategory.Buff],
        events              : {},
        effects             : [],
        target_team         : "SELF",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 0, 
        async onRunExtraEffects(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {    
            if (!source.Monster.Tokens.includes('insured')) {
                source.Monster.Tokens.push('insured');
            }
            if (source.Monster.Trackers['insured']) {
                source.Monster.Trackers['insured'] = Math.max(3, source.Monster.Trackers['insured']);
            } else {
                source.Monster.Trackers['insured'] = 3;
            }            
        }
    },    
    payoff: {
        id                  : 16,
        type                : MonsterType.Gilded,
        cost                : 15,
        uses                : 1,
        accuracy            : true,
        damage_mod          : false,
        category            : [ActionCategory.Debuff],
        events              : {},
        effects             : [],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 3,
        async onRunExtraEffects(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {            
            let IsSwapped = true;
            while (IsSwapped) {

                const AwaitSwap = await this.AutoSwapMonster(target.Monster)
                if (AwaitSwap === true) {IsSwapped = false}
                if (AwaitSwap === false) {
                    IsSwapped = false
                    target.Owner.RemoveFielded(target);
                    await this.UpdateBattleState();
                }
            }
        }
    },    
    stitchup: {
        id                  : 17,
        type                : MonsterType.Igor,
        cost                : 10,
        uses                : 5,
        accuracy            : true,
        damage_mod          : false,
        category            : [ActionCategory.Recovery, ActionCategory.Help],
        events              : {},
        effects             : [],
        target_team         : "TEAM",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "CARDINAL", 
        target_choice       : "MONSTER",
        target_range        : 1,
        async onRunExtraEffects(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {            
            const BaseHeal = await this.Events.GetStatValue(target, 'hp', false, false)
            const HealVal = await this.Events.HealDamage(Math.ceil(BaseHeal/2), 0, source, target.Monster, source.Owner.Owner, target.Owner.Owner, messageList, false, false)
        }
    },    
    vaccine: {
        id                  : 18,
        type                : MonsterType.Igor,
        cost                : 10,
        uses                : 5,
        accuracy            : 100,
        damage_mod          : false,
        category            : [ActionCategory.Recovery],
        events              : {},
        effects             : [],
        target_team         : "ALLY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 2, 
        async onRunExtraEffects(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {    
            if (!target.Monster.Tokens.includes('immunised')) {
                target.Monster.Tokens.push('immunised');
            }
            if (target.Monster.Trackers['immunised']) {
                target.Monster.Trackers['immunised'] = Math.max(3, target.Monster.Trackers['immunised']);
            } else {
                target.Monster.Trackers['immunised'] = 3;
            }  
            
            let HPHeal =  await this.Events.MakeDamageOut(source, sourceEffect, target, false);
            const HealVal = await this.Events.HealDamage(HPHeal, 0, source, target.Monster, source.Owner.Owner, target.Owner.Owner, messageList, false, false)
        }
    },  
    smite: {
        id                  : 19,
        type                : MonsterType.Knight,
        cost                : 15,
        uses                : 10,
        accuracy            : 100,
        damage_mod          : 0,
        category            : [ActionCategory.Attack, ActionCategory.Debuff],
        events              : {},
        effects             : [
            {
            effectval   : 'branded',
            baseChance  : 75,
            trackerVal  : 3,
            target_type : "MONSTER"
            }
        ],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 2,        
        async onApplySelfToTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            
            if (!target.Monster.Tokens.includes('branded')) {
                target.Monster.Tokens.push('branded');
            }
            if (target.Monster.Trackers['branded']) {
                target.Monster.Trackers['branded'] = Math.max(3, target.Monster.Trackers['branded']);
            } else {
                target.Monster.Trackers['branded'] = 3;
            }
        }
    },  
    honourablearrow: {
        id                  : 20,
        type                : MonsterType.Knight,
        cost                : 10,
        uses                : 10,
        accuracy            : true,
        damage_mod          : -25,
        category            : [ActionCategory.Attack],
        events              : {},
        effects             : [
        ],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 4
    },  
    deathroll: {
        id                  : 21,
        type                : MonsterType.Rabid,
        cost                : 5,
        uses                : 10,
        accuracy            : true,
        damage_mod          : 50,
        category            : [ActionCategory.Attack, ActionCategory.Debuff],
        events              : {},
        effects             : [
            {
            effectval   : 'wounded',
            baseChance  : 100,
            trackerVal  : 3,
            target_type : "MONSTER"
            }
        ],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 1,        
        async onApplySelfToTarget(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            if (!target.Monster.Tokens.includes('wounded')) {
                target.Monster.Tokens.push('wounded');
            }
        }
    },  
    slam: {
        id                  : 22,
        type                : MonsterType.Rabid,
        cost                : 10,
        uses                : 5,
        accuracy            : 75,
        damage_mod          : 0,
        category            : [ActionCategory.Attack],
        events              : {},
        effects             : [
        ],
        target_team         : "ENEMY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 2,        
        async onGetFinalDamageOut (this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction , relayVar : number, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {
            const rnmd = Math.floor(Math.random() * 2);
            if (rnmd === 0) {                
                messageList.push({ "generic" : target.Monster.Nickname + " took a massive blow!"})
                return relayVar * 3
            } else {
                return relayVar;
            }
        }
    }
}