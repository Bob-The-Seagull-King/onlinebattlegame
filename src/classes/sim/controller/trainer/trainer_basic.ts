import { SelectedAction, TurnChoices } from "../../../../global_types";
import { Team } from "../../models/team"

class ITrainer {
    team : Team
}

class TrainerBase {

    public Team : Team;

    constructor(_team : ITrainer) {
        this.Team = _team.team;
    }
    
    public SelectChoice(_options: TurnChoices): SelectedAction | null { return null; }

}

export {TrainerBase, ITrainer}