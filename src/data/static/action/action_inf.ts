import { ActionInfoTable } from "../../../global_types";

/**
 * Action non-mechanical information database
 */
export const ActionInfoDex : ActionInfoTable = {
    strike: {
        id          : 0,
        name        : "Strike",
        description : [{cat: "general", text: "Deals basic damage"}]
    },    
    blast: {
        id          : 1,
        name        : "Blast",
        description : [{cat: "general", text: "Deals area damage"}]
    },    
    help: {
        id          : 2,
        name        : "Help",
        description : [ {cat: "positive", text: "Recovers 10% "},
            {cat: "stat", text: "HP"}]
    }
}