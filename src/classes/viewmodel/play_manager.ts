import { MonsterFactory } from "../sim/factories/monster_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { FieldedMonster, Team, ITeam, IFieldedMonster } from "../sim/models/team";

interface IPlayManager {
    username    : string
    teamlist    : ITeam[]
    teamcurr    : number
}

class PlayManager {

    UserName : string;
    TeamList : Team[];
    TeamCurr : number;

    constructor(_data : IPlayManager) {
        this.TeamList = [];
        _data.teamlist.forEach(team => {
            const TeamNew = TeamFactory.CreateTeam(team, null);
            this.TeamList.push(TeamNew);
        });

        this.UserName = _data.username
        this.TeamCurr = _data.teamcurr;
    }

    public ConvertToInterface() {
        
        const _teams : ITeam[] = []
        this.TeamList.forEach(item => {
            _teams.push(item.ConvertToInterface())
        })
            
        const _interface : IPlayManager = {
            username: this.UserName,
            teamcurr: this.TeamCurr,
            teamlist: _teams
        }
        
        return _interface;
    }

    public TempAddTeam() {
        const _Team : Team = TeamFactory.CreateNewTeam('TempTeam', null);

        this.TeamList.push( _Team );
        
    }

    public TempAddTeam2() {
        const _Team : Team = TeamFactory.CreateNewTeam('TempTeam2', null);

        this.TeamList.push( _Team );
        
    }

}

export {PlayManager, IPlayManager};