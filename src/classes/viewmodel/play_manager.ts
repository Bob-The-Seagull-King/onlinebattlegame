import { MonsterFactory } from "../sim/factories/monster_factory";
import { TeamFactory } from "../sim/factories/team_factory";
import { ActivePos, Team, ITeam } from "../sim/models/team";

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
            const TeamNew = TeamFactory.CreateTeam(team);
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
        const _Team : Team = TeamFactory.CreateNewTeam('TempTeam');

        _Team.AddFreshItem('blueherb')
        _Team.AddFreshItem('strongsoil')

        _Team.AddFreshMonster('marrowdread')
        _Team.Monsters[0].AddFreshAction('sparkup')
        _Team.Monsters[0].AddFreshAction('nausea')
        _Team.Monsters[0].AddFreshAction('braindrain')
        _Team.Monsters[0].AddFreshAction('stinger')
        _Team.Monsters[0].Traits.push('vampire')

        _Team.AddFreshMonster('humbood')
        _Team.Monsters[1].AddFreshAction('deeproots')
        _Team.Monsters[1].AddFreshAction('flytrap')
        _Team.Monsters[1].AddFreshAction('pressurecannon')
        _Team.Monsters[1].AddFreshAction('rockthrow')
        _Team.Monsters[1].Traits.push('firstdefense')

        _Team.AddFreshMonster('stalagmitendon')
        _Team.Monsters[2].AddFreshAction('superhotslam')
        _Team.Monsters[2].AddFreshAction('scatter')
        _Team.Monsters[2].AddFreshAction('rockthrow')
        _Team.Monsters[2].AddFreshAction('regrow')
        _Team.Monsters[2].Traits.push('solidcomposition')

        _Team.AddFreshMonster('impound')
        _Team.Monsters[3].AddFreshAction('harshthenoise')
        _Team.Monsters[3].AddFreshAction('flytrap')
        _Team.Monsters[3].AddFreshAction('mindread')
        _Team.Monsters[3].AddFreshAction('slam')
        _Team.Monsters[3].Traits.push('sacrificialaltar')

        _Team.AddFreshMonster('stratate')
        _Team.Monsters[4].AddFreshAction('stormwinds')
        _Team.Monsters[4].AddFreshAction('raindance')
        _Team.Monsters[4].AddFreshAction('blindinglight')
        _Team.Monsters[4].AddFreshAction('slam')
        _Team.Monsters[4].Traits.push('scaryface')

        _Team.Leads.push(new ActivePos(0,0,_Team));

        this.TeamList.push( _Team );
        
    }

    public TempAddTeam2() {
        const _Team : Team = TeamFactory.CreateNewTeam('TempTeam2');

        _Team.AddFreshItem('greenherb')
        _Team.AddFreshItem('saltyberry')
        _Team.AddFreshItem('sourberry')
        _Team.AddFreshItem('spicyberry')
        _Team.AddFreshItem('sweetberry')

        _Team.AddFreshMonster('ruckut')
        _Team.Monsters[0].AddFreshAction('pressurecannon')
        _Team.Monsters[0].AddFreshAction('wavecrash')
        _Team.Monsters[0].AddFreshAction('regrow')
        _Team.Monsters[0].AddFreshAction('slam')
        _Team.Monsters[0].Traits.push('retreat')

        _Team.AddFreshMonster('celebratious')
        _Team.Monsters[1].AddFreshAction('moonbeam')
        _Team.Monsters[1].AddFreshAction('dancinglights')
        _Team.Monsters[1].AddFreshAction('sparkup')
        _Team.Monsters[1].AddFreshAction('stinger')
        _Team.Monsters[1].Traits.push('hotfeet')

        _Team.AddFreshMonster('stalagmitendon')
        _Team.Monsters[2].AddFreshAction('superhotslam')
        _Team.Monsters[2].AddFreshAction('scatter')
        _Team.Monsters[2].AddFreshAction('rockthrow')
        _Team.Monsters[2].AddFreshAction('regrow')
        _Team.Monsters[2].Traits.push('solidcomposition')

        _Team.AddFreshMonster('impound')
        _Team.Monsters[3].AddFreshAction('harshthenoise')
        _Team.Monsters[3].AddFreshAction('flytrap')
        _Team.Monsters[3].AddFreshAction('mindread')
        _Team.Monsters[3].AddFreshAction('slam')
        _Team.Monsters[3].Traits.push('sacrificialaltar')

        _Team.AddFreshMonster('stratate')
        _Team.Monsters[4].AddFreshAction('stormwinds')
        _Team.Monsters[4].AddFreshAction('raindance')
        _Team.Monsters[4].AddFreshAction('blindinglight')
        _Team.Monsters[4].AddFreshAction('slam')
        _Team.Monsters[4].Traits.push('scaryface')

        _Team.Leads.push(new ActivePos(0,0,_Team));

        this.TeamList.push( _Team );
        
    }

}

export {PlayManager, IPlayManager};