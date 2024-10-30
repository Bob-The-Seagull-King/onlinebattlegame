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
    },
    retreat: {
        id          : 1,
        name        : 'Retreat',
        description : [ {cat: "general", text: "When at half HP "},
            {cat: "positive", text: " Gain +2 "},
            {cat: "stat", text: "Protection"}]
    }
}