import { MonsterType } from "./data/enum/types";
import { ActionCategory, FieldCategory, ItemCategory, TokenCategory, TraitCategory, WeatherCategory } from "./data/enum/categories";
import { TrainerBase } from "./classes/sim/controller/trainer/trainer_basic";
import { ActiveMonster } from "./classes/sim/models/active_monster";
import { ActiveItem } from "./classes/sim/models/active_item";
import { ActiveAction } from "./classes/sim/models/active_action";
import { FieldedMonster } from "./classes/sim/models/team";
import { Scene } from "./classes/sim/models/terrain/terrain_scene";
import { Plot } from "./classes/sim/models/terrain/terrain_plot";
import { Battle, IBattle } from "./classes/sim/controller/battle";
import { TrainerBot } from "./classes/sim/controller/trainer/trainer_bot";
import { FieldEffect } from "./classes/sim/models/Effects/field_effect";
import { WeatherEffect } from "./classes/sim/models/Effects/weather_effect";

// ----------------------------------- Types ---------------------------------------------

export type IDEntry = Lowercase<string>; // Used for mapping to entries on tables
export type InfoSetNumber = {[type : number]: number}; // Used for type chart matchups
export type InfoSetGeneric = {[id : IDEntry]: any}; // Generic dictionary type used for most putposes
export type MessageSet = InfoSetGeneric[]; // Collection of generically typed dictionaries
export type TargetSet = (FieldedMonster | Scene | Plot)[]; // Array of potential targets (of various types) for an item/move

/**
 * Used in object descriptions, allows for text formatting.
 */
export type DescBlock = {
    cat     : string,   // The format to apply to this block
    text    : string    // The block itself
}

/**
 * The core stats of each monster
 */
export type BaseStats = {
    hp  : number,   // The maximum base hit points
    dl  : number,   // The damage minimum
    dh  : number,   // The damage maximum
    ac  : number,   // The accuracy modifier applied to actions taken
    pt  : number,   // The modifier applied to damage received
    sk  : number,   // The base modifier for an ability to apply additional effects
    rs  : number,   // The modifier applied to the chance to receive effects
    sp  : number    // The speed of a monster, determining action order
}

// --------------------------------- Interface -------------------------------------------

/**
 * Given to a trainer to choose a course of action from
 */
export type TurnSelect = {
    Options     : TurnCharacter[]
    Battle      : IBattle       // The current state of the battle
}

export type TurnCharacter = {
    Choices     : TurnChoices,  // List of available choices
    Position    : number,       // The index of the monster these actions represent (-1 means trainer)
}

/**
 * Collection of available choices in dictionary
 * format for a trainer to select from.
 */
export type TurnChoices = {
    [actiontype : string] : SelectedAction[]
}

/**
 * Returned to the battle to determine the
 * user's inteded action.
 */
export type TurnSelectReturn = {
    actiontype : string,
    itemIndex : number,
    subItemIndex? : number
}

/**
 * Used to weight different options against each other
 * when a bot is selection an action.
 */
export type BotBehaviourWeight = {
    action : SelectedAction,  // The action associated with this weighting
    weight : number             // Weight of the move (higher weight === more likely to select)
}

/**
 * Array of weighted options used by bots to select
 * an action in battle.
 */
export type BotOptions = BotBehaviourWeight[]

/**
 * Base interface for possible actions that can be taken.
 */
export interface SelectedAction {
    type    : 'SWITCH' | 'ITEM' | 'ACTION' | 'NONE' | 'MOVE' | 'PLACE',    // What kind of action is being taken
}

export interface TargetAction extends SelectedAction {    
    target_id : number[][]  // The coordinates to be chosen
}

export interface ChosenAction extends SelectedAction {
    type_index : number, // The index within the array of X-Type actions (ie 1 === the second X type action)
    hypo_index? : number // The index within the options selector (ie for ACTION, 0 would be the first action item)
    hype_index? : number // The index within a suboption (ie for ACTION, 3 would be the 4th position item)
}

export interface PlaceAction extends TargetAction { // Determines how a PLACE action occurs
    monster_id : number, // The index of the Monster to be placed within the trainer's team
}

export interface SwapAction extends TargetAction {
    monster_id : number, // The index of the monster to swap in
}

export interface ItemAction extends TargetAction {
    item    : number,   // The index of the item in the trainer's bag
}

export interface ActionAction extends TargetAction {
    source_id : number,     // The index of the monster in the fielded options
    action_id : number,     // The index of the action in the fielded monster
}

