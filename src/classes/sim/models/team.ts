import { ItemFactory } from "../factories/item_factory";
import { MonsterFactory } from "../factories/monster_factory";
import { ActiveItem, IActiveItem } from "./active_item"
import { ActiveMonster, IActiveMonster } from "./active_monster"

interface ITeam {
    items       : IActiveItem[],
    monsters    : IActiveMonster[],
    active      : IActiveMonster[]
}

class Team {

    public Items    : ActiveItem[];
    public Monsters : ActiveMonster[];
    public Leads    : ActiveMonster[];

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

    private MonsterGenerator(_monsters : IActiveMonster[], _leads : IActiveMonster[]) {
        let i = 0;
        for (i = 0; i < _monsters.length ; i++) {
            const MonGen : ActiveMonster = MonsterFactory.CreateMonster(_monsters[i]);
            this.Monsters.push(MonGen);
            if (_leads.includes(_monsters[i])) {
                this.Leads.push(MonGen);
            }
        }
    }

}

export {Team, ITeam}