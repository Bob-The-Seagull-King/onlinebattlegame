import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBot } from "../../../classes/sim/controller/trainer/trainer_bot";
import { ActivePos } from "../../../classes/sim/models/team";
import { ActionAction, BehaviourTable, BotBehaviourWeight, BotOptions, SubSelectAction, SwitchAction } from "../../../global_types";
import { TypeMatchup } from "../../enum/types";
import { ActionBattleDex } from "../action/action_btl";
import { SpeciesBattleDex } from "../species/species_btl";

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
    },
    richkid : {
        id : 2,
        name : "Rich Kid",
        description: [{cat: "generic", text: "More likely to use ITEMs"}],
        onGetBaseITEMChance(this : Battle, trainer : TrainerBot, relay : number) {
            return Math.floor(relay * 1.5);
        },
    },
    switchsmart : {
        id : 3,
        name : "Switch Smart",
        description: [{cat: "generic", text: "When switching, will try and find a good offensive matchup"}],
        onModifySubSWITCHChance(this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) {
            const Action = optionSpecific.action as SwitchAction;
            let SwitchMod = optionSpecific.weight

            Action.newmon.Actions_Current.forEach(action => {
                this.Trainers.filter(item => item != trainer).forEach(checktrainer => {
                    checktrainer.Team.Leads.forEach(lead => {
                        let TypeMatch = 0;
                        SpeciesBattleDex[lead.Monster.GetSpecies()].type.forEach(type => {
                            const Matchup = (TypeMatchup[ActionBattleDex[action.Action].type][type])
                            if (Matchup === 1) { TypeMatch += 1; }
                            if (Matchup === 2) { TypeMatch -= 1; }
                            if (Matchup === 3) { TypeMatch -= 5; }
                        })
                        SwitchMod += TypeMatch * 50
                    })
                })
            })

            return SwitchMod;
        }
    },
    switchwary : {
        id : 4,
        name : "Switch Wary",
        description: [{cat: "generic", text: "When switching, will try and find a good defensive matchup"}],
        onModifySubSWITCHChance(this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) {
            const Action = optionSpecific.action as SwitchAction;
            let SwitchMod = optionSpecific.weight

            SpeciesBattleDex[Action.newmon.GetSpecies()].type.forEach(action => {
                this.Trainers.filter(item => item != trainer).forEach(checktrainer => {
                    checktrainer.Team.Leads.forEach(lead => {
                        let TypeMatch = 0;
                        SpeciesBattleDex[lead.Monster.GetSpecies()].type.forEach(type => {
                            const Matchup = (TypeMatchup[type][ActionBattleDex[action].type])
                            if (Matchup === 1) { TypeMatch -= 1; }
                            if (Matchup === 2) { TypeMatch += 1; }
                            if (Matchup === 3) { TypeMatch += 5; }
                        })
                        SwitchMod += TypeMatch * 50
                    })
                })
            })

            return SwitchMod;
        }
    },
    typewary : {
        id : 4,
        name : "Type Wary",
        description: [{cat: "generic", text: "Will be more likely to SWITCH if they're in a bad matchup"}],
        onModifySWITCHChance(this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) {
            const Action = optionSpecific.action as SubSelectAction;
            let SwitchMod = optionSpecific.weight

            SpeciesBattleDex[(Action.choice as ActivePos).Monster.GetSpecies()].type.forEach(action => {
                this.Trainers.filter(item => item != trainer).forEach(checktrainer => {
                    checktrainer.Team.Leads.forEach(lead => {
                        let TypeMatch = 0;
                        SpeciesBattleDex[lead.Monster.GetSpecies()].type.forEach(type => {
                            const Matchup = (TypeMatchup[type][ActionBattleDex[action].type])
                            if (Matchup === 1) { TypeMatch += 1; }
                            if (Matchup === 2) { TypeMatch -= 1; }
                            if (Matchup === 3) { TypeMatch -= 5; }
                        })
                        SwitchMod += TypeMatch * 50
                    })
                })
            })

            return SwitchMod;
        }
    },
    typesmart : {
        id : 5,
        name : "Type Smart",
        description: [{cat: "generic", text: "Will be more likely to use super effective moves"}],
        onModifySubACTIONChance(this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) {
            const Action = optionSpecific.action as ActionAction;
            let ActionMod = optionSpecific.weight

            this.Trainers.filter(item => item != trainer).forEach(checktrainer => {
                checktrainer.Team.Leads.forEach(lead => {
                    let TypeMatch = 0;
                    SpeciesBattleDex[lead.Monster.GetSpecies()].type.forEach(type => {
                        const Matchup = (TypeMatchup[ActionBattleDex[Action.action.Action].type][type])
                        if (Matchup === 1) { TypeMatch += 1; }
                        if (Matchup === 2) { TypeMatch -= 1; }
                        if (Matchup === 3) { TypeMatch -= 5; }
                    })
                    ActionMod += TypeMatch * 50
                })
            })

            return ActionMod;
        }
    }
}