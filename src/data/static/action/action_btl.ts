import { ActionBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";

export const ActionBattleDex : ActionBattleTable = {
    temp : {
        id          : 0,
        type        : MonsterType.None,
        cost        : 5,
        uses        : 15,
        accuracy    : 0,
        damage_mod  : 0,
        category    : ActionCategory.None
    }
}