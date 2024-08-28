import { TraitInfoTable } from "../../../global_types";

/**
 * Trait non-mechanical information database
 */
export const TraitInfoDex : TraitInfoTable = {
    clearbody: {
        id          : 0,
        name        : "Clear Body",
        description : [
            {cat: "generic", text: "When switching out, each status the monster is suffering from has a 25% chance to be removed"}
        ]
    },
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
            {cat: "generic", text: "When damaged by another monster, gain 25% damage on the next action."}
        ]
    },
    vampire: {
        id          : 3,
        name        : "Vampire",
        description : [
            {cat: "generic", text: "When applying an effect to an enemy, recover 1 HP."}
        ]
    }
}