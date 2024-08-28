import { TokenBattleTable } from "../../../../global_types";
import { TokenCategory } from "../../../enum/categories";

/**
 * Terrain Token mechanical information database
 */
export const TokenTerrainBattleDex : TokenBattleTable = {
    pointed : {
        id          : 0,
        category    : [TokenCategory.Harsh,TokenCategory.Ground]
    }
}