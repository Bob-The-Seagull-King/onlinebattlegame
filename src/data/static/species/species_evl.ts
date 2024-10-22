import { SpeciesEvolutionTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

/**
 * Monster species mechanical information database
 */
export const SpeciesEvolutionDex : SpeciesEvolutionTable = {
    evolvea: {
        id          : 5,
        evolutions  : [
            {
                newspecies  : "evolveb",
                triggeritem : "greenherb"
            }
        ]
    }
}