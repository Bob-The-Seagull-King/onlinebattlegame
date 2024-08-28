import { TokenInfoTable } from "../../../../global_types";

/**
 * Terrain Token non-mechanical information database
 */
export const TokenTerrainInfoDex : TokenInfoTable = {
    pointed: {
        id          : 0,
        name        : "Pointed",
        description : [
            {cat: "generic", text: "When a monster switches in, they take 4 Stonework HP of damage."}
        ]
    }
}