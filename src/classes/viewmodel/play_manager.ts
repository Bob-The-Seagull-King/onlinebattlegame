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

        _Team.Monsters.push(MonsterFactory.CreateNewMonster("bruiser"))
        _Team.Monsters[0].AddFreshAction("slam");
        _Team.Monsters[0].AddFreshAction("tackle");
        _Team.Monsters[0].AddFreshAction("getpumped");
        _Team.Monsters[0].AddFreshAction("harshthenoise");
        _Team.Monsters[0].Traits.push("harshlife");

        _Team.Monsters.push(MonsterFactory.CreateNewMonster("arcana"))
        _Team.Monsters[1].AddFreshAction("windbreaker");
        _Team.Monsters[1].AddFreshAction("tackle");
        _Team.Monsters[1].AddFreshAction("scatter");
        _Team.Monsters[1].AddFreshAction("harshthenoise");
        _Team.Monsters[1].Traits.push("vampire");

        _Team.Monsters.push(MonsterFactory.CreateNewMonster("nimble"))
        _Team.Monsters[2].AddFreshAction("windbreaker");
        _Team.Monsters[2].AddFreshAction("getpumped");
        _Team.Monsters[2].AddFreshAction("scatter");
        _Team.Monsters[2].AddFreshAction("tackle");
        _Team.Monsters[2].Traits.push("retaliation");

        _Team.Monsters.push(MonsterFactory.CreateNewMonster("cleric"))
        _Team.Monsters[3].AddFreshAction("harshthenoise");
        _Team.Monsters[3].AddFreshAction("regrow");
        _Team.Monsters[3].AddFreshAction("scatter");
        _Team.Monsters[3].AddFreshAction("slam");
        _Team.Monsters[3].Traits.push("clearbody");

        _Team.Leads.push(new ActivePos(0, 0, _Team))

        _Team.AddFreshItem("herb");
        _Team.AddFreshItem("sharpstones");

        this.TeamList.push( _Team );
        
    }
    private TempAddTeam2() {
        const _Team : Team = TeamFactory.CreateNewTeam();

        _Team.Monsters.push(MonsterFactory.CreateNewMonster("bruiser"))
        _Team.Monsters[0].AddFreshAction("slam");
        _Team.Monsters[0].AddFreshAction("tackle");
        _Team.Monsters[0].AddFreshAction("getpumped");
        _Team.Monsters[0].AddFreshAction("harshthenoise");
        _Team.Monsters[0].Traits.push("harshlife");

        _Team.Monsters.push(MonsterFactory.CreateNewMonster("cleric"))
        _Team.Monsters[1].AddFreshAction("harshthenoise");
        _Team.Monsters[1].AddFreshAction("regrow");
        _Team.Monsters[1].AddFreshAction("scatter");
        _Team.Monsters[1].AddFreshAction("slam");
        _Team.Monsters[1].Traits.push("clearbody");

        _Team.Leads.push(new ActivePos(0, 0, _Team))

        _Team.AddFreshItem("herb");
        _Team.AddFreshItem("sharpstones");

        this.TeamList.push( _Team );
        
    }

}

export {PlayManager};