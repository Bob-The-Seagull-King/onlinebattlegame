import { ItemBattleTable } from "../../../global_types";
import { ItemCategory } from "../../enum/categories";

/**
 * Item mechanical information database
 */
export const ItemBattleDex : ItemBattleTable = {
    herb : {
        id          : 0,
        cost        : 10,
        category    : [ItemCategory.Restoration],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER"
    },
    sharpstones : {
        id          : 1,
        cost        : 20,
        category    : [ItemCategory.Terraform],
        team_target : "ENEMY",
        pos_target  : "SIDE",
        type_target : "TERRAIN"
    }
}