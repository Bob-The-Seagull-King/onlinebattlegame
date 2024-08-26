import { IDEntry } from "../../../global_types";
import { ItemFactory } from "../factories/item_factory";
import { MonsterFactory } from "../factories/monster_factory";
import { ActiveItem, IActiveItem } from "./active_item"
import { ActiveMonster, IActiveMonster } from "./active_monster"

interface ITeam {
    items       : IActiveItem[],
    monsters    : IActiveMonster[],
    active      : IActivePos[]
}

interface IActivePos {
    position : number,
    teampos  : number
}

class ActivePos {
    public Monster : ActiveMonster;
    public Position : number;
    public TeamPosition : number;

    constructor(_pos : number, _teampos: number, _team : Team) {
        this.Monster = _team.Monsters[_teampos];
        this.Position = _pos;
        this.TeamPosition = _teampos;
    }

    public ConvertToInterface() {
        const _interface : IActivePos = {
            position: this.Position,
            teampos: this.TeamPosition
        }
        return _interface;
    }
}

class Team {

    public Items    : ActiveItem[];
    public Monsters : ActiveMonster[];
    public Leads    : ActivePos[];

    constructor(_data : ITeam) {
        this.Items = this.ItemGenerator(_data.items);
        this.Monsters = [];
        this.Leads = [];
        this.MonsterGenerator(_data.monsters, _data.active)
    }

    private ItemGenerator(_items : IActiveItem[]) {
        const ItemList : ActiveItem[] = [];
        let i = 0;
        for (i = 0; i < _items.length; i++) {
            ItemList.push(ItemFactory.CreateItem(_items[i]))
        }
        return ItemList;
    }

    public AddFreshItem(_item : IDEntry) {
        const NewItem = ItemFactory.CreateNewAction(_item);
        this.Items.push(NewItem)
    }

    private MonsterGenerator(_monsters : IActiveMonster[], _leads : IActivePos[]) {
        let i = 0;
        for (i = 0; i < _monsters.length ; i++) {
            const MonGen : ActiveMonster = MonsterFactory.CreateMonster(_monsters[i]);
            this.Monsters.push(MonGen);
            _leads.forEach(item => {
                if (item.teampos === i) {
                    this.Leads.push(new ActivePos(i, item.position, this));
                }
            })
        }
    }

    public AddFreshMonster(_monster : IDEntry) {
        const NewMonster = MonsterFactory.CreateNewMonster(_monster);
        this.Monsters.push(NewMonster)
    }

    public ConvertToInterface() {
        const _items : IActiveItem[] = []
        const _monsters : IActiveMonster[] = []
        const _leads : IActivePos[] = []
        this.Items.forEach(item => {
            _items.push(item.ConvertToInterface())
        })
        this.Monsters.forEach(item => {
            _monsters.push(item.ConvertToInterface())
        })
        this.Leads.forEach(item => {
            _leads.push(item.ConvertToInterface())
        })
            
        const _interface : ITeam = {
            items       : _items,
            monsters    : _monsters,
            active      : _leads
        }
        return _interface;
    }

}

export {Team, ITeam, ActivePos}