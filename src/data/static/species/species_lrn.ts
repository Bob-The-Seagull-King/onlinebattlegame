import { SpeciesLearnsetTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

/**
 * Monster species mechanical information database
 */
export const SpeciesLearnsetDex : SpeciesLearnsetTable = {
    ruckut: {
        id      : 1,
        traits  : ["bullseye","retreat"],
        actions : ["tackle","flytrap","pressurecannon","wavecrash","slam","raindance","blindinglight","regrow"]
    },
    marrowdread: {
        id      : 2,
        traits  : ["bullseye","vampire"],
        actions : ["tackle","sparkup","aromatherapy","slam","nausea","braindrain","stinger","moonbeam"]
    },
    humbood: {
        id      : 3,
        traits  : ["firstdefense","overgrow","entrenched"],
        actions : ["tackle","deeproots","aromatherapy","flytrap","pressurecannon","slam","getpumped","rockthrow","moonbeam"]
    },
    everocious: {
        id      : 4,
        traits  : ["retaliation"],
        actions : []
    },
    stratate: {
        id      : 5,
        traits  : ["firstdefense","scaryface","thunderclap"],
        actions : ["tackle","sparkup","wavecrash","slam","scatter","stormwinds","raindance","blindinglight","dancinglights","harshthenoise"]
    },
    stalagmitendon: {
        id      : 6,
        traits  : ["harshlife","solidcomposition"],
        actions : ["tackle","superhotslam","slam","scatter","rockthrow","regrow","harshthenoise"]
    },
    impound: {
        id      : 7,
        traits  : ["scaryface","vampire","sacrificialaltar"],
        actions : ["tackle","flytrap","slam","scatter","nausea","braindrain","dancinglights","mindread","harshthenoise"]
    },
    celebratious: {
        id      : 8,
        traits  : ["hotfeet","innerfurnace"],
        actions : ["tackle","superhotslam","sparkup","aromatherapy","getpumped","stinger","blindinglight","dancinglights","moonbeam"]
    }
}