import { SpeciesBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

export const SpeciesBattleDex : SpeciesBattleTable = {
    temp : {
        id      : 0,
        type    : [MonsterType.None],
        stats   : { hp : 20, dm : [2,4], ac: 10, pt: 10, sk : 10, rs : 10, sp: 5 },
        cost    : 50
    }
}