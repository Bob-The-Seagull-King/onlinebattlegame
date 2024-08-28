import { SpeciesInfoTable } from "../../../global_types";

/**
 * Monster species non-mechanical information database
 */
export const SpeciesInfoDex : SpeciesInfoTable = {
    cleric: {
        id          : 0,
        name        : "Cleric",
        subtitle    : "Self Restoration",
        description : "Test Monster: Able to heal itself and lower pressure from the enemy."
    },
    bruiser: {
        id          : 1,
        name        : "Bruiser",
        subtitle    : "Hard Hitting",
        description : "Test Monster: Hits with consistant, high damage, but innacurate and with poor skill."
    },
    nimble: {
        id          : 2,
        name        : "Nimble",
        subtitle    : "Targetted Strike",
        description : "Test Monster: Usually moves first, usually hits, with decent damage but poor durability."
    },
    arcana: {
        id          : 3,
        name        : "Arcana",
        subtitle    : "Added Effects",
        description : "Test Monster: Generally middling stats, but able to easily inflict effects."
    }
}