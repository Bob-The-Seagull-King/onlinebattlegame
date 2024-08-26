import { ActionBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";

export const ActionBattleDex : ActionBattleTable = {
    tackle : {
        id          : 0,
        type        : MonsterType.Skirmish,
        cost        : 5,
        uses        : 15,
        accuracy    : 0,
        damage_mod  : 0,
        category    : ActionCategory.Blunt,
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER"
    }
}