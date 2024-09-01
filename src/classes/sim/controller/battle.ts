import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { TokenMonsterBattleDex } from "../../../data/static/token/t_monster/token_monster_btl";
import { TokenTerrainBattleDex } from "../../../data/static/token/t_terrain/token_terrain_btl";
import { TraitBattleDex } from "../../../data/static/trait/trait_btl";
import { ActionAction, BotBehaviourWeight, BotOptions, ItemAction, MessageSet, SelectedAction, SubSelectAction, SwitchAction, TurnChoices, TurnSelectReturn } from "../../../global_types";
import { ActiveAction } from "../models/active_action";
import { ActiveItem } from "../models/active_item";
import { ActivePos, Team } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { IScene, Scene } from "../models/terrain/terrain_scene";
import { Side } from "../models/terrain/terrain_side";
import { ITrainer, TrainerBase } from "./trainer/trainer_basic";
import { BattleEvents } from "./battle_events";
import { TrainerBot } from "./trainer/trainer_bot";
import { BehaviourDex } from "../../../data/static/behaviour/behaviours";
import { ActiveMonster } from "../models/active_monster";

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
    trainers    : ITrainer[],   // The interface form of all trainers involved in the battle
    scene       : IScene        // The interface form of the battle Scene
}

class Battle {
    public Trainers     : TrainerBase[];    // All trainers involved in the battle
    public Scene        : Scene;            // The battlefield
    public SendMessage  : any;              // The object that connects to the Battle and received its messages.
    public Events       : BattleEvents;     // The Event running object that handles performing actions

    /**
     * Simple constructor
     * @param _trainers Trainers that will participate in the battle
     * @param _scene The battlefield involved in this battle
     * @param _manager The manager object this battle will talk to
     */
    constructor(_trainers : TrainerBase[], _scene : Scene, _manager : any) {
        this.Trainers = _trainers;
        this.Scene = _scene
        this.SendMessage = _manager;
        this.Events = new BattleEvents(this);

        this.StartBattle();
    }

