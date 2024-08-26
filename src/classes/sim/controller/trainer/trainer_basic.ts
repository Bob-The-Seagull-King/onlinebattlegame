import { SelectedAction, TurnChoices, TurnSelect } from "../../../../global_types";
import { RoomHold } from "../../../structure/room/RoomHold";
import { TeamFactory } from "../../factories/team_factory";
import { Team, ITeam } from "../../models/team"

class ITrainer {
    team : ITeam
    pos  : number
    name : string
}
class TrainerBase {

    public Team : Team;
    public Position : number;
    public Name : string;

    constructor(_team : ITrainer) {
        this.Team = TeamFactory.CreateTeam(_team.team);
        this.Position = _team.pos;
        this.Name = _team.name;
    }
    
    public async SelectChoice(_options: TurnSelect, _room? : any) { return null; }

    public ConvertToInterface() {
        const _interface : ITrainer = {
            team : this.Team.ConvertToInterface(),
            pos  : this.Position,
            name : this.Name
        }
        return _interface;
    }

}

export {TrainerBase, ITrainer}