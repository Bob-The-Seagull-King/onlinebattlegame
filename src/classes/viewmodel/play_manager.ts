import { MonsterFactory } from "../sim/factories/monster_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { ActivePos, Team } from "../sim/models/team";

class PlayManager {

    UserName : string;
    TeamList : Team[];
    TeamCurr : number;

    constructor() {
        this.TeamList = [];
        this.UserName = "PLACEHOLDER"
        this.TeamCurr = 0;

        this.TempAddTeam()
        this.TempAddTeam2()
    }

    private TempAddTeam() {
        const _Team : Team = TeamFactory.CreateNewTeam();

        this.TeamList.push( _Team );
        
    }
    private TempAddTeam2() {
        const _Team : Team = TeamFactory.CreateNewTeam();

        this.TeamList.push( _Team );
        
    }

}

export {PlayManager};