import { TraitBattleTable } from "../../../global_types";
import { TraitCategory } from "../../enum/categories";

/**
 * Trait mechanical information database
 */
export const TraitBattleDex : TraitBattleTable = {
    clearbody : {
        id          : 0,
        cost        : 10,
        category    : [TraitCategory.Restoration]
    },
    harshlife : {
        id          : 1,
        cost        : 10,
        category    : [TraitCategory.Armour]
    },
    retaliation : {
        id          : 2,
        cost        : 15,
        category    : [TraitCategory.Revenge]
    },
    vampire : {
        id          : 3,
        cost        : 20,
        category    : [TraitCategory.Drain]
    }
}