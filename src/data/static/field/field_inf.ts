import { FieldInfoTable } from "../../../global_types";

/**
 * Item non-mechanical information database
 */
export const FieldInfoDex : FieldInfoTable = {
    dangerousterrain: {
        id          : 1,   
        name        : "Dangerous Terrain",   
        description : [
            {cat: "general", text: "Deals 5 HP when entering. This damage ignores "},
            {cat: "stat", text: "Protection"},
            {cat: "general", text: "."}
        ]   
    },
    harshterrain: {
        id          : 2,   
        name        : "Harsh Terrain",   
        description : [
            {cat: "general", text: "Deals 5 HP when entering."}
        ]   
    },
    thickterrain: {
        id          : 3,   
        name        : "Thick Terrain",   
        description : [
            {cat: "general", text: "Prevents Monsters from switching out."}
        ]   
    },
    obstacle: {
        id          : 4,   
        name        : "Obstacle",   
        description : [
            {cat: "general", text: "Blocks and Prevents movement."}
        ]   
    }
}