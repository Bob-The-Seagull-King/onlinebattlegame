import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { TokenMonsterBattleDex } from "../../../data/static/token/t_monster/token_monster_btl";
import { TokenTerrainBattleDex } from "../../../data/static/token/t_terrain/token_terrain_btl";
import { TraitBattleDex } from "../../../data/static/trait/trait_btl";
import { BotBehaviourWeight, BotOptions, MessageSet, TurnChoices, TurnSelectReturn } from "../../../global_types";
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
import { WeatherEffect } from "../models/Effects/weather_effect";
import { FieldEffect } from "../models/Effects/field_effect";
import { FieldBattleDex } from "../../../data/static/field/field_btl";
import { TokenFieldBattleDex } from "../../../data/static/token/t_field/token_field_btl";
import { TokenWeatherBattleDex } from "../../../data/static/token/t_weather/token_weather_btl";
import { WeatherBattleDex } from "../../../data/static/weather/weather_btl";

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
    turns       : number // the number of turns a player gets per round
}

class Battle {
    public Sides        : BattleSide[];    // All trainers involved in the battle
    public Scene        : Scene;            // The battlefield
    public Manager      : any;              // The object that connects to the Battle and received its messages.
    public Events       : BattleEvents;     // The Event running object that handles performing actions
    public Turns        : number;

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
        this.Turns = _data.turns;

        // Initial Plot Map
        this.Manager.UpdateState(this.ConvertToInterface())

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
            scene: this.Scene.ConvertToInterface(),
            turns: this.Turns
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

    
    /**
     * Super important method that handles events. When an event is run, any relevant objects which
     * have that event as a part of them have said event added to the list of events. These
     * events are then performed in sequence which can result in a number of different outcomes.
     * 
     * @param eventid       The string name of the event, with the function being "on" + the eventid
     * @param target        The target of the event-causing-action
     * @param source        The origin of the event-causing-action
     * @param sourceEffect  The specific action that is causing this event
     * @param relayVar      A variable which, if included, is passed through the event functions to be modifier and returned
     * @param trackVal      A variable which is set once, and used to modify the way event functions run
     * @param messageList   Holds a list of messages to be added to
     * @param onEffect      ------------------------ Unused currently ------------------------    
     * @param fastExit      ------------------------ Unused currently ------------------------    
     * @param eventdepth    ------------------------ Unused currently ------------------------    
     * @returns if relayVar is non null, it returns the value of the relayVar after each event has been run
     */
    public runEvent(
        eventid: string,
        source?: FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | null,
        target?: FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | null, 
        sourceEffect?: ActiveItem | ActiveAction | WeatherEffect | FieldEffect | null, 
        relayVar?: any, 
        trackVal?: any,
        messageList? : MessageSet
    ) {

        // Gather all event functions to call
        const Events : EventHolder[] = [];
        
        // If the relevant object exists, gather events from it
        if (target) { this.getEvents(eventid, target, Events, false) }
        if (source) { this.getEvents(eventid, source, Events, true) }
        if (sourceEffect) { this.getEvents(eventid, sourceEffect, Events, true) }

        // Get events from the battle's current scene, and the relevant trainer's sides
        this.Scene.Weather.forEach(_weather => {
            this.getEvents(eventid, _weather, Events, false);
        })

        // If possible, get events from the source and target's plots
        if (source instanceof FieldedMonster) {
            const _plot : Plot = source.Plot
            this.getEvents(eventid, _plot, Events, true);
            _plot.FieldEffects.forEach(_field => {
                this.getEvents(eventid, _field, Events, true);
            })
        }
        if (source instanceof Plot) {
            source.FieldEffects.forEach(_field => {
                this.getEvents(eventid, _field, Events, true);
            })
        }

        if (target instanceof FieldedMonster) {
            const _plot : Plot = target.Plot
            this.getEvents(eventid, _plot, Events, true);
            _plot.FieldEffects.forEach(_field => {
                this.getEvents(eventid, _field, Events, false);
            })
        }
        if (target instanceof Plot) {
            target.FieldEffects.forEach(_field => {
                this.getEvents(eventid, _field, Events, false);
            })
        }

        // Initialize the return value
        let relay_variable = relayVar;
        let returnVal;

        // Organize events by priority
        Events.sort((a, b) => a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0)

        // Run each event
        for (const _event of Events) {
            
            // Determine function arguments
            const args = [];

            let i = 0;
            if ((_event.self !== undefined) && (_event.self !== null)) { args[i] = _event.self; i += 1;}
            if ((source !== undefined) && (source !== null)) { args[i] = source; i += 1; }
            if ((target !== undefined) && (target !== null)) { args[i] = target; i += 1; }
            if ((sourceEffect !== undefined) && (sourceEffect !== null)) { args[i] = sourceEffect; i += 1; }
            if ((relay_variable !== undefined) && (relay_variable !== null)) { args[i] = relay_variable; i += 1; }
            if ((trackVal !== undefined) && (trackVal !== null)) { args[i] = trackVal; i += 1; }
            if ((messageList !== undefined) && (messageList !== null)) { args[i] = messageList; i += 1; }
            if ((_event.fromsource !== undefined) && (_event.fromsource !== null)) { args[i] = _event.fromsource; i += 1; }

            // Run the event
            returnVal = _event.callback.apply(this, args);
            relay_variable = returnVal;
        }

        return relay_variable;
    }