export interface MoveAction extends SelectedAction {
    source_id : number,     // The index of the monster in the fielded options
    paths : number[][][]  // The possible paths a monster can travel
}

// --------------------------------- Database Item ---------------------------------------

// Monster species
export interface ISpeciesBattle extends CallEvents {
    id          : number,           // Numerical ID of the monster
    type        : MonsterType[],    // Type(s) the monster possesses
    stats       : BaseStats,        // Base stats of the monster
    cost        : number,           // The Star Power it takes to add the monster to a team
    evolution   : boolean           // Determines if the monster is considered a 'base' or 'evolved' form
}

export interface ISpeciesInfo {
    id          : number,   // Numerical ID of the monster
    name        : string,   // The species' name
    subtitle    : string,   // Subtitle / category for the monster
    description : string    // Monster description
}

export interface ISpeciesLearnset {
    id          : number,       // Numerical ID of the monster
    traits      : IDEntry[],    // List of traits a monster can learn
    actions     : IDEntry[],    // List of actions a monster can learn
}

export interface IEvolutionSet {
    newspecies  : IDEntry,
    triggeritem : IDEntry
}

export interface ISpeciesEvolution {
    id          : number,           // Numerical ID of the monster
    evolutions  : IEvolutionSet[]   // Set of evolutions
}

// Monster Action
export interface IActionBattle extends CallEvents, ChoiceTarget {
    id          : number,                   // Numerical ID of the action
    type        : MonsterType,              // The elemental type of the action
    cost        : number                    // The Star Power it takes to add the action to a monster
    uses        : number,                   // How many times the action can be used per battle
    accuracy    : number | true,            // Base accuracy of a move (true === no accuracy check)
    damage_mod  : number | true | false,    // Modifier the action applies to the user's damage range (true === alternative damage calc) (false === does no damage)
    priority    : number,                   // The action priority, higher priority moves always go after lower priority moves
    category    : ActionCategory[],         // Category of move
    events      : InfoSetGeneric            // Tags for move use
}

export interface IActionInfo {
    id          : number,       // Numerical ID of the action
    name        : string,       // Name of the aciton
    description : DescBlock[]   // Formattable description of the action
}

// Monster Trait
export interface ITraitBattle extends CallEvents {
    id          : number,           // Numerical ID of the trait
    cost        : number,           // Star Power cost to add the trait to a monster
    category    : TraitCategory[],  // Category of this trait
    events      : InfoSetGeneric    // Tags for move use
}

export interface ITraitInfo {
    id          : number,       // Numerical ID of the trait
    name        : string,       // Name of the trait
    description : DescBlock[]   // Formattable description of the trait
}

// Weather
export interface IWeatherBattle extends CallEvents {
    id          : number,           // Numerical ID of the effect
    category    : WeatherCategory[],  // Category of this trait
    events      : InfoSetGeneric    // Tags for move use
}

export interface IWeatherInfo {
    id          : number,       // Numerical ID of the trait
    name        : string,       // Name of the trait
    description : DescBlock[]   // Formattable description of the trait
}

// Field
export interface IFieldBattle extends CallEvents {
    id          : number,           // Numerical ID of the effect
    category    : FieldCategory[],  // Category of this trait
    events      : InfoSetGeneric    // Tags for move use
}

export interface IFieldInfo {
    id          : number,       // Numerical ID of the trait
    name        : string,       // Name of the trait
    description : DescBlock[]   // Formattable description of the trait
}

// Battle Item
export interface IItemBattle extends CallEvents, ChoiceTarget {
    id          : number,           // Numerical ID of the item
    cost        : number,           // Star Power cost to add the item to a team
    category    : ItemCategory[],   // Category of this item
    events      : InfoSetGeneric    // Tags for move use
}

export interface IItemInfo {
    id          : number,       // Numerical ID of the item
    name        : string,       // Name of the item
    description : DescBlock[]   // Formattable description of the item
}

// Generic Token
export interface ITokenBattle extends CallEvents {
    id          : number,       // Numerical ID of the token
    category    : TokenCategory[] // Category of this token
}

export interface ITokenInfo {
    id          : number,       // Numerical ID of the token
    name        : string,       // Name of the token
    description : DescBlock[]   // Formattable description of the token
}

// Behaviour
export interface IBehaviour extends BehaviourEvents {
    id          : number,       // Numerical ID of the behaviour
    name        : string,       // Name of the behaviour
    description : DescBlock[]   // Formattable descrpition of the behaviour
}

