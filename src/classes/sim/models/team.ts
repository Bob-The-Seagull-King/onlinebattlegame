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
    monster : IActiveMonster,
    position : number
}

class ActivePos {
    public Monster : ActiveMonster;
    public Position : number;

    constructor(_mon : ActiveMonster, _pos : number) {
        this.Monster = _mon;
        this.Position = _pos;
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

    private MonsterGenerator(_monsters : IActiveMonster[], _leads : IActivePos[]) {
        let i = 0;
        for (i = 0; i < _monsters.length ; i++) {
            const MonGen : ActiveMonster = MonsterFactory.CreateMonster(_monsters[i]);
            this.Monsters.push(MonGen);
            let j = 0;
            for (j = 0; j < _leads.length; j++) {
                if (_leads[j].monster === _monsters[i]) {
                    this.Leads.push(new ActivePos(MonGen, _leads[j].position));
                    break;
                }
            }
        }
    }

    public IsAlive() {
        let LivingCount = 0
        this.Monsters.forEach(item => {
            if (item.HP_Current > 0) {
                LivingCount += 1;
            }
        })
        return (LivingCount > 0);
    }

}

export {Team, ITeam, ActivePos}