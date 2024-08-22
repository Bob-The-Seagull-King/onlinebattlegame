import { SelectedAction, TurnChoices } from "../../../../global_types";
import { Team } from "../../models/team"

class ITrainer {
    team : Team
    pos  : number
}

class TrainerBase {

    public Team : Team;
    public Position : number;

    constructor(_team : ITrainer) {
        this.Team = _team.team;
        this.Position = _team.pos;
    }
    
    public async SelectChoice(_options: TurnChoices) { return null; }

}

export {TrainerBase, ITrainer}