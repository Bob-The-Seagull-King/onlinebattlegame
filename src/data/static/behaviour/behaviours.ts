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
        description: [{cat: "generic", text: "Much less likely to SWITCH or use an ITEM"}],
        onGetBaseSWITCHChance(this : Battle, trainer : TrainerBot, relay : number) {
            return Math.floor(relay * 0.25);
        },
        onGetBaseITEMChance(this : Battle, trainer : TrainerBot, relay : number) {
            return Math.floor(relay * 0.25);
        },
    },
    predictable : {
        id : 2,
        name : "Predictable",
        description: [{cat: "generic", text: "Will only choose from the best possible options"}],
        onCullOptions(this : Battle, trainer : TrainerBot, options: BotOptions) {
            let MaxVal = 0;
            options.forEach(item => {
                if (item.weight > MaxVal) {
                    MaxVal = item.weight
                }
            })

            options = options.filter(item => item.weight >= MaxVal);
            
            return options
        }
    }
}