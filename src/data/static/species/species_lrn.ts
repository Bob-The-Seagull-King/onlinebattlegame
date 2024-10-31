import { SpeciesLearnsetTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

/**
 * Monster species mechanical information database
 */
export const SpeciesLearnsetDex : SpeciesLearnsetTable = {
    cleric : {
        id          : 0,
        traits      : ["hospitality","guardian"],
        actions     : ["ritualblade","intothepit","dance","pixiedust","collectcall","payoff","stitchup","vaccine"]  
    },
    terrain : {
        id          : 1,
        traits      : ["retreat"],
        actions     : ["tractorbeam","oilspit","intothepit","graveyard","vaccine","blackdart","vomit"]   
    },
    nimble : {
        id          : 2,
        traits      : ["stressed"],
        actions     : ["rotshot","mindwipe","tractorbeam","whirlgang","honourablearrow","deathroll","slam","blackdart","feast"]   
    },
    bruiser : {
        id          : 3,
        traits      : ["guardian"],
        actions     : ["rotshot","graveyard","whirlgang","purepressure","stitchup","smite","deathroll","slam","feast"]   
    },
    arcane : {
        id          : 4,
        traits      : ["soulsucker","hospitality"],
        actions     : ["ritualblade","mindwipe","radiate","oilspit","collectcall","payoff","command"]  
    },
    evolvea : {
        id          : 5,
        traits      : ["overgrown"],
        actions     : ["radiate","dance","pixiedust","purepressure","smite","honourablearrow","vomit","command"]
    },
    evolveb : {
        id          : 6,
        traits      : ["stressed"],
        actions     : []
    }
}