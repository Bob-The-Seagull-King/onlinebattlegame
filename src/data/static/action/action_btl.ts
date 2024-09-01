import { ActionBattleTable, MessageSet } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";
import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { ActivePos } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { Side } from "../../../classes/sim/models/terrain/terrain_side";

/**
 * Action mechanical information database
 */
export const ActionBattleDex : ActionBattleTable = {
    tackle : {
        id          : 0,
        type        : MonsterType.None,
        cost        : 5,
        uses        : 15,
        accuracy    : 100,
        damage_mod  : 0,
        priority    : 0,
        category    : [ActionCategory.Blunt],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {}
    },    
    slam : {
        id          : 1,
        type        : MonsterType.Skirmish,
        cost        : 10,
        uses        : 15,
        accuracy    : 90,
        damage_mod  : 25,
        priority    : 0,
        category    : [ActionCategory.Blunt, ActionCategory.Aggressive],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {}
    },    
    regrow : {
        id          : 2,
        type        : MonsterType.Enchanted,
        cost        : 10,
        uses        : 10,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Restoration],
        team_target : "SELF",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {'heal': true},
        onReturnHealVal(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : target.Monster.Nickname + " regrew some damaged parts!"})
            return (Math.floor(target.Monster.HP_Current * 0.5));
        }
    },    
    getpumped : {
        id          : 3,
        type        : MonsterType.Skirmish,
        cost        : 5,
        uses        : 5,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Boost, ActionCategory.Aggressive],
        team_target : "SELF",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                messageList.push({ "generic" : target.Monster.Nickname + " got pumped up!"})
                if (!target.Monster.Tokens.includes("boostdamage")) {
                    target.Monster.Tokens.push("boostdamage")
                }
                if (target.Monster.Trackers["boostdamage"]) {
                    target.Monster.Trackers["boostdamage"] += 1;
                } else {
                    target.Monster.Trackers["boostdamage"] = 1;
                }
            }
        }
    },    
    windbreaker : {
        id          : 4,
        type        : MonsterType.Tempest,
        cost        : 10,
        uses        : 15,
        accuracy    : 100,
        damage_mod  : -50,
        priority    : 2,
        category    : [ActionCategory.Tactical, ActionCategory.Debuff],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {}
    },    
    harshthenoise : {
        id          : 5,
        type        : MonsterType.Poison,
        cost        : 20,
        uses        : 10,
        accuracy    : 110,
        damage_mod  : -25,
        priority    : 0,
        category    : [ActionCategory.Tactical, ActionCategory.Debuff],
        team_target : "ENEMY",
        pos_target  : "SIDE",
        type_target : "MONSTER",
        events      : {}
    },    
    scatter : {
        id          : 6,
        type        : MonsterType.Stonework,
        cost        : 10,
        uses        : 5,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Terraform],
        team_target : "ENEMY",
        pos_target  : "SIDE",
        type_target : "TERRAIN",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : Side, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : "Pointed Stone filled " + trainerTarget.Name + "'s side of the battle!"})
            if (!target.Tokens.includes('pointed')) {
                target.Tokens.push('pointed')
            }
        }
    }
}