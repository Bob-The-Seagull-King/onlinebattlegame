import { IDEntry, SelectedAction, SubSelectAction, TurnSelect } from "../../../../global_types";
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
    public async SelectChoice(_options: TurnSelect) {
        try {
            const TypeCount = Object.keys(_options.Choices).length;
            if (TypeCount > 0) {
                const TypeRnmd = Math.floor(Math.random() * TypeCount);
                const ActionRnmd = Math.floor(Math.random() * _options.Choices[Object.keys(_options.Choices)[TypeRnmd]].length);
                
                const chosenAction : SelectedAction = _options.Choices[Object.keys(_options.Choices)[TypeRnmd]][ActionRnmd]
                if ((chosenAction as SubSelectAction).options) {
                    const OptionRndm = Math.floor(Math.random() * (chosenAction as SubSelectAction).options.length);
                    return (chosenAction as SubSelectAction).options[OptionRndm]
                } else {
                    return chosenAction;
                }
            }
        } catch(e) {
            return {type : "NONE", trainer : this}
        }
        return {type : "NONE", trainer : this}
    }

}

export {TrainerBot, ITrainerBot}