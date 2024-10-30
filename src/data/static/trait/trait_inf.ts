import { TraitInfoTable } from "../../../global_types";

/**
 * Trait non-mechanical information database
 */
export const TraitInfoDex : TraitInfoTable = {
    hospitality: {
        id          : 0,
        name        : 'Hospitality',
        description : [ {cat: "general", text: "When switching on "},
            {cat: "positive", text: " Recover 5% "},
            {cat: "stat", text: "HP"},
            {cat: "general", text: " to the active team members."}]
    }
}