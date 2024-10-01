import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { TokenMonsterBattleDex } from "../../../data/static/token/t_monster/token_monster_btl";
import { TokenTerrainBattleDex } from "../../../data/static/token/t_terrain/token_terrain_btl";
import { TraitBattleDex } from "../../../data/static/trait/trait_btl";
import { BotBehaviourWeight, BotOptions, ChosenAction, MessageSet, PlaceAction, SwapAction, TurnCharacter, TurnChoices, TurnSelect, TurnSelectReturn } from "../../../global_types";
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

// this.runEvent( "", source, target, sourceEffect, relayVar, trackVal, this.MessageList )

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
    public MessageList  : MessageSet;

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
        this.MessageList = [];
    }

    public BattleBegin() {    
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
        return this.shuffleArray(ItemList);
    }
    
    /**
     * Given an array of objects, randomise their order
     * @param array the array to shuffle
     * @returns the array, with objects randomly swapped around
     */
    public shuffleArray(array: any[]): any[] {
        const newArray = array.slice();
    
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
    
        return newArray;
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
        this.MessageList = [];
    }

    /**
     * Begin the battle, and continually loop through rounds
     * until it ends (due to disconnect or victory).
     */
    public async StartBattle() {
        let cont = true;
        cont = await this.SetStartingPositions();
        let roundVar = 1;

        while(cont) {
            this.MessageList.push({ "generic" : "Round " + roundVar})
            this.SendOutMessage(this.MessageList);
            this.Manager.UpdateState(this.ConvertToInterface())
            cont = await this.EnactRound();
            roundVar ++;
        }
    }

    /**
     * Iterates through each trainer, giving
     * them a turn, then assesses if things should continue.
     * @returns If the battle is Over.
     */
    public async EnactRound() : Promise<boolean> {
        
        for (let i = 0; i < this.Turns; i++) {
            for (let j = 0; j < this.Sides.length; j++) {
                for (let k = 0; k < this.Sides[j].Trainers.length; k++) {
                    await this.EnactTurn(this.Sides[j].Trainers[k])
                }
            }
        }
        
        this.runEvent( "EndRound", null, null, null, null, null, this.MessageList )
        return this.ContinueBattle();
    }

    /**
     * Evaulates if a player has won
     * @returns true if no winner is declared
     */
    public ContinueBattle() {
        return this.runEvent( "ContinueBattle", null, null, null, true, null, this.MessageList )
    }

    /**
     * Given a particular trainer, have
     * them choose an action to take and then
     * have the Events perform it.
     * @param _trainer the trainer to have take their turn
     * @returns true once the action has been chosen and performed
     */
    public async EnactTurn(_trainer : TrainerBase) : Promise<boolean> {
        
        const _battle : IBattle = this.ConvertToInterface()
        const _choices : TurnCharacter[] = []

        _choices.push(this.GetTrainerOptions(_trainer))

        for (let i = 0; i < _trainer.Team.Leads.length; i++) {
            const LeadOptions = this.GetMonsterOptions(_trainer.Team.Leads[i])
            if (LeadOptions != null) {
                _choices.push(LeadOptions)
            }
        }

        const _TurnSelect : TurnSelect = {Options: _choices, Battle: _battle}
        
        const Turn : ChosenAction = await (_trainer.SelectChoice(_TurnSelect, this.Manager, this))

        if (Turn) {
            
            if (Turn.type === "SWITCH") {
                const ChosenTurn = (_TurnSelect.Options[Turn.hypo_index].Choices[Turn.type][Turn.type_index] as SwapAction)
                ChosenTurn.target_id = [ChosenTurn.target_id[Turn.hype_index]]
                this.Events.PerformActionSWAP(ChosenTurn, _trainer);
            }

            this.runEvent( "EndTurn", _trainer, null, null, null, null, this.MessageList )
            return true;
        }
    }

    /**
     * Get the possible choices a trainer has
     * which do not relate to any one monster
     * @param _trainer the trainer to select options for
     * @returns the TurnCharacter suite of choices
     */
    public GetTrainerOptions(_trainer : TrainerBase) {

        const _choices : TurnChoices = {}
        
        const swapActions = this.findSwapOptions(_trainer);
        
        _choices["SWITCH"] = swapActions

        return { Choices: _choices, Position : -1}
    }

    /**
     * Get the possible choices a trainer can
     * select relating to this one fielded monster
     * @param _monster the active monster to select options for
     * @returns the TurnCharacter suite of choices
     */
    public GetMonsterOptions(_monster : FieldedMonster) {
        return null //{ Choices: {}, Position : _monster.Owner.Monsters.indexOf(_monster.Monster)}
    }

    /**
     * At the start of the battle, allow each player
     * to set their starting lead monster on their
     * portion of the battlefield.
     * @returns true once all initial battles have been set
     */
    public async SetStartingPositions() {

        for (let i = 0; i < this.Sides.length; i++) {
            const curSide = this.Sides[i];
            const PlacePromise = curSide.Trainers.map(async _trainer => {
                const positions : PlaceAction[] = await this.GetTrainerStartingPositions(_trainer)
                if (positions) {                    
                    undefined;
                }
            })
            await Promise.all(PlacePromise);
            if (PlacePromise) {continue;}
        }
        return true;
    }
    
    /**
     * Given a trainer, get them to choose the
     * initial starting positions of their monsters
     * @param _trainer the trainer to have set their monsters
     * @returns the suite of actions chosen.
     */
    public async GetTrainerStartingPositions(_trainer : TrainerBase) : Promise<PlaceAction[]> {
        let i = 0;
        const positions : PlaceAction[] = []

        while (i < this.Turns) {
            const possibleActions = this.findPlaceOptions(_trainer);
            const _choices : TurnChoices = {}
            _choices["PLACE"] = possibleActions
            const _battle : IBattle = this.ConvertToInterface()
            const _TurnSelect : TurnSelect = {Options: [{Choices: _choices, Position: -1}], Battle: _battle}
            
            const Turn : ChosenAction = await (_trainer.SelectChoice(_TurnSelect, this.Manager, this))

            if (Turn) {
                i++;
                const ChosenTurn = (_TurnSelect.Options[Turn.hypo_index].Choices[Turn.type][Turn.type_index] as PlaceAction)
                ChosenTurn.target_id = [ChosenTurn.target_id[Turn.hype_index]]
                this.Events.PerformActionPLACE(ChosenTurn, _trainer);
                positions.push(ChosenTurn)
            }
        }
        
        return positions
    }

    /**
     * Given a trainer, find all viable options for
     * them to place their monsters
     * @param sourceTrainer the trainer to find options for
     * @returns a list of possible PLACE actions to take
     */
    public findPlaceOptions(sourceTrainer : TrainerBase): PlaceAction[] {
        const _placeactions : PlaceAction[] = [];

        for (let i = 0; i < sourceTrainer.Team.Monsters.length; i++) {
            let MonsterAvailable = (sourceTrainer.Team.Monsters[i].HP_Current > 0);
            
            const CanPlace = this.runEvent( "CanPlaceMonster", sourceTrainer.Team.Monsters[i], null, null, true, null, this.MessageList )
            if (CanPlace) {
                for (let j = 0; j < sourceTrainer.Team.Leads.length; j++) {
                    if (sourceTrainer.Team.Leads[j].Monster === sourceTrainer.Team.Monsters[i]) {
                        MonsterAvailable = false;
                        break;
                    }
                }

                if (MonsterAvailable === true) {
                    const plotpositions : number[][] = []

                    sourceTrainer.Owner.Plots.forEach(_plot => {
                        if ((_plot.IsPlaceable() === true) && (this.runEvent( "CanUsePlot", _plot, null, null, true, null, this.MessageList ) === true)) {
                            plotpositions.push([_plot.Column, _plot.Row])
                        } })

                    const _place : PlaceAction = { type: "PLACE", monster_id: i, target_id: plotpositions }
                    _placeactions.push(_place);
                }   
            }         
        }

        return _placeactions;
    }
    
    /**
     * Given a trainer, find all the possible
     * SWAP options they can take
     * @param sourceTrainer the trainer to search options for
     * @returns the list of SWAP actions.
     */
    public findSwapOptions(sourceTrainer : TrainerBase): SwapAction[] {
        const _swapactions : SwapAction[] = [];

        for (let i = 0; i < sourceTrainer.Team.Monsters.length; i++) {
            let MonsterAvailable = (sourceTrainer.Team.Monsters[i].HP_Current > 0);

            const CanPlace = this.runEvent( "CanPlaceMonster", sourceTrainer.Team.Monsters[i], null, null, true, null, this.MessageList )

            if (CanPlace) {
                for (let j = 0; j < sourceTrainer.Team.Leads.length; j++) {
                    if (sourceTrainer.Team.Leads[j].Monster === sourceTrainer.Team.Monsters[i]) {
                        MonsterAvailable = false;
                        break;
                    }
                }

                if (MonsterAvailable === true) {
                    const plotpositions : number[][] = []

                    sourceTrainer.Team.Leads.forEach(_plot => {                        
                        const CanSwap = this.runEvent( "CanSwapOut", _plot, null, null, true, null, this.MessageList )
                        if (CanSwap) {
                            plotpositions.push(_plot.Position)
                        }})

                    if (plotpositions.length > 0) {
                        const _swap : SwapAction = { type: "SWITCH", monster_id: i, target_id: plotpositions }
                        _swapactions.push(_swap);
                    }
                }  
            }          
        }

        return _swapactions;
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
        source?: FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | TrainerBase | Scene | null,
        target?: FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | TrainerBase | null, 
        sourceEffect?: ActiveItem | ActiveAction | WeatherEffect | FieldEffect | null, 
        relayVar?: any, 
        trackVal?: any,
        messageList? : MessageSet
    ) {

        // Gather all event functions to call
        const Events : EventHolder[] = [];
        
        // If the relevant object exists, gather events from it
        if (target) { 
            if (target instanceof TrainerBase) {
                target.Team.Leads.forEach(_lead => {
                    this.getEvents(eventid, _lead, Events, false) 
                })
            } else {
                this.getEvents(eventid, target, Events, false) 
            }
        }
        if (source) { 
            if (source instanceof TrainerBase) {
                source.Team.Leads.forEach(_lead => {
                    this.getEvents(eventid, _lead, Events, true) 
                })
            } else {
                this.getEvents(eventid, source, Events, true) 
            }
        }
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
    public getEvents( eventid: string, target: FieldedMonster | ActiveMonster | Plot | Scene | WeatherEffect | FieldEffect | ActiveItem | ActiveAction, events : EventHolder[], _fromSource : boolean ) {
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