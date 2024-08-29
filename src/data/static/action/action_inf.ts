import { ActionInfoTable } from "../../../global_types";

/**
 * Action non-mechanical information database
 */
export const ActionInfoDex : ActionInfoTable = {
    tackle : {
        id          : 0,
        name        : "Tackle",
        description : [
            {cat: "generic", text: "The monster hits the opponent with respectable force"}
        ]
    },
    slam : {
        id          : 1,
        name        : "Slam",
        description : [
            {cat: "generic", text: "The monster hits the opponent with tremendous force. This may leave them"},
            {cat: "tokenbad", text: "Dizzy"}
        ]
    },
    regrow : {
        id          : 2,
        name        : "Regrow",
        description : [
            {cat: "generic", text: "The monster regains 50% of its"},
            {cat: "effectpositive", text: "Health"}
        ]
    },
    getpumped : {
        id          : 3,
        name        : "Get Pumped",
        description : [
            {cat: "generic", text: "The monster preps itself, boosting its damage by"},
            {cat: "tokengood", text: "25%"}
        ]
    },
    windbreaker : {
        id          : 4,
        name        : "Wind Breaker",
        description : [
            {cat: "generic", text: "The monster moves first, sweeping the leg with harsh winds and inflicting"},
            {cat: "tokenbad", text: "Stumbling (3)"}
        ]
    },
    harshthenoise : {
        id          : 5,
        name        : "Harsh The Noise",
        description : [
            {cat: "generic", text: "The monster strikes both foes, potentially inflicting"},
            {cat: "tokenbad", text: "Dizzy"}
        ]
    },
    scatter : {
        id          : 6,
        name        : "Scatter",
        description : [
            {cat: "generic", text: "The monster scatters"},
            {cat: "tokenbad", text: "Pointed Stones"},
            {cat: "generic", text: "across the enemy terrain"}
        ]
    }
}