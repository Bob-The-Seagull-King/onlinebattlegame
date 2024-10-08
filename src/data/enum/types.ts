import { TypeChartTable } from "../../global_types"

/**
 * The index number of each type
 */
enum MonsterType {
    None = 0,
    Blaze = 1,
    Flowering = 2,
    Pelagic = 3,
    Skirmish = 4,
    Stonework = 5,
    Poison = 6,
    Tempest = 7,
    Gilded = 8,
    Enchanted = 9,
    Bizarro = 10
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
        1 : 0, // Blaze
        2 : 0, // Flowering
        3 : 0, // Pelagic
        4 : 0, // Skirmish
        5 : 0, // Stonework
        6 : 0, // Poison
        7 : 0, // Tempest
        8 : 0, // Gilded
        9 : 0, // Enchanted
        10: 0  // Bizarro
    },
    1 : { // Blaze
        0 : 0, // None
        1 : 2, // Blaze
        2 : 1, // Flowering
        3 : 2, // Pelagic
        4 : 0, // Skirmish
        5 : 0, // Stonework
        6 : 0, // Poison
        7 : 2, // Tempest
        8 : 1, // Gilded
        9 : 0, // Enchanted
        10: 0  // Bizarro
    },
    2 : { // Flowering
        0 : 0, // None
        1 : 2, // Blaze
        2 : 2, // Flowering
        3 : 1, // Pelagic
        4 : 0, // Skirmish
        5 : 0, // Stonework
        6 : 2, // Poison
        7 : 0, // Tempest
        8 : 2, // Gilded
        9 : 1, // Enchanted
        10: 0  // Bizarro
    },
    3 : { // Pelagic
        0 : 0, // None
        1 : 1, // Blaze
        2 : 2, // Flowering
        3 : 2, // Pelagic
        4 : 0, // Skirmish
        5 : 1, // Stonework
        6 : 0, // Poison
        7 : 2, // Tempest
        8 : 0, // Gilded
        9 : 0, // Enchanted
        10: 0  // Bizarro
    },
    4 : { // Skirmish
        0 : 0, // None
        1 : 0, // Blaze
        2 : 0, // Flowering
        3 : 0, // Pelagic
        4 : 1, // Skirmish
        5 : 1, // Stonework
        6 : 0, // Poison
        7 : 0, // Tempest
        8 : 2, // Gilded
        9 : 2, // Enchanted
        10: 2  // Bizarro
    },
    5 : { // Stonework
        0 : 0, // None
        1 : 0, // Blaze
        2 : 2, // Flowering
        3 : 0, // Pelagic
        4 : 2, // Skirmish
        5 : 0, // Stonework
        6 : 1, // Poison
        7 : 1, // Tempest
        8 : 2, // Gilded
        9 : 0, // Enchanted
        10: 0  // Bizarro
    },
    6 : { // Poison
        0 : 0, // None
        1 : 0, // Blaze
        2 : 1, // Flowering
        3 : 1, // Pelagic
        4 : 1, // Skirmish
        5 : 2, // Stonework
        6 : 2, // Poison
        7 : 0, // Tempest
        8 : 0, // Gilded
        9 : 0, // Enchanted
        10: 0  // Bizarro
    },
    7 : { // Tempest
        0 : 0, // None
        1 : 3, // Blaze
        2 : 1, // Flowering
        3 : 1, // Pelagic
        4 : 0, // Skirmish
        5 : 2, // Stonework
        6 : 0, // Poison
        7 : 1, // Tempest
        8 : 2, // Gilded
        9 : 0, // Enchanted
        10: 0  // Bizarro
    },
    8 : { // Gilded
        0 : 0, // None
        1 : 2, // Blaze
        2 : 3, // Flowering
        3 : 2, // Pelagic
        4 : 0, // Skirmish
        5 : 0, // Stonework
        6 : 1, // Poison
        7 : 0, // Tempest
        8 : 3, // Gilded
        9 : 1, // Enchanted
        10: 3  // Bizarro
    },
    9 : { // Enchanted
        0 : 0, // None
        1 : 0, // Blaze
        2 : 0, // Flowering
        3 : 0, // Pelagic
        4 : 1, // Skirmish
        5 : 1, // Stonework
        6 : 2, // Poison
        7 : 2, // Tempest
        8 : 0, // Gilded
        9 : 1, // Enchanted
        10: 3  // Bizarro
    },
    10 : { // Bizzaro
        0 : 0, // None
        1 : 0, // Blaze
        2 : 1, // Flowering
        3 : 0, // Pelagic
        4 : 0, // Skirmish
        5 : 0, // Stonework
        6 : 0, // Poison
        7 : 0, // Tempest
        8 : 1, // Gilded
        9 : 3, // Enchanted
        10: 0  // Bizarro
    }
}

export {MonsterType}