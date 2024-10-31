import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { IEffectData, MessageSet, TraitBattleTable } from "../../../global_types";
import { TokenCategory, TraitCategory } from "../../enum/categories";
import { MonsterType } from "../../enum/types";
import { ActionBattleDex } from "../action/action_btl";
import { TokenMonsterBattleDex } from "../token/t_monster/token_monster_btl";
import { TokenMonsterInfoDex } from "../token/t_monster/token_monster_inf";

/**
 * Trait mechanical information database
 */
export const TraitBattleDex : TraitBattleTable = {
    hospitality: {
        id          : 0,
        cost        : 5,
        category    : [TraitCategory.Restoration],
        events      : {},
        async onSwitchInMonster(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            for (let i = 0; i < source.Owner.Leads.length; i++) {
                const BaseHeal = await this.Events.GetStatValue(source.Owner.Leads[i], 'hp', false, false)
                const HealVal = await this.Events.HealDamage(Math.ceil(BaseHeal/10), 0, source, source.Owner.Leads[i].Monster, source.Owner.Owner, source.Owner.Leads[i].Owner.Owner, messageList, false, false)
            }
        }
    },
    retreat: {
        id          : 1,
        cost        : 20,
        category    : [TraitCategory.Movement],
        events      : {},
        async onGetStatModpt(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster, relayVar : number, messageList : MessageSet, fromSource : boolean) {
            const SourceMonster = (source instanceof FieldedMonster)? source.Monster : source;
            let FinalOutput = relayVar
            const BaseHP = await this.Events.GetStatValue(SourceMonster, 'hp', false, false)
            const Proportion = 4 - (Math.floor((4/BaseHP) * SourceMonster.HP_Current))
            
            FinalOutput += Proportion;
            
            return FinalOutput;
        }
    },
    stressed: {
        id          : 2,
        cost        : 10,
        category    : [TraitCategory.Armour],
        events      : {},
        async onGetStatModsp(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster, relayVar : number, messageList : MessageSet, fromSource : boolean) {
            const SourceMonster = (source instanceof FieldedMonster)? source.Monster : source;
            let FinalOutput = relayVar
            const BaseHP = await this.Events.GetStatValue(SourceMonster, 'hp', false, false)

            if (SourceMonster.HP_Current <= (BaseHP/2)) {
                FinalOutput += 2;
            }
            
            return FinalOutput;
        }
    },
    soulsucker: {
        id          : 3,
        cost        : 10,
        category    : [TraitCategory.Restoration],
        events      : {},        
        async onOnEffectApply(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : IEffectData, messageList : MessageSet, fromSource : boolean) {
            const HealVal = await this.Events.HealDamage(1, 0, source, source.Monster, source.Owner.Owner, source.Owner.Owner, messageList, false, false)
        }
    },
    guardian: {
        id          : 4,
        cost        : 15,
        category    : [TraitCategory.Armour],
        events      : {}, 
        async onGetFinalDamage (this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, relayVar : number, messageList : MessageSet, fromSource : boolean) {
            if (relayVar >= 1) {
                return relayVar - 1;
            } else {
                return relayVar;
            }
        }
    },
    overgrown: {
        id          : 5,
        cost        : 10,
        category    : [TraitCategory.Damage, TraitCategory.Skill],
        events      : {},
        async onGetDamageNumberModified(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : number, trackVal: boolean, messageList : MessageSet, fromSource : boolean) {
            if (ActionBattleDex[sourceEffect.Action].type === MonsterType.Enchanted) {
                return Math.ceil(relayVar * 1.25)
            } else {
                return relayVar
            }
        },        
        async onModifySKMod(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : number, trackVal: IEffectData, messageList : MessageSet, fromSource : boolean) {
            if (ActionBattleDex[sourceEffect.Action].type === MonsterType.Enchanted) {
                return Math.ceil(relayVar * 1.25)
            } else {
                return relayVar
            }
        }
    }
}