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
    },
    dizzy: {
        id          : 1,       // Numerical ID of the token
        name        : 'dizzy',       // Name of the token
        description : [ 
            {cat: "general", text: "At the start of their turn "},
            {cat: "negative", text: "MOVE"},
            {cat: "general", text: " 1 space in a random direction."}]
    },
    weakened: {
        id          : 2,       // Numerical ID of the token
        name        : 'weakened',       // Name of the token
        description : [ 
            {cat: "general", text: "The monster's "},
            {cat: "stat", text: "Damage Maximum"},
            {cat: "general", text: " is brought down to their "},
            {cat: "stat", text: "Damage Minimum"},
            {cat: "general", text: "."}]
    },
    enveloped: {
        id          : 3,       // Numerical ID of the token
        name        : 'enveloped',       // Name of the token
        description : [ 
            {cat: "general", text: "The monster's "},
            {cat: "stat", text: "Range"},
            {cat: "general", text: " is halved (minimum of 1)."}]
    },
    whimsical: {
        id          : 4,       // Numerical ID of the token
        name        : 'whimsical',       // Name of the token
        description : [ 
            {cat: "general", text: "Has a 25% chance to "},
            {cat: "positive", text: "dodge"},
            {cat: "general", text: " enemy actions."}]
    },
    tempest: {
        id          : 5,       // Numerical ID of the token
        name        : 'tempest',       // Name of the token
        description : [ 
            {cat: "positive", text: "Ignores"},
            {cat: "general", text: " damage from terrain effects."}]
    }
}