    /**
     * Given an object and the name of an event, find any relevant parts of that object
     * which have the function "on"+eventid in them and add that function as an Event
     * to the battle's list of events to run.
     * @param eventid the name of the event being searched for
     * @param target the object being searched within for events
     * @param events the array of events to add to
     * @param _fromSource if the target is the thing that triggered this event in the first place.
     */
    public getEvents( eventid: string, target: FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | ActiveAction, events : EventHolder[], _fromSource : boolean ) {
        if (target instanceof ActiveMonster) {
            // Search for Monster events
            let i = 0;
            for (i = 0; i < target.Tokens.length; i ++) {
                // Check the monster itself
                let temp_condition = TokenMonsterBattleDex[target.Tokens[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 0, self: target, source: temp_condition, callback: func, fromsource: _fromSource } )
                }
            }
            for (i = 0; i < target.GetTraits().length; i ++) {
                // Check the monster's passive traits
                let temp_condition = TraitBattleDex[target.GetTraits()[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 1, self: target, source: target.GetTraits()[i], callback: func, fromsource: _fromSource } )
                }
            }
        }        
        if (target instanceof FieldedMonster) {
            // Search for Monster events
            let i = 0;
            for (i = 0; i < target.Monster.Tokens.length; i ++) {
                // Check the monster itself
                let temp_condition = TokenMonsterBattleDex[target.Monster.Tokens[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 0, self: target, source: temp_condition, callback: func, fromsource: _fromSource } )
                }
            }
            for (i = 0; i < target.Monster.GetTraits().length; i ++) {  
                // Check the monster's passive traits
                let temp_condition = TraitBattleDex[target.Monster.GetTraits()[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 1, self: target, source: target.Monster.GetTraits()[i], callback: func, fromsource: _fromSource } )
                }
            }
        } if ((target instanceof Plot)) {
            // Search for terrain events
            let i = 0;
            for (i = 0; i < target.Tokens.length; i ++) {
                let temp_condition = TokenTerrainBattleDex[target.Tokens[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 2, self: target, source: temp_condition, callback: func, fromsource: _fromSource } )
                }
            }
        }
        if (target instanceof ActiveAction) {
            
            // Search for events made by an action
            let temp_condition = ActionBattleDex[target.Action]
            // @ts-ignore - dynamic lookup
            const func = temp_condition['on'+eventid];
            if (func !== undefined) {
                events.push( { priority: 4, self: target.Owner, source: target, callback: func, fromsource: _fromSource } )
            }     
        }
        if (target instanceof ActiveItem) {
            
            // Search for events made by an item
            let temp_condition = ItemBattleDex[target.Item]
            // @ts-ignore - dynamic lookup
            const func = temp_condition['on'+eventid];
            if (func !== undefined) {
                events.push( { priority: 3, self: target, source: target, callback: func, fromsource: _fromSource } )
            }     
        }
        if (target instanceof FieldEffect) {
            // Search for Monster events
            let i = 0;
            for (i = 0; i < target.Tokens.length; i ++) {
                // Check the monster itself
                let temp_condition = TokenFieldBattleDex[target.Tokens[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 0, self: target, source: temp_condition, callback: func, fromsource: _fromSource } )
                }
            }          
            
            // Search for events made by an item
            let temp_condition = FieldBattleDex[target.Field]
            // @ts-ignore - dynamic lookup
            const func = temp_condition['on'+eventid];
            if (func !== undefined) {
                events.push( { priority: 3, self: target, source: target, callback: func, fromsource: _fromSource } )
            }    
        } 
        if (target instanceof WeatherEffect) {
            // Search for Monster events
            let i = 0;
            for (i = 0; i < target.Tokens.length; i ++) {
                // Check the monster itself
                let temp_condition = TokenWeatherBattleDex[target.Tokens[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 0, self: target, source: temp_condition, callback: func, fromsource: _fromSource } )
                }
            }          
            
            // Search for events made by an item
            let temp_condition = WeatherBattleDex[target.Weather]
            // @ts-ignore - dynamic lookup
            const func = temp_condition['on'+eventid];
            if (func !== undefined) {
                events.push( { priority: 3, self: target, source: target, callback: func, fromsource: _fromSource } )
            }    
        } 
    }


}

export {Battle, IBattle}