import { ActionInfoTable } from "../../../global_types";

/**
 * Action non-mechanical information database
 */
export const ActionInfoDex : ActionInfoTable = {
    tackle : {
        id          : 0,
        name        : "Tackle",
        description : [
            {cat: "generic", text: "The monster hits the opponent with respectable force."}
        ]
    },
    superhotslam : {
        id          : 1,
        name        : "Superhot Slam",
        description : [
            {cat: "generic", text: "The monster hits the opponent with tremendous force. This may reduce the target or the user's"},
            {cat: "tokenbad", text: "Protection"}
        ]
    },
    sparkup : {
        id          : 2,
        name        : "Spark Up",
        description : [
            {cat: "generic", text: "The user usually acts first and"},
            {cat: "tokenbad", text: "Burns"},
            {cat: "generic", text: "the target"}
        ]
    },
    deeproots : {
        id          : 3,
        name        : "Deep Roots",
        description : [
            {cat: "generic", text: "Establishes a"},
            {cat: "tokenbad", text: "Deep Forest"},
            {cat: "generic", text: "on the user's side"}
        ]
    },
    aromatherapy : {
        id          : 4,
        name        : "Aromatherapy",
        description : [
            {cat: "generic", text: "The monster greatly increases its "},
            {cat: "tokengood", text: "Skill"},
            {cat: "generic", text: "and"},
            {cat: "tokengood", text: "Resistance"}
        ]
    },
    flytrap : {
        id          : 5,
        name        : "Fly Trap",
        description : [
            {cat: "generic", text: "The target is briefly"},
            {cat: "tokenbad", text: "Trapped"}
        ]
    },
    pressurecannon : {
        id          : 6,
        name        : "Pressure Cannon",
        description : [
            {cat: "generic", text: "Innacurate, but powerful if it hits"}
        ]
    },
    wavecrash : {
        id          : 7,
        name        : "Wave Crash",
        description : [
            {cat: "generic", text: "Deals no damage, but both opponents are sent"},
            {cat: "tokenbad", text: "Stumbling"}
        ]
    },
    slam : {
        id          : 8,
        name        : "Slam",
        description : [
            {cat: "generic", text: "The monster hits the opponent with tremendous force. This may leave them"},
            {cat: "tokenbad", text: "Dizzy"}
        ]
    },
    getpumped : {
        id          : 9,
        name        : "Get Pumped",
        description : [
            {cat: "generic", text: "The monster preps itself, boosting its damage by"},
            {cat: "tokengood", text: "25%"}
        ]
    },
    scatter : {
        id          : 10,
        name        : "Scatter",
        description : [
            {cat: "generic", text: "The monster scatters"},
            {cat: "tokenbad", text: "Pointed Stones"},
            {cat: "generic", text: "across the enemy terrain"}
        ]
    },
    rockthrow : {
        id          : 11,
        name        : "Rock Throw",
        description : [
            {cat: "generic", text: "Has a high chance to make the target"},
            {cat: "tokenbad", text: "Dizzy"}
        ]
    },
    nausea : {
        id          : 12,
        name        : "Nausea",
        description : [
            {cat: "generic", text: "Always hits, makes the target"},
            {cat: "tokenbad", text: "Ill"}
        ]
    },
    braindrain : {
        id          : 13,
        name        : "Brain Drain",
        description : [
            {cat: "generic", text: "The user absorbs 50% of the damage dealt as"},
            {cat: "effectpositive", text: "Health"}
        ]
    },
    stinger : {
        id          : 14,
        name        : "Stinger",
        description : [
            {cat: "generic", text: "The target has to resist suffering from"},
            {cat: "tokenbad", text: "Dizzy"},
            {cat: "tokenbad", text: "Stumbling"},
            {cat: "tokenbad", text: "Trapped"}
        ]
    },
    stormwinds : {
        id          : 15,
        name        : "Storm Winds",
        description : [
            {cat: "generic", text: "Targets all enemies and sends them"},
            {cat: "tokenbad", text: "Stumbling"}
        ]
    },
    raindance : {
        id          : 16,
        name        : "Rain Dance",
        description : [
            {cat: "generic", text: "Starts a"},
            {cat: "effectpositive", text: "Lightning Storm"},
            {cat: "generic", text: "for 5 rounds"}
        ]
    },
    blindinglight : {
        id          : 17,
        name        : "Blinding Light",
        description : [
            {cat: "generic", text: "Become immune to items and actions"}
        ]
    },
    dancinglights : {
        id          : 18,
        name        : "Dancing Lights",
        description : [
            {cat: "generic", text: "Summons"},
            {cat: "effectgood", text: "Dancing Lights"},
            {cat: "generic", text: "onto the field"}
        ]
    },
    moonbeam : {
        id          : 19,
        name        : "Moonbeam",
        description : [
            {cat: "generic", text: "On a hit, the user boosts their"},
            {cat: "tokengood", text: "Skill"}
        ]
    },
    regrow : {
        id          : 20,
        name        : "Regrow",
        description : [
            {cat: "generic", text: "The monster regains 50% of its"},
            {cat: "effectpositive", text: "Health"}
        ]
    },
    mindread : {
        id          : 21,
        name        : "Mind Read",
        description : [
            {cat: "generic", text: "Deals 1/16th to the target for each"},
            {cat: "effectpositive", text: "Boost"},
            {cat: "generic", text: "the target has"}
        ]
    },
    harshthenoise : {
        id          : 22,
        name        : "Harsh The Noise",
        description : [
            {cat: "generic", text: "This attack ignores"},
            {cat: "tokenbad", text: "Protection"}
        ]
    }
}