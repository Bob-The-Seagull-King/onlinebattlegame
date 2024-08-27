import { ItemBattleTable } from "../../../global_types";
import { ItemCategory } from "../../enum/categories";

/**
 * Item mechanical information database
 */
export const ItemBattleDex : ItemBattleTable = {
    temp : {
        id          : 0,
        cost        : 5,
        category    : ItemCategory.None,
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER"
    }
}