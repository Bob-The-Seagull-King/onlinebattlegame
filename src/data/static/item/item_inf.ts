import { ItemInfoTable } from "../../../global_types";

/**
 * Item non-mechanical information database
 */
export const ItemInfoDex : ItemInfoTable = {
    greenherb: {
        id          : 0,
        name        : "Green Herb",
        description : [
            {cat: "positive", text: "Recovers 50% "},
            {cat: "general", text: "of the monsters "},
            {cat: "stat", text: "HP"},
            {cat: "general", text: "."}
        ]
    },
    blockofstone: {
        id          : 1,
        name        : "Block of Stone",
        description : [
            {cat: "general", text: "Creates an Obstacle on the field."}
        ]
    },
    mudshot: {
        id          : 2,
        name        : "Mud Shot",
        description : [
            {cat: "general", text: "Creates a small blast of difficult terrain."}
        ]
    },
    microbomb: {
        id          : 3,
        name        : "Micro Bomb",
        description : [
            {cat: "general", text: "Create a medium blast of dangerous terrain."}
        ]
    },
    gunklauncher: {
        id          : 4,
        name        : "Gunk Launcher",
        description : [
            {cat: "general", text: "Create a large blast of thick terrain."}
        ]
    },
    boomboom: {
        id          : 5,
        name        : "Boom Boom",
        description : [
            {cat: "general", text: "Deal 5 piercing damage to monsters in a medium blast."}
        ]
    }
}