import { SpeciesBattleTable } from "../../../global_types";
import { MonsterType } from "../../enum/types";

export const SpeciesBattleDex : SpeciesBattleTable = {
    larvin : {
        id      : 0,
        type    : [MonsterType.Pelagic, MonsterType.Tempest],
        stats   : { hp : 20, dm : [2,4], ac: 5, pt: 0, sk : 35, rs : 10, sp: 10 },
        cost    : 50
    }
}