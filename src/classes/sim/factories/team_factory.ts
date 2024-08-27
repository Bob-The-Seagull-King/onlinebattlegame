import { ITeam, Team } from "../models/team";

class TeamFactory {

    /**
     * Return a Team object from the Interface equivilent
     * @param _team the Team interface
     * @returns a new Team object
     */
    public static CreateTeam(_team : ITeam) {
        const newTeam = new Team(_team);
        return newTeam;
    }

    /**
     * Generate an empty Team
     * @returns a new Team object
     */
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