import { IDEntry, SelectedAction, SubSelectAction, TurnChoices, TurnSelect } from "../../../../global_types";
import { ITrainer, TrainerBase } from "./trainer_basic";

class ITrainerBot extends ITrainer {
    behaviour: IDEntry[]
}

class TrainerBot extends TrainerBase {

    public Behaviour : IDEntry[]

    constructor(_team : ITrainerBot) {
        super(_team)
        this.Behaviour = _team.behaviour;
    }
    
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