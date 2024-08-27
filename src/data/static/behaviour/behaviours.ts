import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBot } from "../../../classes/sim/controller/trainer/trainer_bot";
import { BehaviourTable, BotOptions } from "../../../global_types";

/**
 * Trainer Bot action selection behaviour database
 */
export const BehaviourDex : BehaviourTable = {
    random : {
        id : 0,
        name : "Random",
        description: [{cat: "generic", text: "Randomly Select Moves"}]
    }
}