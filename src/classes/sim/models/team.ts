import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { TraitBattleDex } from "../../../data/static/trait/trait_btl";
import { IDEntry, SwitchAction } from "../../../global_types";
import { TrainerBase } from "../controller/trainer/trainer_basic";
import { ItemFactory } from "../factories/item_factory";
import { MonsterFactory } from "../factories/monster_factory";
import { ActiveItem, IActiveItem } from "./active_item"
import { ActiveMonster, IActiveMonster } from "./active_monster"
import { BattleSide } from "./battle_side";
import { Plot } from "./terrain/terrain_plot";

/**
 * Interface of the Team object
 */
interface ITeam {
    name        : string            // The name of the team
    items       : IActiveItem[],    // Items held by the team
    monsters    : IActiveMonster[], // All monsters that are part of this team
    active      : IFieldedMonster[]      // Monsters that are currently 'in play' and on the field
}

/**
 * Interface of the active monster's location
 */
interface IFieldedMonster {
    monster : number,
    position : number[],
    hasactivated : boolean
}

class FieldedMonster {

    public Monster: ActiveMonster;    // The monster currently active on the field
    public Position : number[];
    public Plot : Plot;
    public Owner : Team;
    public Activated : boolean

    /**
     * Simple constructor
     * @param _data The interface representing the active monster's position
     */
    constructor(_data : IFieldedMonster, _team : Team) {
        this.Monster = this.Owner.Monsters[_data.monster]
        this.Position = _data.position;
        this.Activated = _data.hasactivated;
        this.Plot = _team.Owner.Owner.Owner.Scene.ReturnGivenPlot(this.Position[0], this.Position[1])
        this.Owner = _team;
    }

    public SwapMon(_action : SwitchAction) {
        this.Monster = this.Owner.Monsters[_action.trainer.Team.Monsters.indexOf(_action.newmon)];
    }

    public ConvertToInterface() {
        const _interface : IFieldedMonster = {
            monster : this.Owner.Monsters.indexOf(this.Monster),
            position : this.Position,
            hasactivated : this.Activated
        }
        return _interface;
    }
}

class Team {

    public Items    : ActiveItem[];     // All items in the team
    public Monsters : ActiveMonster[];  // All monsters within this team
    public Leads    : FieldedMonster[];      // Currently 'in play' monsters
    public Name     : string            // Name the team is reffered by
    public Owner    : TrainerBase;


    /**
     * Simple constructor
     * @param _data The interface representing the team
     */
    constructor(_data : ITeam, _owner : TrainerBase) {
        this.Items = this.ItemGenerator(_data.items);
        this.Name = _data.name;
        this.Monsters = [];
        this.Leads = [];
        this.MonsterGenerator(_data.monsters)
        this.LeadGenerator(_data.active)
        this.Owner = _owner
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
            ItemList.push(ItemFactory.CreateItem(_items[i], this))
        }
        return ItemList;
    }

    /**
     * Pushes a new item to the team based on an ID.
     * @param _item The ID/name of the item to add
     */
    public AddFreshItem(_item : IDEntry) {
        const NewItem = ItemFactory.CreateNewItem(_item, this);
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
            const MonGen : ActiveMonster = MonsterFactory.CreateMonster(_monsters[i], this);
            this.Monsters.push(MonGen);
        }
    }

    /**
     * Pushes a new monster to the team based on an ID.
     * @param _monster The ID/name of the monster to add
     */
    public AddFreshMonster(_monster : IDEntry) {
        const NewMonster = MonsterFactory.CreateNewMonster(_monster, this);
        this.Monsters.push(NewMonster)
    }

    private LeadGenerator(_leads : IFieldedMonster[]) {
        _leads.forEach(item =>
            this.Leads.push(new FieldedMonster(item, this))
        )
    }

    /**
     * Determines the total Star Power (point cost)
     * of the team.
     * @returns The SP of this team
     */
    public CalculateStarPower() : number {
        let SP_Calc = 0;

        this.Items.forEach(item => {
            SP_Calc += ItemBattleDex[item.Item].cost;
        })

        this.Monsters.forEach(monster => {
            SP_Calc += SpeciesBattleDex[monster.GetSpecies()].cost;

            monster.Actions_Current.forEach(action => {
                SP_Calc += ActionBattleDex[action.Action].cost;
            })

            monster.GetTraits().forEach(trait => {
                SP_Calc += TraitBattleDex[trait].cost;
            })
        })

        return SP_Calc;
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
        const _leads : IFieldedMonster[] = []
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
            name        : this.Name,
            items       : _items,
            monsters    : _monsters,
            active      : _leads
        }
        return _interface;
    }

}

export {Team, ITeam, IFieldedMonster, FieldedMonster}