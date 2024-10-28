import { TokenInfoTable } from "../../../../global_types";

/**
 * Monster Token non-mechanical information database
 */
export const TokenMonsterInfoDex : TokenInfoTable = {
    undying: {
        id          : 0,       // Numerical ID of the token
        name        : 'undying',       // Name of the token
        description : [ 
            {cat: "general", text: "When  "},
            {cat: "stat", text: "HP"},
            {cat: "general", text: "would reach 0, "},
            {cat: "positive", text: "instead reach 1HP."}]
    }
}