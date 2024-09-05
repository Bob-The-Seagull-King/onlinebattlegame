import { ItemInfoTable } from "../../../global_types";

/**
 * Item non-mechanical information database
 */
export const ItemInfoDex : ItemInfoTable = {
    blueherb: {
        id          : 1,
        name        : "Blue Herb",
        description : [
            {cat: "effectpositive", text: "Removes"},
            {cat: "generic", text: "any lowered base stats."}
        ]
    },
    greenherb: {
        id          : 2,
        name        : "Green Herb",
        description : [
            {cat: "generic", text: "The monster regains 50% of its"},
            {cat: "effectpositive", text: "Health"}
        ]
    },
    redherb: {
        id          : 3,
        name        : "Red Herb",
        description : [
            {cat: "generic", text: "Boosts the monster's"},
            {cat: "effectpositive", text: "Damage"},
            {cat: "generic", text: "by a lot, but takes away 33% of its"},
            {cat: "effectnegative", text: "Health"}
        ]
    },
    saltyberry: {
        id          : 4,
        name        : "Salty Berry",
        description : [
            {cat: "generic", text: "Gives the monster +2"},
            {cat: "tokengood", text: "Resistance"}
        ]
    },
    savouryberry: {
        id          : 5,
        name        : "Savoury Berry",
        description : [
            {cat: "generic", text: "Gives the monster +2"},
            {cat: "tokengood", text: "Protection"}
        ]
    },
    sourberry: {
        id          : 6,
        name        : "Sour Berry",
        description : [
            {cat: "generic", text: "Gives the monster +2"},
            {cat: "tokengood", text: "Skill"}
        ]
    },
    spicyberry: {
        id          : 7,
        name        : "Spicy Berry",
        description : [
            {cat: "generic", text: "Gives the monster +2"},
            {cat: "tokengood", text: "Damage"}
        ]
    },
    sweetberry: {
        id          : 8,
        name        : "Sweet Berry",
        description : [
            {cat: "generic", text: "Gives the monster +2"},
            {cat: "tokengood", text: "Speed"}
        ]
    },
    strongsoil: {
        id          : 9,
        name        : "Strong Soil",
        description : [
            {cat: "generic", text: "Can"},
            {cat: "tokengood", text: "Evolve"},
            {cat: "generic", text: "certain monsters"}
        ]
    }
}