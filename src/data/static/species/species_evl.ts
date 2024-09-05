import { SpeciesEvolutionTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

/**
 * Monster species mechanical information database
 */
export const SpeciesEvolutionDex : SpeciesEvolutionTable = {
    humbood: {
        id      : 3,
        evolutions  : [
            {
                newspecies  : 'everocious',
                triggeritem : 'strongsoil'
            }
        ]
    }
}