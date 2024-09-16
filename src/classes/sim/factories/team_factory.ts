import { TrainerBase } from "../controller/trainer/trainer_basic";
import { BattleSide } from "../models/battle_side";
import { ITeam, Team } from "../models/team";

class TeamFactory {

    /**
     * Return a Team object from the Interface equivilent
     * @param _team the Team interface
     * @returns a new Team object
     */
    public static CreateTeam(_team : ITeam, _owner : TrainerBase) {
        const newTeam = new Team(_team, _owner);
        return newTeam;
    }

    /**
     * Generate an empty Team
     * @returns a new Team object
     */
    public static CreateNewTeam(_name : string, _owner : TrainerBase) {
        const freshTeam : ITeam = {
            name: _name, 
            items: [],
            monsters: [],
            active: []
        }
        return TeamFactory.CreateTeam(freshTeam, _owner);
    }

}

export {TeamFactory}