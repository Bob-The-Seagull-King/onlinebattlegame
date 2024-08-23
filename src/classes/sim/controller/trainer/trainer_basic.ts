import { SelectedAction, TurnChoices } from "../../../../global_types";
import { RoomHold } from "../../../structure/room/RoomHold";
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
    
    public async SelectChoice(_options: TurnChoices, _room? : any) { return null; }

}

export {TrainerBase, ITrainer}