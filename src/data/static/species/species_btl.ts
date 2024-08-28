import { SpeciesBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

/**
 * Monster species mechanical information database
 */
export const SpeciesBattleDex : SpeciesBattleTable = {
    cleric : {
        id      : 0,
        type    : [MonsterType.Gilded],
        stats   : { hp : 40, dm : [3,6], ac: 0, pt: 10, sk : 20, rs : 25, sp: 3 },
        cost    : 50
    },
    bruiser : {
        id      : 1,
        type    : [MonsterType.Skirmish, MonsterType.Blaze],
        stats   : { hp : 40, dm : [5,10], ac: 0, pt: 15, sk : 15, rs : 15, sp: 2 },
        cost    : 50
    },
    nimble : {
        id      : 2,
        type    : [MonsterType.Tempest],
        stats   : { hp : 28, dm : [2,8], ac: 20, pt: 0, sk : 25, rs : 10, sp: 10 },
        cost    : 50
    },
    arcana : {
        id      : 3,
        type    : [MonsterType.Poison, MonsterType.Vegtation],
        stats   : { hp : 32, dm : [3,8], ac: 10, pt: 0, sk : 35, rs : 25, sp: 6 },
        cost    : 50
    }
}