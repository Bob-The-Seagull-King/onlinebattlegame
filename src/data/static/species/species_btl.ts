import { SpeciesBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

/**
 * Monster species mechanical information database
 */
export const SpeciesBattleDex : SpeciesBattleTable = {
    ruckut: {
        id          : 1,
        type        : [MonsterType.Pelagic],
        stats       : { hp : 40, dl : 14, dh : 28, ac: -25, pt: 50, sk : 20, rs : 30, sp: 4 },
        cost        : 125,
        evolution   : false
    },
    marrowdread: {
        id          : 2,
        type        : [MonsterType.Poison, MonsterType.Enchanted],
        stats       : { hp : 64, dl : 10, dh : 16, ac: 25, pt: 10, sk : 45, rs : 10, sp: 11 },
        cost        : 100,
        evolution   : false
    },
    humbood: {
        id          : 3,
        type        : [MonsterType.Flowering],
        stats       : { hp : 20, dl : 4, dh : 8, ac: 0, pt: 50, sk : 20, rs : 15, sp: 4 },
        cost        : 50,
        evolution   : false
    },
    everocious: {
        id          : 4,
        type        : [MonsterType.Flowering, MonsterType.Skirmish],
        stats       : { hp : 20, dl : 16, dh : 20, ac: 30, pt: 80, sk : 20, rs : 25, sp: 6 },
        cost        : 0,
        evolution   : true
    },
    stratate: {
        id          : 5,
        type        : [MonsterType.Tempest],
        stats       : { hp : 84, dl : 8, dh : 16, ac: 10, pt: 15, sk : 40, rs : 55, sp: 7 },
        cost        : 100,
        evolution   : false
    },
    stalagmitendon: {
        id          : 6,
        type        : [MonsterType.Stonework],
        stats       : { hp : 120, dl : 8, dh : 12, ac: 0, pt: 15, sk : 20, rs : 10, sp: 12 },
        cost        : 75,
        evolution   : false
    },
    impound: {
        id          : 7,
        type        : [MonsterType.Bizarro],
        stats       : { hp : 64, dl : 4, dh : 16, ac: 15, pt: 10, sk : 55, rs : 30, sp: 8 },
        cost        : 125,
        evolution   : false
    },
    celebratious: {
        id          : 8,
        type        : [MonsterType.Blaze, MonsterType.Gilded],
        stats       : { hp : 80, dl : 6, dh : 10, ac: 20, pt: 10, sk : 40, rs : 40, sp: 2 },
        cost        : 125,
        evolution   : false
    }
}