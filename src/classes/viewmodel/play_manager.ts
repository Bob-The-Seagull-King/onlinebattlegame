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
    }

    private TempAddTeam() {
        const _Team : Team = TeamFactory.CreateNewTeam();

        _Team.AddFreshItem('blueherb')
        _Team.AddFreshItem('greenherb')
        _Team.AddFreshItem('savouryberry')
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
        _Team.Monsters[2].Traits.push('rockycomposition')

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

export {PlayManager};