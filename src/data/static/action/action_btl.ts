import { ActionBattleTable, MessageSet } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";
import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";

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
        effects             : [],
        target_team         : "ENEMY",
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
        target_range        : 1
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
        target_team         : "ALLY",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL", 
        target_choice       : "MONSTER",
        target_range        : 3,
        async onRunExtraEffects(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {            
            const BaseVal = await this.Events.GetStatValue(target, 'hp', false, false)
            await this.Events.DealDamage((Math.ceil(BaseVal/10)), 0, eventSource, target, true, true, true)

            messageList.push({ "generic" : target.Monster.Nickname + " has been ritually hurt."})

            if (!target.Monster.Tokens.includes("undying")) {
                target.Monster.Tokens.push("undying")
            }
        }
    }
}