import { IDEntry } from "../../../global_types";
import { ITeam, Team } from "../models/team";

class TeamFactory {

    public static CreateTeam(_team : ITeam) {
        const newTeam = new Team(_team);
        return newTeam;
    }

    public static CreateNewTeam() {
        const freshTeam : ITeam = {
            items: [],
            monsters: [],
            active: []
        }
        return TeamFactory.CreateTeam(freshTeam);
    }

}

export {TeamFactory}