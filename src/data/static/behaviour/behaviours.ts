import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBot } from "../../../classes/sim/controller/trainer/trainer_bot";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { ActionAction, BehaviourTable, BotBehaviourWeight, BotOptions } from "../../../global_types";
import { TypeMatchup } from "../../enum/types";
import { ActionBattleDex } from "../action/action_btl";
import { SpeciesBattleDex } from "../species/species_btl";

/**
 * Trainer Bot action selection behaviour database
 */
export const BehaviourDex : BehaviourTable = {
    basic : {
        id : 0,
        name : "Basic",
        description: [{cat: "generic", text: "General Purpose"}],
        async onGetBaseSWITCHChance(this : Battle, trainer : TrainerBot, relayVar : number) {
            return 500;
        },
        async onGetBaseITEMChance(this : Battle, trainer : TrainerBot, relayVar : number) {
            return 500;
        },
        async onGetBaseACTIONChance(this : Battle, trainer : TrainerBot, relayVar : number) {
            return 2000;
        },
        async onGetBaseMOVEChance(this : Battle, trainer : TrainerBot, relayVar : number) {
            return 1000;
        },
        async onGetBasePLACEChance(this : Battle, trainer : TrainerBot, relayVar : number) {
            return relayVar;
        }
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