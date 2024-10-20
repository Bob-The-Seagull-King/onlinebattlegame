import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveItem } from "../../../classes/sim/models/active_item";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldEffect, IFieldEffect } from "../../../classes/sim/models/Effects/field_effect";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { ItemBattleTable, MessageSet } from "../../../global_types";
import { ItemCategory } from "../../enum/categories";
import { MonsterType } from "../../enum/types";
import { SpeciesEvolutionDex } from "../species/species_evl";
import { SpeciesInfoDex } from "../species/species_inf";

/**
 * Item mechanical information database
 */
export const ItemBattleDex : ItemBattleTable = {
    greenherb: {
        id                  : 0,
        cost                : 40,
        category            : [],
        events              : {},
        target_team         : "SELF",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL",
        target_choice       : "MONSTER",
        target_range        : 0,
        async onUseItemOnSelfMonster(this : Battle, eventSource : any, target :  FieldedMonster, sourceEffect : ActiveItem, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {
            const BaseHeal = await this.Events.GetStatValue(target, 'hp', false, false)
            const HealVal = await this.Events.HealDamage(BaseHeal, 0, sourceEffect, target.Monster, sourceEffect.Owner.Owner, target.Owner.Owner, messageList, false, false)
        }
    },
    blockofstone: {
        id                  : 1,
        cost                : 25,
        category            : [],
        events              : {},
        target_team         : "ANY",
        target_pos          : "SINGLE",
        target_type         : "TERRAIN",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0,        
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
    mudshot: {
        id                  : 2,
        cost                : 50,
        category            : [],
        events              : {},
        target_team         : "ANY",
        target_pos          : "SMALL",
        target_type         : "TERRAIN",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0,        
        async onGenerateFieldEffect(this : Battle, eventSource : any, sourceEffect : ActiveItem, messageList : MessageSet, fromSource : boolean) {
            const _interface : IFieldEffect = {
                tokens      : [],        // Tokens held by the plot
                trackers    : {},    // Misc trackers used by plot tokens
                plots       : [],
                fieldEffect : "difficultterrain"
            }
            const Effect : FieldEffect = new FieldEffect(_interface,this.Scene )
            return Effect;
        }
    },
    microbomb: {
        id                  : 3,
        cost                : 75,
        category            : [],
        events              : {},
        target_team         : "ENEMY",
        target_pos          : "MEDIUM",
        target_type         : "TERRAIN",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0,        
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
    gunklauncher: {
        id                  : 4,
        cost                : 50,
        category            : [],
        events              : {},
        target_team         : "ANY",
        target_pos          : "LARGE",
        target_type         : "ALL",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0,        
        async onGenerateFieldEffect(this : Battle, eventSource : any, sourceEffect : ActiveItem, messageList : MessageSet, fromSource : boolean) {
            const _interface : IFieldEffect = {
                tokens      : [],        // Tokens held by the plot
                trackers    : {},    // Misc trackers used by plot tokens
                plots       : [],
                fieldEffect : "thickterrain"
            }
            const Effect : FieldEffect = new FieldEffect(_interface,this.Scene )
            return Effect;
        }
    },
    boomboom: {
        id                  : 5,
        cost                : 75,
        category            : [],
        events              : {},
        target_team         : "ALL",
        target_pos          : "MEDIUM",
        target_type         : "MONSTER",
        target_direction    : "ALL",
        target_choice       : "MONSTER",
        target_range        : 0,        
        async onUseItemOnAnyMonster(this : Battle, eventSource : any, target :  FieldedMonster, sourceEffect : ActiveItem, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {
            let TypeVal = 0;
            await this.Events.DealDamage(5, TypeVal, sourceEffect, target, true, false, false)

            messageList.push({ "generic" : target.Monster.Nickname + " has been damaged by the Boom Boom."})
        }
    }
}