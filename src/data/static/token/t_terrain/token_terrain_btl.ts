import { Battle } from "../../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../../classes/sim/controller/trainer/trainer_basic";
import { ActivePos } from "../../../../classes/sim/models/team";
import { Plot } from "../../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../../classes/sim/models/terrain/terrain_scene";
import { Side } from "../../../../classes/sim/models/terrain/terrain_side";
import { MessageSet, TokenBattleTable } from "../../../../global_types";
import { TokenCategory } from "../../../enum/categories";
import { MonsterType } from "../../../enum/types";

/**
 * Terrain Token mechanical information database
 */
export const TokenTerrainBattleDex : TokenBattleTable = {
    pointed : {
        id          : 0,
        category    : [TokenCategory.Harsh,TokenCategory.Ground],
        onSwitchIn(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                messageList.push({ "generic" : "Pointed Stones hurt " + source.Monster.Nickname})
                const DamageVal = Math.floor(this.Events.GetStatValue(trainer, source.Monster, 'hp') * 0.125)
                this.Events.DealDamage(DamageVal, MonsterType.None, eventSource, source.Monster, null, trainer, messageList, true, false, false)
            }
        }
    }
}