// --------------------------------- Shared ----------------------------------------------

/**
 * Used to determine what parts of the scene something can target
 */
export interface ChoiceTarget {
    target_team         : "ALL" | "ANY" | "ENEMY" | "SELF" | "TEAM",    // If something hits all things, can hit any one thing, hits any one of their things, or any one enemy thing
    target_pos          : "ALL" | "SINGLE" | "SMALL" | "MEDIUM" | "LARGE" ,    // If something a single space, or a blast area
    target_type         : "ALL" | "TERRAIN" | "MONSTER", // If something targets the terrain, the monster on it, or both
    target_direction    : "ALL" | "CARDINAL" | "ORDINAL" | "BOTH", // If the possible range is X, +, both, or anywhere within range
    target_range        : number // how many spaces from the source it can be
}

/**
 * Events that can be called by the Battle runEvent method,
 * all options components of the interfaces that ineherit them.
 */
export interface CallEvents {
    onGenericEvent? : (this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | null, target : FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | null, sourceEffect : ActiveItem | ActiveAction | WeatherEffect | FieldEffect | null, relayVar : any, trackVal : any, messageList : MessageSet, fromSource : boolean) => Promise<void>;
    onCanUsePlot? : (this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | null, relayVar : boolean, messageList : MessageSet, fromSource : boolean) => Promise<boolean>;
    onCanSwapOut? : (this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | null, relayVar : boolean, messageList : MessageSet, fromSource : boolean) => Promise<boolean>;
    onMonsterEntersField? : (this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) => Promise<void>;
    onMonsterExitsField? : (this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) => Promise<void>;
    onMonsterEntersPlot? : (this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) => Promise<void>;
    onMonsterExitsPlot? : (this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) => Promise<void>;
    onPlotEnterCost? : (this : Battle, eventSource : any, source : Plot, target : FieldedMonster, relayVar : number, messageList : MessageSet, fromSource : boolean) => Promise<number>;
}

/**
 * Events called by Trainer Bots to determine what move
 * to select.
 */
export interface BehaviourEvents {
    onGetBaseSWITCHChance? : (this : Battle, trainer : TrainerBot, relay : number) => number,
    onGetBaseITEMChance? : (this : Battle, trainer : TrainerBot, relay : number) => number,
    onGetBaseACTIONChance? : (this : Battle, trainer : TrainerBot, relay : number) => number,
    onModifySWITCHChance? : (this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) => number,
    onModifyITEMChance? : (this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) => number,
    onModifyACTIONChance? : (this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) => number,
    onModifySubSWITCHChance? : (this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) => number,
    onModifySubITEMChance? : (this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) => number,
    onModifySubACTIONChance? : (this : Battle, trainer : TrainerBot, options: BotOptions, optionSpecific : BotBehaviourWeight, relay: any) => number,
    onCullOptions? : (this : Battle, trainer : TrainerBot, options: BotOptions) => BotOptions
}

// -------------------------------- Databases --------------------------------------------

export interface SpeciesBattleTable {[speciesid: IDEntry]: ISpeciesBattle}
export interface SpeciesInfoTable {[speciesid: IDEntry]: ISpeciesInfo}
export interface SpeciesLearnsetTable {[speciesid: IDEntry]: ISpeciesLearnset}
export interface SpeciesEvolutionTable {[speciesid: IDEntry]: ISpeciesEvolution}
export interface ActionBattleTable {[actionid: IDEntry]: IActionBattle}
export interface ActionInfoTable {[actionid: IDEntry]: IActionInfo}
export interface TraitBattleTable {[traitid: IDEntry]: ITraitBattle}
export interface TraitInfoTable {[traitid: IDEntry]: ITraitInfo}
export interface WeatherBattleTable {[weatherid: IDEntry]: IWeatherBattle}
export interface WeatherInfoTable {[weatherid: IDEntry]: IWeatherInfo}
export interface FieldBattleTable {[fieldid: IDEntry]: IFieldBattle}
export interface FieldInfoTable {[fieldid: IDEntry]: IFieldInfo}
export interface ItemBattleTable {[itemid: IDEntry]: IItemBattle}
export interface ItemInfoTable {[itemid: IDEntry]: IItemInfo}
export interface TokenBattleTable {[tokenid: IDEntry]: ITokenBattle}
export interface TokenInfoTable {[tokenid: IDEntry]: ITokenInfo}
export interface BehaviourTable {[behaviourid: IDEntry]: IBehaviour}
export interface TypeChartTable {[typeID: number]: InfoSetNumber}