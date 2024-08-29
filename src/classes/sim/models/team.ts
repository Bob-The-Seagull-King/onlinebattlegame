import { IDEntry, SwitchAction } from "../../../global_types";
import { ItemFactory } from "../factories/item_factory";
import { MonsterFactory } from "../factories/monster_factory";
import { ActiveItem, IActiveItem } from "./active_item"
import { ActiveMonster, IActiveMonster } from "./active_monster"

/**
 * Interface of the Team object
 */
interface ITeam {
    items       : IActiveItem[],    // Items held by the team
    monsters    : IActiveMonster[], // All monsters that are part of this team
    active      : IActivePos[]      // Monsters that are currently 'in play' and on the field
}

/**
 * Interface of the active monster's location
 */
interface IActivePos {
    position : number,  // The position a monster has on their side of the field
    teampos  : number   // The index the monster has in their trainer's team
}

class ActivePos {

    public Monster      : ActiveMonster;    // The monster currently active on the field
    public Position     : number;           // The position a monster has on their side of the field
    public TeamPosition : number;           // The index the monster has in their trainer's team

    /**
     * Simple constructor
     * @param _data The interface representing the active monster's position
     */
    constructor(_pos : number, _teampos: number, _team : Team) {
        this.Monster = _team.Monsters[_teampos];
        this.Position = _pos;
        this.TeamPosition = _teampos;
    }

    public SwapMon(_action : SwitchAction, _team : Team) {
        this.TeamPosition = _action.trainer.Team.Monsters.indexOf(_action.newmon)
        this.Monster = _team.Monsters[this.TeamPosition];
    }

    /**
     * Given an ActivePos object, give us the IActivePos
     * @returns the IActivePos reflecting this active monster
     */
    public ConvertToInterface() {
        const _interface : IActivePos = {
            position: this.Position,
            teampos: this.TeamPosition
        }
        return _interface;
    }
}

class Team {

    public Items    : ActiveItem[];     // All items in the team
    public Monsters : ActiveMonster[];  // All monsters within this team
    public Leads    : ActivePos[];      // Currently 'in play' monsters

    /**
     * Simple constructor
     * @param _data The interface representing the team
     */
    constructor(_data : ITeam) {
        this.Items = this.ItemGenerator(_data.items);
        this.Monsters = [];
        this.Leads = [];
        this.MonsterGenerator(_data.monsters)
        this.LeadGenerator(_data.active)
    }

    /**
     * Converts the IActiveItems to usable ActiveItem
     * objects.
     * @param _items List of items to recreate
     * @returns Array of ActiveItem objects
     */
    private ItemGenerator(_items : IActiveItem[]) {
        const ItemList : ActiveItem[] = [];
        let i = 0;
        for (i = 0; i < _items.length; i++) {
            ItemList.push(ItemFactory.CreateItem(_items[i]))
        }
        return ItemList;
    }

    /**
     * Pushes a new item to the team based on an ID.
     * @param _item The ID/name of the item to add
     */
    public AddFreshItem(_item : IDEntry) {
        const NewItem = ItemFactory.CreateNewAction(_item);
        this.Items.push(NewItem)
    }

    /**
     * Converts the IActiveMonsters to usable ActiveMonsters
     * objects.
     * @param _monsters List of monsters to recreate
     * @param _leads List of 'in play' monsters, used to decide which monsters are pushed to the teams Leads array
     */
    private MonsterGenerator(_monsters : IActiveMonster[]) {
        let i = 0;
        for (i = 0; i < _monsters.length ; i++) {
            const MonGen : ActiveMonster = MonsterFactory.CreateMonster(_monsters[i]);
            this.Monsters.push(MonGen);
        }
    }

    /**
     * Pushes a new monster to the team based on an ID.
     * @param _monster The ID/name of the monster to add
     */
    public AddFreshMonster(_monster : IDEntry) {
        const NewMonster = MonsterFactory.CreateNewMonster(_monster);
        this.Monsters.push(NewMonster)
    }

    private LeadGenerator(_leads : IActivePos[]) {
        _leads.forEach(item =>
            this.Leads.push(new ActivePos(item.position, item.teampos, this))
        )
    }

    /**
     * Given an Team object, give us the
     * ITeam, with all child objects also converted
     * into their respective interfaces
     * @returns the ITeam reflecting this team
     */
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