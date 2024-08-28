import { TokenInfoTable } from "../../../../global_types";

/**
 * Monster Token non-mechanical information database
 */
export const TokenMonsterInfoDex : TokenInfoTable = {
    dizzy: {
        id          : 0,
        name        : "Dizzy",
        description : [
            {cat: "generic", text: "Actions have -10% accuracy. At the end of the turn, a dizzy monster has a 50% chance to recover."}
        ]
    },
    stumbling: {
        id          : 1,
        name        : "Stumbling",
        description : [
            {cat: "generic", text: "The monster's speed is halved"}
        ]
    },
    boostdamage: {
        id          : 2,
        name        : "+Damage",
        description : [
            {cat: "generic", text: "The monster deals an additional 25% base damage"}
        ]
    },
    retaliation: {
        id          : 3,
        name        : "Retaliation",
        description : [
            {cat: "generic", text: "For their next action, the monster deals an additional 25% base damage"}
        ]
    }
}