    /**
     * Given a Battle object, give us the
     * IBattle, with all child objects also converted
     * into their respective interfaces
     * @returns the IBattle reflecting this battle
     */
    public ConvertToInterface() {
        const _trainers : ITrainer[] = []
        this.Trainers.forEach(item => {
            _trainers.push(item.ConvertToInterface())
        })
            
        const _interface : IBattle = {
            trainers: _trainers,
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
        this.SendMessage.ReceiveMessages(_messages);
    }

    /**
     * Begin the battle, and continually loop through rounds
     * until it ends (due to disconnect or victory).
     */
    public async StartBattle() {
        let cont = true;
        while(cont) {
            cont = await this.RunRound();
        }
    }

    /**
     * Grabs the selected actions each trainer will take, then
     * has the Events object perform them.
     * @returns If the battle should continue.
     */
    public async RunRound() {
        const Choices : SelectedAction[] = await this.GetTurns()

        if (Choices) {
            const KeepGoing = await this.Events.runTurns(Choices);
            if (KeepGoing) { 
                let DeadSwapNeeded = this.CountTheDead() > 0

                while (DeadSwapNeeded === true) {
                    const DeadChoices : SelectedAction[] = await this.GetDeadSwap()
                    const DeadSwap = await this.Events.runTurns(DeadChoices);
                        
                    if (DeadSwap) { }
                    if (DeadChoices.length === 0) {
                        DeadSwapNeeded = false;
                    }
                }
                // Next Round
                return this.IsBattleAlive();;
            }
        }
    }

    /**
     * Checks if there are enough living monsters to continue the battle.
     * @returns boolean if there is more than one trainer with living monsters
     */
    public IsBattleAlive() {
        let LivingCount = 0
        
        this.Trainers.forEach(item => {
            if (this.IsAlive(item.Team)) {
                LivingCount += 1
            }
        })
        return (LivingCount > 1)
    }

    /**
     * Counts the number of teams which require a
     * swap to occur.
     * @returns number of teams that have some living monster, but some leads are dead
     */
    public CountTheDead() {
        let DeadCount = 0

        this.Trainers.forEach(trainer => {            
            if (this.IsAlive(trainer.Team)) {
                trainer.Team.Leads.forEach(lead => {
                    if (lead.Monster.HP_Current <= 0) {
                        DeadCount += 1;
                    }
                })
            }
        })

        return DeadCount
    }

    /**
     * Checks if a team has enough living monsters to continue fighting.
     * @param _team The team being checked for living monsters
     * @returns If there are any monsters with non-zero hit points
     */
    public IsAlive(_team : Team) {
        let LivingCount = 0
        _team.Monsters.forEach(item => {
            if (item.HP_Current > 0) {
                LivingCount += 1;
            }
        })
        return (LivingCount > 0);
    }

    /**
     * Gets SWITCH actions for when a monster is dead
     * at the end of a round.
     * @returns actions selected
     */
    public async GetDeadSwap() {
        const Choices : SelectedAction[] = [];

        const TurnPromise = this.Trainers.map(async (item) => {
            if (item.Team.Leads.length > 0) {
                const LeadPromise = item.Team.Leads.map( async (element) => {
                    if (element.Monster.HP_Current <= 0) {
                        const Options : TurnChoices = this.GetDeadSwitchChoices(item, element)
                        if (Options["SWITCH"]) {
                            const Turn : TurnSelectReturn = await (item.SelectChoice({ Choices: Options, Position: element.Position, Battle: this.ConvertToInterface()}, this.SendMessage, this))
                            if (Turn) {
                                let ChosenAction : SelectedAction = null;
                                if (Turn.subItemIndex !== undefined) {
                                    ChosenAction = (Options[Turn.actiontype][Turn.itemIndex] as SubSelectAction).options[Turn.subItemIndex]
                                } else {
                                    ChosenAction = (Options[Turn.actiontype][Turn.itemIndex])
                                }
                                ChosenAction.trainer = item // When creating options, the trainer is replaced with a simple version for message size reasons, this sets it back to the right trainer object.
                                Choices.push(ChosenAction)
                            }
                        }
                    }                    
                })
                await Promise.all(LeadPromise);
            }
        });

        await Promise.all(TurnPromise);
        if (TurnPromise) { return Choices; }
    }

    /**
     * Async function that, for each viable monster on the scene, collates
     * their possible actions and sends a request to that monster's trainer
     * which will return a single SelectedAction.
     * 
     * Once all actions have been selected, the array of actions is returned.
     */
    public async GetTurns() {
        const Choices : SelectedAction[] = [];

        const TurnPromise = this.Trainers.map(async (item) => {
            // If the trainer has no monsters on the field, they instead
            // return a "Skip Turn" action.
            if (item.Team.Leads.length > 0) {
                const LeadPromise = item.Team.Leads.map( async (element) => {
                    const Options : TurnChoices = this.GetTrainerChoices(item, element)
                    const Turn : TurnSelectReturn = await (item.SelectChoice({ Choices: Options, Position: element.Position, Battle: this.ConvertToInterface()}, this.SendMessage, this))
                    if (Turn) {
                        let ChosenAction : SelectedAction = null;
                        if (Turn.subItemIndex !== undefined) {
                            ChosenAction = (Options[Turn.actiontype][Turn.itemIndex] as SubSelectAction).options[Turn.subItemIndex]
                        } else {
                            ChosenAction = (Options[Turn.actiontype][Turn.itemIndex])
                        }
                        ChosenAction.trainer = item // When creating options, the trainer is replaced with a simple version for message size reasons, this sets it back to the right trainer object.
                        Choices.push(ChosenAction)
                    }
                })

                await Promise.all(LeadPromise);
            } else {
                // Trainer skips their turn.
                const Turn : SelectedAction = {type: "NONE", trainer: item}
                if (Turn) { Choices.push(Turn) }
            }

        });

        await Promise.all(TurnPromise);
        if (TurnPromise) { return Choices; }
    }

    /**
     * Given a trainer, and a monster currently on the field, return
     * an array of all possible actions that the monster can take, or that
     * the trainer can take in place of the monster.
     * @param _trainer the trainer controlling the monster
     * @param _monster the monster whose 'position' the action is taken from
     * @returns an array of SelectAction objects
     */
    public GetTrainerChoices(_trainer : TrainerBase, _monster : ActivePos) {
        // Simplified Trainer Info for Socket-Safe message size
        const baseTrainer = new TrainerBase({ team : _trainer.Team.ConvertToInterface(), pos : _trainer.Position, name: _trainer.Name })

        // Setup Empties
        const SwitchChoices : SubSelectAction[] = []
        const ItemChoices : SubSelectAction[] = [];
        const ActionChoices : SubSelectAction[] = [];
        const NoneActions : SelectedAction[] = [{type : "NONE", trainer : baseTrainer}];

        const _activeChoices : TurnChoices = {}

        // Gather Choices

        // Switch Options
        const SwitchOptions : SwitchAction[] = []
        _trainer.Team.Monsters.forEach(item => {
            let IsOut = (item.HP_Current > 0)? false : true;
            for (let i = 0; i < _trainer.Team.Leads.length; i++) {
                if (_trainer.Team.Leads[i].Monster === item) {
                    IsOut = true;
                    break;
                }
            }
            if (IsOut === false) { SwitchOptions.push( { type: "SWITCH", trainer: baseTrainer, current: _monster, newmon: item }) }
        })
        if (SwitchOptions.length > 0) {
            SwitchChoices.push({
                type    : "SWITCH",
                trainer : baseTrainer,
                choice  : _monster,
                options : SwitchOptions
            })
        }

        // Item Options
        _trainer.Team.Items.forEach(item => {
            if (item.Used === false) {
                const ItemOptions : ItemAction[] = []
                this.GetTrainerItemChoices(item, _trainer, ItemOptions)
                ItemChoices.push({
                    type    : "ITEM",
                    trainer : baseTrainer,
                    choice  : item,
                    options : ItemOptions
                })
            }
        })

        // Action Options
        if (_monster.Monster.HP_Current > 0) {
            _monster.Monster.Actions_Current.forEach(item => {
                if (item.HasUsesRemaining()) {
                    const ActionOptions : ActionAction[] = []
                    this.GetMonsterActionChoices(item, _trainer, _monster, ActionOptions)
                    ActionChoices.push({
                        type    : "ACTION",
                        trainer : baseTrainer,
                        choice  : item,
                        options : ActionOptions
                    })
                }
            })
        }

        // Assign to choice list
        if (SwitchChoices.length > 0) { _activeChoices["SWITCH"] = SwitchChoices; }
        if (ItemChoices.length > 0) { _activeChoices["ITEM"] = ItemChoices; }
        if (ActionChoices.length > 0) { _activeChoices["ACTION"] = ActionChoices; }

        // Emergency "Skip Turn" choice if no other choices were generated
        if ((SwitchChoices.length <= 0) &&
            (ItemChoices.length <= 0) &&
            (ActionChoices.length <= 0)) {
            _activeChoices["NONE"] = NoneActions;
        }

        return _activeChoices
    }

    /**
     * Just return a selection of Switch options, used
     * when a monster is dead at the end of a turn.
     * @param _trainer the trainer of the monster
     * @param _monster the monster to swap out
     * @returns set of available choices to swap in.
     */
    public GetDeadSwitchChoices(_trainer : TrainerBase, _monster : ActivePos) {        
        // Simplified Trainer Info for Socket-Safe message size
        const baseTrainer = new TrainerBase({ team : _trainer.Team.ConvertToInterface(), pos : _trainer.Position, name: _trainer.Name })

        const SwitchOptions : SwitchAction[] = []
        const SwitchChoices : SubSelectAction[] = []
        const _activeChoices : TurnChoices = {}

        _trainer.Team.Monsters.forEach(item => {
            let IsOut = (item.HP_Current > 0)? false : true;
            for (let i = 0; i < _trainer.Team.Leads.length; i++) {
                if (_trainer.Team.Leads[i].Monster === item) {
                    IsOut = true;
                    break;
                }
            }
            if (IsOut === false) { SwitchOptions.push( { type: "SWITCH", trainer: baseTrainer, current: _monster, newmon: item }) }
        })
        
        if (SwitchOptions.length > 0) {
            SwitchChoices.push({ type : "SWITCH", trainer : baseTrainer, choice : _monster, options : SwitchOptions })
        }
        
        if (SwitchChoices.length > 0) { _activeChoices["SWITCH"] = SwitchChoices; }
        return _activeChoices
    }

    /**
     * Given a monster is taking a specific action, generate all
     * the possible combinations of target selection based on the action's
     * available target options.
     * @param _action The action that will be made
     * @param _trainer The acting monster's trainer
     * @param _monster The acting monster
     * @param choiceList The list of possible ActionAction objects to push to.
     */
    public GetMonsterActionChoices( _action : ActiveAction, _trainer : TrainerBase, _monster : ActivePos, choiceList : ActionAction[]) {
        const ActionData = ActionBattleDex[_action.Action];
        const baseTrainer = new TrainerBase({ team : _trainer.Team.ConvertToInterface(), pos : _trainer.Position, name: _trainer.Name })

        // Check if the monster allows itself to use this action.
        if (this.runEvent("CanUseMove", _trainer, _trainer, _monster, _monster, _action, true)) {
            if (ActionData.team_target === "SELF") {
                // If the actions targets the user
                choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[_trainer.Position, _monster.Position]] })            
            } else if (ActionData.team_target === "ALL") {
                // If the user targets the entire field
                if (ActionData.pos_target === "ALL") { 
                    // If it specifically targets the Scene
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [] })
                } else if (ActionData.pos_target === "SIDE") { 
                    // If it specifically targets each Side
                    const SideList : number[][] = []
                    this.Scene.Sides.forEach(item => { SideList.push([item.Position]) })
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: SideList })
                } else if (ActionData.pos_target === "SINGLE") { 
                    // If it specifically targets each monster / their plot
                    const PlotList : number[][] = []
                    this.Scene.Plots.forEach(item => {PlotList.push([item.ScenePos, item.Position]) })
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: PlotList })
                }
            } else if (ActionData.team_target === "ANY") {
                // If the user targets any single unit on the field
                if (ActionData.pos_target === "SIDE") {
                    // If it specifically targets an entire side
                    this.Scene.Sides.forEach(item => {
                        choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.Position]] })
                    })
                } else if (ActionData.pos_target === "SINGLE") {
                    // If it specifically targets a monster / their plot
                    this.Scene.Plots.forEach(item => {
                        choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.ScenePos, item.Position]] })
                    })
                }
            } else if (ActionData.team_target === "TEAM") {
                // If the user targets their own team
                if (ActionData.pos_target === "SIDE") {
                    // If it specifically targets their entire side
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[_trainer.Position]] })
                } else if (ActionData.pos_target === "SINGLE") {
                    // If it specifically targets them or an ally / their or an ally's plot
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos === _trainer.Position) {
                            choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            } else if (ActionData.team_target === "ENEMY") {
                // If the user targets any team other than their own
                if (ActionData.pos_target === "SIDE") {
                    // If it specifically targets an entire side
                    this.Scene.Sides.forEach(item => {
                        if (item.Position != _trainer.Position) {
                            choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.Position]] })
                        }
                    })
                } else if (ActionData.pos_target === "SINGLE") {
                    // If it specifically targets a monster / their plot
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos != _trainer.Position) {
                            choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            }
        }
    }

    /**
     * Given a trainer is using a specific item, generate all
     * the possible combinations of target selection based on the item's
     * available target options.
     * @param _item The item that will be used
     * @param _trainer The acting trainer
     * @param choiceList The list of possible ItemAction objects to push to.
     */
    public GetTrainerItemChoices(_item : ActiveItem, _trainer : TrainerBase, choiceList : ItemAction[]) {
        const ItemData = ItemBattleDex[_item.Item];
        const baseTrainer = new TrainerBase({ team : _trainer.Team.ConvertToInterface(), pos : _trainer.Position, name: _trainer.Name })

        // Check if the trainer allows itself to use this item.
        if (this.runEvent("CanUseItem", _trainer, _trainer, null, _trainer, _item, true)) {
            if (ItemData.team_target === "ALL") {
                // If the item affects the entire field at once
                if (ItemData.pos_target === "ALL") {
                    // If it specifically affects the entire scene
                    choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: []
                    })
                } else if (ItemData.pos_target === "SIDE") {
                    // If it specifically affects each side
                    const SideList : number[][] = []
                    this.Scene.Sides.forEach(item => {
                        SideList.push([item.Position])
                    })
                    choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: SideList })
                } else if (ItemData.pos_target === "SINGLE") {
                    // If it specifically affects a single monster / their plot
                    const PlotList : number[][] = []
                    this.Scene.Plots.forEach(item => {
                        PlotList.push([item.ScenePos, item.Position])
                    })
                    choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: PlotList })
                }
            } else if (ItemData.team_target === "ANY") {
                // If the item affects any single part of the field
                if (ItemData.pos_target === "SIDE") {
                    // If it specifically affects a single side
                    this.Scene.Sides.forEach(item => {
                        choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.Position]] })
                    })
                } else if (ItemData.pos_target === "SINGLE") {
                    // If it specifically affects a single monster / their plot
                    this.Scene.Plots.forEach(item => {
                        choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.ScenePos, item.Position]] })
                    })
                }
            } else if (ItemData.team_target === "ENEMY") {
                // If the item affects any enemy part of the field
                if (ItemData.pos_target === "SIDE") {
                    // If it specifically affects an enemy side
                    this.Scene.Sides.forEach(item => {
                        if (item.Position != _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.Position]] })
                        }
                    })
                } else if (ItemData.pos_target === "SINGLE") {
                    // If it specifically affects a single enemy monster / their plot
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos != _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            } else if (ItemData.team_target === "TEAM") {
                // If the item affects the users part of the field
                if (ItemData.pos_target === "SIDE") {
                    // If it specifically affects their entire side
                    this.Scene.Sides.forEach(item => {
                        if (item.Position === _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.Position]] })
                        }
                    })
                } else if (ItemData.pos_target === "SINGLE") {
                    // If it specificaly affects one of their monsters / their plots
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos === _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            }
        }

    }    

    /**
     * Super important method that handles events. When an event is run, any relevant objects which
     * have that event as a part of them have said event added to the list of events. These
     * events are then performed in sequence which can result in a number of different outcomes.
     * 
     * @param eventid       The string name of the event, with the function being "on" + the eventid
     * @param trainer       The trainer whose action is causing this event
     * @param targettrainer The trainer who is being affected by this action
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
        trainer: TrainerBase, 
        targettrainer? : TrainerBase,
        target?: TrainerBase | ActivePos | ActiveMonster | Plot | Side | Scene | null, 
        source?: TrainerBase | ActivePos | ActiveMonster | Plot | Side | Scene | ActiveItem | null,
        sourceEffect?: ActiveItem | ActiveAction | null, 
        relayVar?: any, 
        trackVal?: any,
        messageList? : MessageSet,
        onEffect?: boolean, 
        fastExit?: boolean,
        eventdepth?: number
    ) {

        // Gather all event functions to call
        const Events : EventHolder[] = [];
        
        // If the relevant object exists, gather events from it
        if (target) { this.getEvents(eventid, target, Events, false) }
        if (source) { this.getEvents(eventid, source, Events, true) }
        if (sourceEffect) { this.getEvents(eventid, sourceEffect, Events, true) }

        // Get events from the battle's current scene, and the relevant trainer's sides
        this.getEvents(eventid, this.Scene, Events, true);
        this.getEvents(eventid, this.Scene.Sides[trainer.Position], Events, true);
        if (targettrainer) {
            this.getEvents(eventid, this.Scene.Sides[targettrainer.Position], Events, false);
        }

        // If possible, get events from the source and target's plots
        if (source instanceof ActivePos) {
            this.getEvents(eventid, this.Scene.Sides[trainer.Position].Plots[source.Position], Events, true);
        }
        if ((target instanceof ActivePos) && (targettrainer)) {
            this.getEvents(eventid, this.Scene.Sides[targettrainer.Position].Plots[target.Position], Events, false);
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
            if ((trainer !== undefined) && (trainer !== null)) { args[i] = trainer; i += 1; }
            if ((targettrainer !== undefined) && (targettrainer !== null)) { args[i] = targettrainer; i += 1; }
            if ((target !== undefined) && (target !== null)) { args[i] = target; i += 1; }
            if ((source !== undefined) && (source !== null)) { args[i] = source; i += 1; }
            if ((sourceEffect !== undefined) && (sourceEffect !== null)) { args[i] = sourceEffect; i += 1; }
            if ((relay_variable !== undefined) && (relay_variable !== null)) { args[i] = relay_variable; i += 1; }
            if ((trackVal !== undefined) && (trackVal !== null)) { args[i] = trackVal; i += 1; }
            if ((messageList !== undefined) && (messageList !== null)) { args[i] = messageList; i += 1; }
            if ((onEffect !== undefined) && (onEffect !== null)) { args[i] = onEffect; i += 1; }
            if ((fastExit !== undefined) && (fastExit !== null)) { args[i] = fastExit; i += 1; }
            if ((_event.fromsource !== undefined) && (_event.fromsource !== null)) { args[i] = _event.fromsource; i += 1; }
            if ((eventdepth !== undefined) && (eventdepth !== null)) {
                args[i] = eventdepth;
                i += 1;
            }

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
    public getEvents( eventid: string, target: TrainerBase | ActivePos | ActiveMonster | ActiveItem | ActiveAction | Plot | Side | Scene, events : EventHolder[], _fromSource : boolean ) {
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
            for (i = 0; i < target.Traits.length; i ++) {
                // Check the monster's passive traits
                let temp_condition = TraitBattleDex[target.Traits[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 1, self: target, source: target.Traits[i], callback: func, fromsource: _fromSource } )
                }
            }
        }        
        if (target instanceof ActivePos) {
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
            for (i = 0; i < target.Monster.Traits.length; i ++) {
                // Check the monster's passive traits
                let temp_condition = TraitBattleDex[target.Monster.Traits[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 1, self: target, source: target.Monster.Traits[i], callback: func, fromsource: _fromSource } )
                }
            }
        }if ((target instanceof Scene) || (target instanceof Side) || (target instanceof Plot)) {
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
    }

    /**
     * Handles running Trainer Bot descision making. Takes a collection of possible options
     * and runs any events in that trainer's behaviour modifiers to change the proportional
     * weight of those options.
     * @param behaviourid       The string name of the event, with the function being "on" + the eventid
     * @param trainer           The trainer making this descision
     * @param options           The available options to choose from
     * @param optionSpecific    The specific option to modify, if any
     * @param relayVar          A variable which, if included, is passed through the event functions to be modifier and returned
     * @param trackVal          A variable which is set once, and used to modify the way event functions run
     * @returns if relayVar is non null, it returns the value of the relayVar after each event has been run
     */
    public runBehaviour(
        behaviourid: string,
        trainer: TrainerBot, 
        options? : BotOptions,
        optionSpecific? : BotBehaviourWeight,
        relayVar?: any, 
        trackVal?: any
    ) {

        // Gather all event functions to call
        const Events : EventHolder[] = [];

        // Get events from the trainer
        this.getBehaviour(behaviourid, trainer, Events, true);

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
            if ((trainer !== undefined) && (trainer !== null)) { args[i] = trainer; i += 1; }
            if ((options !== undefined) && (options !== null)) { args[i] = options; i += 1; }
            if ((optionSpecific !== undefined) && (optionSpecific !== null)) { args[i] = optionSpecific; i += 1; }
            if ((relay_variable !== undefined) && (relay_variable !== null)) { args[i] = relay_variable; i += 1; }
            if ((trackVal !== undefined) && (trackVal !== null)) { args[i] = trackVal; i += 1; }

            // Run the event
            returnVal = _event.callback.apply(this, args);
            relay_variable = returnVal;
        }

        return relay_variable;
    }
    
    /**
     * Given a trainer and the name of a behaviour, find any behaviours
     * which have the function "on"+eventid in them and add that function 
     * as an Event to the battle's list of events to run.
     * @param eventid the name of the event being searched for
     * @param target the trainer being searched within for events
     * @param events the array of events to add to
     * @param _fromSource if the target is the thing that triggered this event in the first place.
     */
    public getBehaviour( eventid: string, target: TrainerBot, events : EventHolder[], _fromSource : boolean ) {
        for (let i = 0; i < target.Behaviour.length; i ++) {
            // Check the monster's passive traits
            let temp_condition = BehaviourDex[target.Behaviour[i]]
            // @ts-ignore - dynamic lookup
            const func = temp_condition['on'+eventid];
            if (func !== undefined) {
                events.push( { priority: 1, self: target, source: target, callback: func, fromsource: _fromSource } )
            }
        }
    }
}

export {Battle, IBattle}