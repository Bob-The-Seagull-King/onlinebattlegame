import { BotBehaviourWeight, BotOptions, IDEntry, SelectedAction, TurnChoices, TurnSelect, TurnSelectReturn } from "../../../../global_types";
import { BattleSide } from "../../models/battle_side";
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
    constructor(_trainer : ITrainerBot, _owner : BattleSide) {
        super(_trainer, _owner)
        this.Behaviour = _trainer.behaviour;
    }
    
    /**
     * Given an array of possible options for a trainer to take (per active monster)
     * run behaviour events to determine the options that will be selected and return it.
     * @param _options The possible options a trainer can take this turn
     * @returns Returns a SelectedAction object describing what action(s) the trainer takes this turn
     */
    public async SelectChoice(_options: TurnSelect, _room : any, _battle : Battle) {
        let ReturnedAction : TurnSelectReturn = { actiontype: "NONE", itemIndex: 0 }

        return ReturnedAction
    }

    /**
     * Given a suite of choices, create an array of options
     * with the default weights (based on the type of action).
     * @param _choices the choices for the bot to select from
     * @param _battle the battle the bot it a part of
     * @returns array of weighted options (BotOptions)
     */
    public ConvertToWeightedArray(_choices : TurnSelect, _battle : Battle) {
        const _botoptions : BotOptions = [];

        Object.keys(_choices).forEach(_key => {
            _choices[_key].forEach(item => {
                let BaseMod = 1000;
                /*BaseMod = _battle.runBehaviour('GetBase'+_key+"Chance", this, null, null, BaseMod);*/
                _botoptions.push({action: item, weight: BaseMod})
            })
        })

        return _botoptions;
    }

    /**
     * Given a choice representing a SubSelectAction,
     * create an array of weighted options for each sub option.
     * @param _choices the sub options to give weights to
     * @param _base the action these options are a part of
     * @param _battle the battle the bot is a part of
     * @returns array of weighted options (BotOptions)
     */
    public ConvertSubOptionsToWeightedArray(_choices : SelectedAction[], _base : BotBehaviourWeight, _battle : Battle) {
        const _botoptions : BotOptions = [];

        _choices.forEach(item => {
            let BaseMod = _base.weight / _choices.length
            const newOption : BotBehaviourWeight = { action : item, weight : BaseMod }
            /*newOption.weight = _battle.runBehaviour('ModifySub'+_base.action.type+"Chance", this, null, newOption, BaseMod);*/
            _botoptions.push(newOption)
        })

        return _botoptions;
    }

    /**
     * Given an array of actions with specific weights,
     * randomly choose from the array - with higher priority
     * given to options with higher weight.
     * @param options the options to choose from
     * @param _battle the battle this bot is a part of
     * @returns the final BotOption being selected
     */
    public SelectedMoveWeighted(options : BotOptions, _battle : Battle) {
        const culledOptions = options //_battle.runBehaviour('CullOptions', this, options, null, options);
        const totalWeight = culledOptions.reduce((sum, culledOptions) => sum + culledOptions.weight, 0);

        // Generate a random number between 0 and totalWeight
        const randomWeight = Math.random() * totalWeight;

        // Iterate over the items to find the one that corresponds to the random weight
        let cumulativeWeight = 0;
        for (const item of culledOptions) {
            cumulativeWeight += item.weight;
            if (randomWeight < cumulativeWeight) {
                return item;
            }
        }

        // Emergency return
        const noneoption : BotBehaviourWeight = {action: {type: "NONE"}, weight: 1}
        return noneoption
    }

}

export {TrainerBot, ITrainerBot}