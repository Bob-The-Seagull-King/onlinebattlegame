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
    },
    aggressive : {
        id : 1,
        name : "Aggresive",
        description: [{cat: "generic", text: "Much less likely to SWITCH or use an ITEM"}]
    },
    predictable : {
        id : 2,
        name : "Predictable",
        description: [{cat: "generic", text: "Will only choose from the best possible options"}]
    }
}