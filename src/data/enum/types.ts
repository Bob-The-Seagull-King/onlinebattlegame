import { TypeChartTable } from "../../global_types"

/**
 * The index number of each type
 */
enum MonsterType {
    None = 0,
    Accursed = 1,
    Bizarro = 2,
    Charred = 3,
    Dungeon = 4,
    Enchanted = 5,
    Flooded = 6,
    Gilded = 7,
    Igor = 8,
    Knight = 9,
    Rabid = 10,
    Scum = 11,
    Vampire = 12
}

/**
 * Chart determining the outcome when type A is used
 * to target something of type B.
 * 
 * The attacking type is used as the index value.
 * 
 * 0 = Neutral matchup
 * 1 = Defending type is weak to Attacking type
 * 2 = Defending type resists the Attacking type
 * 3 = Defending type is immune to the Attacking type
 */
export const TypeMatchup : TypeChartTable = { 
    0 : { // None
        0 : 0, // None
        1 : 0, // Accursed
        2 : 0, // Bizzaro
        3 : 0, // Charred
        4 : 0, // Dungeon
        5 : 0, // Enchanted
        6 : 0, // Flooded
        7 : 0, // Gilded
        8 : 0, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    },
    1 : { // Accursed
        0 : 0, // None
        1 : 1, // Accursed
        2 : 0, // Bizzaro
        3 : 0, // Charred
        4 : 0, // Dungeon
        5 : 2, // Enchanted
        6 : 0, // Flooded
        7 : 2, // Gilded
        8 : 1, // Igor
        9 : 0, // Knight
        10: 1, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    },
    2 : { // Bizzaro
        0 : 0, // None
        1 : 0, // Accursed
        2 : 0, // Bizzaro
        3 : 0, // Charred
        4 : 0, // Dungeon
        5 : 1, // Enchanted
        6 : 0, // Flooded
        7 : 1, // Gilded
        8 : 2, // Igor
        9 : 1, // Knight
        10: 0, // Rabid
        11: 2, // Scum
        12: 0  // Vampire
    },
    3 : { // Charred
        0 : 0, // None
        1 : 0, // Accursed
        2 : 0, // Bizzaro
        3 : 2, // Charred
        4 : 2, // Dungeon
        5 : 0, // Enchanted
        6 : 2, // Flooded
        7 : 1, // Gilded
        8 : 0, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 0, // Scum
        12: 1  // Vampire
    },
    4 : { // Dungeon
        0 : 0, // None
        1 : 0, // Accursed
        2 : 0, // Bizzaro
        3 : 1, // Charred
        4 : 0, // Dungeon
        5 : 2, // Enchanted
        6 : 0, // Flooded
        7 : 0, // Gilded
        8 : 0, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    },
    5 : { // Enchanted
        0 : 0, // None
        1 : 0, // Accursed
        2 : 1, // Bizzaro
        3 : 0, // Charred
        4 : 2, // Dungeon
        5 : 0, // Enchanted
        6 : 0, // Flooded
        7 : 0, // Gilded
        8 : 1, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 2, // Scum
        12: 0  // Vampire
    },
    6 : { // Flooded
        0 : 0, // None
        1 : 0, // Accursed
        2 : 0, // Bizzaro
        3 : 1, // Charred
        4 : 0, // Dungeon
        5 : 0, // Enchanted
        6 : 2, // Flooded
        7 : 0, // Gilded
        8 : 0, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 0, // Scum
        12: 1  // Vampire
    },
    7 : { // Gilded
        0 : 0, // None
        1 : 0, // Accursed
        2 : 0, // Bizzaro
        3 : 1, // Charred
        4 : 2, // Dungeon
        5 : 0, // Enchanted
        6 : 0, // Flooded
        7 : 0, // Gilded
        8 : 0, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    },
    8 : { // Igor
        0 : 0, // None
        1 : 0, // Accursed
        2 : 2, // Bizzaro
        3 : 0, // Charred
        4 : 0, // Dungeon
        5 : 0, // Enchanted
        6 : 0, // Flooded
        7 : 0, // Gilded
        8 : 0, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 1, // Scum
        12: 2  // Vampire
    },
    9 : { // Knight
        0 : 0, // None
        1 : 2, // Accursed
        2 : 0, // Bizzaro
        3 : 0, // Charred
        4 : 1, // Dungeon
        5 : 0, // Enchanted
        6 : 0, // Flooded
        7 : 2, // Gilded
        8 : 0, // Igor
        9 : 3, // Knight
        10: 1, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    },
    10 : { // Rabid
        0 : 0, // None
        1 : 0, // Accursed
        2 : 1, // Bizzaro
        3 : 0, // Charred
        4 : 0, // Dungeon
        5 : 1, // Enchanted
        6 : 0, // Flooded
        7 : 0, // Gilded
        8 : 0, // Igor
        9 : 1, // Knight
        10: 1, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    },
    11 : { // Scum
        0 : 0, // None
        1 : 0, // Accursed
        2 : 1, // Bizzaro
        3 : 0, // Charred
        4 : 0, // Dungeon
        5 : 0, // Enchanted
        6 : 1, // Flooded
        7 : 2, // Gilded
        8 : 3, // Igor
        9 : 0, // Knight
        10: 0, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    },
    12 : { // Vampire
        0 : 0, // None
        1 : 1, // Accursed
        2 : 0, // Bizzaro
        3 : 0, // Charred
        4 : 2, // Dungeon
        5 : 0, // Enchanted
        6 : 0, // Flooded
        7 : 1, // Gilded
        8 : 0, // Igor
        9 : 0, // Knight
        10: 1, // Rabid
        11: 0, // Scum
        12: 0  // Vampire
    }
}

export {MonsterType}