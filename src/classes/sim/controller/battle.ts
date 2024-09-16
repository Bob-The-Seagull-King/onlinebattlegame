import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { TokenMonsterBattleDex } from "../../../data/static/token/t_monster/token_monster_btl";
import { TokenTerrainBattleDex } from "../../../data/static/token/t_terrain/token_terrain_btl";
import { TraitBattleDex } from "../../../data/static/trait/trait_btl";
import { ActionAction, BotBehaviourWeight, BotOptions, ItemAction, MessageSet, SelectedAction, SubSelectAction, SwitchAction, TurnChoices, TurnSelectReturn } from "../../../global_types";
import { ActiveAction } from "../models/active_action";
import { ActiveItem } from "../models/active_item";
import { FieldedMonster, Team } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { IScene, Scene } from "../models/terrain/terrain_scene";
import { ITrainer, TrainerBase } from "./trainer/trainer_basic";
import { BattleEvents } from "./battle_events";
import { TrainerBot } from "./trainer/trainer_bot";
import { BehaviourDex } from "../../../data/static/behaviour/behaviours";
import { ActiveMonster } from "../models/active_monster";
import { BattleSide, IBattleSide } from "../models/battle_side";
import { TerrainFactory } from "../factories/terrain_factory";

/**
 * Stores information on an event function that needs
 * to be run.
 */
interface EventHolder {
	priority    : number;   // The priority for the event, determining which order events take place in.
    self        : any;      // The origin object of the event.
    source      : any;      // What item/object the event is coming from.
    callback    : any;      // The function that will be called as a part of this event.
    fromsource  : boolean;  // If this event comes from the thing that called the event or not.
}

/**
 * Interface for the Battle (used when sending information to users)
 */
interface IBattle {
    sides       : IBattleSide[]
    scene       : IScene        // The interface form of the battle Scene
}

class Battle {
    public Sides        : BattleSide[];    // All trainers involved in the battle
    public Scene        : Scene;            // The battlefield
    public Manager  : any;              // The object that connects to the Battle and received its messages.
    public Events       : BattleEvents;     // The Event running object that handles performing actions

    /**
     * Simple constructor
     * @param _trainers Trainers that will participate in the battle
     * @param _scene The battlefield involved in this battle
     * @param _manager The manager object this battle will talk to
     */
    constructor(_data : IBattle, _manager : any) {
        this.Scene = TerrainFactory.CreateTerrain(_data.scene, this)
        this.Sides = this.SideGenerator(_data.sides)
        this.Manager = _manager;
        this.Events = new BattleEvents(this);

        this.StartBattle();
    }
    /**
     * Converts the IActiveItems to usable ActiveItem
     * objects.
     * @param _items List of items to recreate
     * @returns Array of ActiveItem objects
     */
    private SideGenerator(_items : IBattleSide[]) {
        const ItemList : BattleSide[] = [];
        let i = 0;
        for (i = 0; i < _items.length; i++) {
            ItemList.push(new BattleSide(_items[i], this))
        }
        return ItemList;
    }

    /**
     * Given a Battle object, give us the
     * IBattle, with all child objects also converted
     * into their respective interfaces
     * @returns the IBattle reflecting this battle
     */
    public ConvertToInterface() {
        const _side : IBattleSide[] = []
        this.Sides.forEach(item => {
            _side.push(item.ConvertToInterface())
        })
            
        const _interface : IBattle = {
            sides: _side,
            scene: this.Scene.ConvertToInterface()
        }
        return _interface;
    }

    /**
     * Takes an array of messages and sends that 
     * information to the relevant connected object.
     * @param _messages Array of messages to send to the users
     */
    public SendOutMessage(_messages : MessageSet) {
        this.Manager.ReceiveMessages(_messages);
    }

    

    /**
     * Begin the battle, and continually loop through rounds
     * until it ends (due to disconnect or victory).
     */
    public async StartBattle() {
        let cont = true;
        while(cont) {
            cont = false
        }
    }

}

export {Battle, IBattle}