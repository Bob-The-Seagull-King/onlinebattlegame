import { IDEntry, SelectedAction, TurnChoices } from "../../../../global_types";
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
    
    public SelectChoice(_options: TurnChoices): SelectedAction | null {
        try {
            const TypeCount = Object.keys(_options).length;
            if (TypeCount > 0) {
                const TypeRnmd = Math.floor(Math.random() * TypeCount);
                const ActionRnmd = Math.floor(Math.random() * _options[Object.keys(_options)[TypeRnmd]].length);

                return _options[Object.keys(_options)[TypeRnmd]][ActionRnmd]
            }
        } catch(e) {
            return null
        }
        return null
    }

}

export {TrainerBot, ITrainerBot}