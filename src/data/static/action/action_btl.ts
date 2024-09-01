import { ActionBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";

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
        events      : {}
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
        events      : {}
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
        events      : {}
    }
}