import { ItemBattleTable } from "../../../global_types";
import { ItemCategory } from "../../enum/categories";

export const ItemBattleDex : ItemBattleTable = {
    temp : {
        id          : 0,
        cost        : 5,
        category    : ItemCategory.None,
        team_target : "SELF",
        pos_target  : "SINGLE",
        type_target : "MONSTER"
    }
}