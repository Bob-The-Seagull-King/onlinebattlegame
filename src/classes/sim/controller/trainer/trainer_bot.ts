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
        return null;
    }

}

export {TrainerBot, ITrainerBot}