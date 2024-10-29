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
    },    
    ritualblade: {
        id          : 3,
        name        : "Ritual Blade",
        description : [ {cat: "negative", text: "Removes 10% "},
            {cat: "stat", text: "HP"},{cat: "positive", text: " and applies UNDYING "}]
    },    
    rotshot: {
        id          : 4,
        name        : "Rot Shot",
        description : [ {cat: "general", text: "Deals +20% base damage for each 10% HP the target has lost."}]
    },    
    mindwipe: {
        id          : 5,
        name        : "Mind Wipe",
        description : []
    },    
    tractorbeam: {
        id          : 6,
        name        : "Tractor Beam",
        description : []
    },    
    radiate: {
        id          : 7,
        name        : "Radiate",
        description : []
    },    
    oilspit: {
        id          : 8,
        name        : "Oil Spit",
        description : []
    },    
    intothepit: {
        id          : 9,
        name        : "Into the Pit",
        description : []
    },    
    graveyard: {
        id          : 10,
        name        : "Graveyard",
        description : []
    },    
    dance: {
        id          : 11,
        name        : "Dance",
        description : []
    },    
    pixiedust: {
        id          : 12,
        name        : "Pixie Dust",
        description : []
    },    
    whirlgang: {
        id          : 13,
        name        : "Whirlgang",
        description : []
    },    
    purepressure: {
        id          : 14,
        name        : "Pure Pressure",
        description : []
    },    
    collectcall: {
        id          : 15,
        name        : "Collect Call",
        description : []
    },    
    payoff: {
        id          : 16,
        name        : "Pay Off",
        description : []
    }
}