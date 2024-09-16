import { SpeciesInfoTable } from "../../../global_types";

/**
 * Monster species non-mechanical information database
 */
export const SpeciesInfoDex : SpeciesInfoTable = {
    cleric : {
        id          : 0,
        name        : "Cleric",
        subtitle    : "Recovery",
        description : "This test monster excels at restoration."     
    },
    terrain : {
        id          : 1,
        name        : "Terrain",
        subtitle    : "Terraform",
        description : "This test monster is able to create area effects."     
    },
    nimble : {
        id          : 2,
        name        : "Nimble",
        subtitle    : "Mobile",
        description : "This test monster is super quick."     
    },
    bruiser : {
        id          : 3,
        name        : "Bruiser",
        subtitle    : "Hard Hitting",
        description : "This test monster deals high damage with low accuracy."     
    },
    arcane : {
        id          : 4,
        name        : "Arcane",
        subtitle    : "Effect Causing",
        description : "This test monster causes effects."     
    },
    evolvea : {
        id          : 5,
        name        : "Evolve A",
        subtitle    : "Evolving",
        description : "This test monster evolves."     
    },
    evolveb : {
        id          : 6,
        name        : "Evolve B",
        subtitle    : "Evolved",
        description : "This test monster is an evolved form, much stronger."
    }
}