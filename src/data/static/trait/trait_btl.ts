import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { Side } from "../../../classes/sim/models/terrain/terrain_side";
import { MessageSet, TraitBattleTable } from "../../../global_types";
import { TraitCategory } from "../../enum/categories";

/**
 * Trait mechanical information database
 */
export const TraitBattleDex : TraitBattleTable = {
    clearbody : {
        id          : 0,
        cost        : 10,
        category    : [TraitCategory.Restoration]
    },
    harshlife : {
        id          : 1,
        cost        : 10,
        category    : [TraitCategory.Armour],
        onGetFinalDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster, source : TrainerBase, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (relayVar === 1) {
                messageList.push({ "generic" : target.Nickname + " shrugged off the damage!"})
                return 0;
            } else {
                return relayVar;
            }
        }
    },
    retaliation : {
        id          : 2,
        cost        : 15,
        category    : [TraitCategory.Revenge]
    },
    vampire : {
        id          : 3,
        cost        : 20,
        category    : [TraitCategory.Drain]
    }
}