import { ItemInfoTable } from "../../../global_types";

/**
 * Item non-mechanical information database
 */
export const ItemInfoDex : ItemInfoTable = {
    herb: {
        id          : 0,
        name        : "Herb",
        description : [
            {cat: "generic", text: "The monster regains 25% of its"},
            {cat: "effectpositive", text: "Health"}
        ]
    },
    sharpstones: {
        id          : 1,
        name        : "Sharp Stones",
        description : [
            {cat: "generic", text: "The monster scatters"},
            {cat: "tokenbad", text: "Pointed Stones"},
            {cat: "generic", text: "across the enemy terrain"}
        ]
    }
}