import { SpeciesBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

/**
 * Monster species mechanical information database
 */
export const SpeciesBattleDex : SpeciesBattleTable = {
    cleric : {
        id          : 0,
        type        : [MonsterType.Igor],
        stats       : {
            hp  : 65,
            dl  : 6,
            dh  : 12,
            ac  : 0,
            pt  : 30,
            sk  : 20,
            rs  : 40,
            sp  : 4
        },
        cost        : 200,
        evolution   : false      
    },
    terrain : {
        id          : 1,
        type        : [MonsterType.Dungeon, MonsterType.Scum],
        stats       : {
            hp  : 55,
            dl  : 6,
            dh  : 12,
            ac  : 0,
            pt  : 20,
            sk  : 30,
            rs  : 20,
            sp  : 5
        },
        cost        : 150,
        evolution   : false      
    },
    nimble : {
        id          : 2,
        type        : [MonsterType.Rabid, MonsterType.Bizarro],
        stats       : {
            hp  : 40,
            dl  : 12,
            dh  : 15,
            ac  : 25,
            pt  : 10,
            sk  : 20,
            rs  : 25,
            sp  : 6
        },
        cost        : 150,
        evolution   : false      
    },
    bruiser : {
        id          : 3,
        type        : [MonsterType.Flooded],
        stats       : {
            hp  : 70,
            dl  : 9,
            dh  : 27,
            ac  : -20,
            pt  : 40,
            sk  : 0,
            rs  : 10,
            sp  : 2
        },
        cost        : 200,
        evolution   : false      
    },
    arcane : {
        id          : 4,
        type        : [MonsterType.Gilded, MonsterType.Charred],
        stats       : {
            hp  : 40,
            dl  : 9,
            dh  : 15,
            ac  : 10,
            pt  : 30,
            sk  : 45,
            rs  : 35,
            sp  : 4
        },
        cost        : 150,
        evolution   : false      
    },
    evolvea : {
        id          : 5,
        type        : [MonsterType.Enchanted],
        stats       : {
            hp  : 25,
            dl  : 5,
            dh  : 9,
            ac  : -25,
            pt  : 50,
            sk  : 0,
            rs  : 20,
            sp  : 3
        },
        cost        : 100,
        evolution   : true      
    },
    evolveb : {
        id          : 6,
        type        : [MonsterType.Enchanted, MonsterType.Knight],
        stats       : {
            hp  : 25,
            dl  : 12,
            dh  : 24,
            ac  : 25,
            pt  : 75,
            sk  : 10,
            rs  : 20,
            sp  : 6
        },
        cost        : 0,
        evolution   : false      
    }
}