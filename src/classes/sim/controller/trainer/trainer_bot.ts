import { BotBehaviourWeight, BotOptions, IDEntry, SelectedAction, SubSelectAction, TurnChoices, TurnSelect } from "../../../../global_types";
import { Battle } from "../battle";
import { ITrainer, TrainerBase } from "./trainer_basic";

/**
 * Interface of non-human trainers
 */
class ITrainerBot extends ITrainer {
    behaviour: IDEntry[] // Array of IDs for the behaviour a trainer will use to select actions
}

class TrainerBot extends TrainerBase {

    public Behaviour : IDEntry[] // Array of IDs for the behaviour a trainer will use to select actions

    /**
     * Simple constructor
     * @param _trainer The interface representing the trainer
     */
    constructor(_trainer : ITrainerBot) {
        super(_trainer)
        this.Behaviour = _trainer.behaviour;
    }
    
    /**
     * Given an array of possible options for a trainer to take (per active monster)
     * run behaviour events to determine the options that will be selected and return it.
     * @param _options The possible options a trainer can take this turn
     * @returns Returns a SelectedAction object describing what action(s) the trainer takes this turn
     */
    public async SelectChoice(_options: TurnSelect, _room : any, _battle : Battle) {
        const _weightedoptions = this.ConvertToWeightedArray(_options.Choices, _battle);
        
        _weightedoptions.forEach(item =>{
            item.weight = _battle.runBehaviour("Modify" + item.action.type + "Chance", this, _weightedoptions, item, item.weight)
        })
        
        const chosenOption = this.SelectedMoveWeighted(_weightedoptions)

        if ((chosenOption.action.type === "SWITCH") ||
            (chosenOption.action.type === "ITEM") ||
            (chosenOption.action.type === "ACTION")) {

            const _weightedsuboptions = this.ConvertSubOptionsToWeightedArray((chosenOption.action as SubSelectAction).options, chosenOption, _battle)
                        
            const chosenSubOption = this.SelectedMoveWeighted(_weightedsuboptions);
            return chosenSubOption.action
        }

        return {type : "NONE", trainer : this}
    }

    public ConvertToWeightedArray(_choices : TurnChoices, _battle : Battle) {
        const _botoptions : BotOptions = [];

        Object.keys(_choices).forEach(_key => {
            _choices[_key].forEach(item => {
                let BaseMod = 1000;
                BaseMod = _battle.runBehaviour('GetBase'+_key+"Chance", this, null, null, BaseMod);
                _botoptions.push({action: item, weight: BaseMod})
            })
        })

        return _botoptions;
    }

    public ConvertSubOptionsToWeightedArray(_choices : SelectedAction[], _base : BotBehaviourWeight, _battle : Battle) {
        const _botoptions : BotOptions = [];

        _choices.forEach(item => {
            let BaseMod = _base.weight / _choices.length
            const newOption : BotBehaviourWeight = { action : item, weight : BaseMod }
            newOption.weight = _battle.runBehaviour('ModifySub'+_base.action.type+"Chance", this, null, newOption, BaseMod);
            _botoptions.push(newOption)
        })

        return _botoptions;
    }

    public SelectedMoveWeighted(options : BotOptions) {
        const totalWeight = options.reduce((sum, item) => sum + item.weight, 0);

            // Generate a random number between 0 and totalWeight
            const randomWeight = Math.random() * totalWeight;

            // Iterate over the items to find the one that corresponds to the random weight
            let cumulativeWeight = 0;
            for (const item of options) {
                cumulativeWeight += item.weight;
                if (randomWeight < cumulativeWeight) {
                    return item;
                }
            }

            // Emergency return
            const noneoption : BotBehaviourWeight = {action: {type: "NONE", trainer: this}, weight: 1}
            return noneoption
    }

}

export {TrainerBot, ITrainerBot}