import { SelectedAction, TurnChoices, TurnSelect } from "../../../../global_types";
import { RoomHold } from "../../../structure/room/RoomHold";
import { Team } from "../../models/team"

class ITrainer {
    team : Team
    pos  : number
    name : string
}

class TrainerBase {

    public Team : Team;
    public Position : number;
    public Name : string;

    constructor(_team : ITrainer) {
        this.Team = _team.team;
        this.Position = _team.pos;
        this.Name = _team.name;
    }
    
    public async SelectChoice(_options: TurnSelect, _room? : any) { return null; }

}

export {TrainerBase, ITrainer}