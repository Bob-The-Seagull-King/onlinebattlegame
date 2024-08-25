import { ActionInfoTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";

export const ActionInfoDex : ActionInfoTable = {
    tackle : {
        id          : 0,
        name        : "Tackle",
        description : [
            {cat: "", text: "The monster slams itself into the opponent."}
        ]
    }
}