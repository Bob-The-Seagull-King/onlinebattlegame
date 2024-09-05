import { TraitInfoTable } from "../../../global_types";

/**
 * Trait non-mechanical information database
 */
export const TraitInfoDex : TraitInfoTable = {
    harshlife: {
        id          : 1,
        name        : "Harsh Life",
        description : [
            {cat: "generic", text: "If the monster would take 1 damage, after protection, it instead takes no damage."}
        ]
    },
    retaliation: {
        id          : 2,
        name        : "Retaliation",
        description : [
            {cat: "generic", text: "When damaged by another monster, gain 50% damage on the next action."}
        ]
    },
    vampire: {
        id          : 3,
        name        : "Vampire",
        description : [
            {cat: "generic", text: "When applying an effect to an enemy, recover 1 HP."}
        ]
    },
    bullseye: {
        id          : 5,
        name        : "Bullseye",
        description : [
            {cat: "generic", text: "Attacks have a 10% chance to deal double base damage."}
        ]
    },
    entrenched: {
        id          : 6,
        name        : "Entrenched",
        description : [
            {cat: "generic", text: "At the end of the round, this monster recovers 10% HP."}
        ]
    },
    firstdefense: {
        id          : 7,
        name        : "First Defense",
        description : [
            {cat: "generic", text: "Double the monster's PT for the first round it's active. Resets upon SWITCHing."}
        ]
    },
    hotfeet: {
        id          : 8,
        name        : "Hot Feet",
        description : [
            {cat: "generic", text: "When entering battle, apply HOT COAL to their position."}
        ]
    },
    innerfurnace: {
        id          : 9,
        name        : "Inner Furnace",
        description : [
            {cat: "generic", text: "Those attacking this monster have a 20% chance to suffer BURN."}
        ]
    },
    overgrown: {
        id          : 10,
        name        : "Overgrown",
        description : [
            {cat: "generic", text: "Flowering type actions benefit from a 25% boost to DL, DH, and SK."}
        ]
    },
    retreat: {
        id          : 11,
        name        : "Retreat",
        description : [
            {cat: "generic", text: "When at 50% HP or less, gain a 25% PT modifier."}
        ]
    },
    sacrificialaltar: {
        id          : 12,
        name        : "Sacrificial Altar",
        description : [
            {cat: "generic", text: "When entering battle, places an ALTAR in their position."}
        ]
    },
    scaryface: {
        id          : 13,
        name        : "Scary Face",
        description : [
            {cat: "generic", text: "When entering battle, enemies suffer -1 DL and DH."}
        ]
    },
    solidbody: {
        id          : 14,
        name        : "Solid Body",
        description : [
            {cat: "generic", text: "This monster ignores negative AC, SK, and SP boosts."}
        ]
    },
    solidcomposition: {
        id          : 15,
        name        : "Solid Composition",
        description : [
            {cat: "generic", text: "When defeated, scatter Pointed Stones over the enemy."}
        ]
    },
    thunderclap: {
        id          : 16,
        name        : "Thunderclap",
        description : [
            {cat: "generic", text: "When damaged, trigger a Lightning Storm for 2 rounds."}
        ]
    }
}