import { MonsterType } from "./data/enum/types";
import { ActionCategory, ItemCategory, TokenCategory, TraitCategory } from "./data/enum/categories";
import { TrainerBase } from "./classes/sim/controller/trainer/trainer_basic";
import { ActiveMonster } from "./classes/sim/models/active_monster";
import { ActiveItem } from "./classes/sim/models/active_item";
import { ActiveAction } from "./classes/sim/models/active_action";
import { ActivePos } from "./classes/sim/models/team";
import { Scene } from "./classes/sim/models/terrain/terrain_scene";
import { Side } from "./classes/sim/models/terrain/terrain_side";
import { Plot } from "./classes/sim/models/terrain/terrain_plot";
import { Battle, IBattle } from "./classes/sim/controller/battle";

// ----------------------------------- Types ---------------------------------------------

export type IDEntry = Lowercase<string>; // Used for mapping to entries on tables
export type InfoSetNumber = {[type : number]: number}; // Used for type chart matchups
export type InfoSetGeneric = {[id : IDEntry]: any}; // Generic dictionary type used for most putposes
export type MessageSet = InfoSetGeneric[]; // Collection of generically typed dictionaries

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
    dm  : number[], // The damage range, with two values [minimum, maximum]
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
    Choices     : TurnChoices,  // List of available choices
    Position    : number,       // The index of the monster these actions represent
    Battle      : IBattle       // The current state of the battle
}

/**
 * Collection of available choices in dictionary
 * format for a trainer to select from.
 */
export type TurnChoices = {
    [actiontype : string] : SelectedAction[]
}

/**
 * Base interface for possible actions that can be taken.
 */
export interface SelectedAction {
    type    : 'SWITCH' | 'ITEM' | 'ACTION' | 'NONE',    // What kind of action is being taken
    trainer : TrainerBase   // The trainer selecting this action
}

/**
 * Grouping of possible action choices for a user to select from.
 * Cannot be returned to the battle as a valid course of action.
 */
export interface SubSelectAction extends SelectedAction {
    choice  : ActiveMonster | ActiveItem | ActiveAction | ActivePos,    // The basic component the actions are derived from
    options : ItemAction[] | ActionAction[] | SwitchAction[]    // Collection of possible actions to take
}

/**
 * Action type for switching out one monster for another
 */
export interface SwitchAction extends SelectedAction {
    current : ActivePos,    // The monster currently in play to switch out
    newmon : ActiveMonster  // The monster to replace the currently in play monster with
}

/**
 * Action type for using an item
 */
export interface ItemAction extends SelectedAction {
    item    : ActiveItem,   // The item to use
    target  : number[][]    // The position(s) on the field to target with the item
}

/**
 * Action type for a monster using an action
 */
export interface ActionAction extends SelectedAction {
    source : ActivePos,     // The monster taking the action
    action : ActiveAction,  // The action to take
    target : number[][]     // The position(s) on the field to target with the action
}

// --------------------------------- Database Item ---------------------------------------

// Monster species
export interface ISpeciesBattle extends CallEvents {
    id          : number,           // Numerical ID of the monster
    type        : MonsterType[],    // Type(s) the monster possesses
    stats       : BaseStats,        // Base stats of the monster
    cost        : number            // The Star Power it takes to add the monster to a team
}

export interface ISpeciesInfo {
    id          : number,   // Numerical ID of the monster
    name        : string,   // The species' name
    subtitle    : string,   // Subtitle / category for the monster
    description : string    // Monster description
}

// Monster Action
export interface IActionBattle extends CallEvents, ChoiceTarget {
    id          : number,           // Numerical ID of the action
    type        : MonsterType,      // The elemental type of the action
    cost        : number            // The Star Power it takes to add the action to a monster
    uses        : number,           // How many times the action can be used per battle
    accuracy    : number,           // Base accuracy of a move
    damage_mod  : number,           // Modifier the action applies to the user's damage range
    category    : ActionCategory    // Category of move
}

export interface IActionInfo {
    id          : number,       // Numerical ID of the action
    name        : string,       // Name of the aciton
    description : DescBlock[]   // Formattable description of the action
}

// Monster Trait
export interface ITraitBattle extends CallEvents {
    id          : number,       // Numerical ID of the trait
    cost        : number,       // Star Power cost to add the trait to a monster
    category    : TraitCategory // Category of this trait
}

export interface ITraitInfo {
    id          : number,       // Numerical ID of the trait
    name        : string,       // Name of the trait
    description : DescBlock[]   // Formattable description of the trait
}

// Battle Item
export interface IItemBattle extends CallEvents, ChoiceTarget {
    id          : number,       // Numerical ID of the item
    cost        : number,       // Star Power cost to add the item to a team
    category    : ItemCategory  // Category of this item
}

export interface IItemInfo {
    id          : number,       // Numerical ID of the item
    name        : string,       // Name of the item
    description : DescBlock[]   // Formattable description of the item
}

// Generic Token
export interface ITokenBattle extends CallEvents {
    id          : number,       // Numerical ID of the token
    category    : TokenCategory // Category of this token
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
    team_target : "ALL" | "ANY" | "ENEMY" | "SELF" | "TEAM",    // If something hits all things, can hit any one thing, hits any one of their things, or any one enemy thing
    pos_target  : "ALL" | "SINGLE" | "SIDE",    // If something hits a Scene, Side, or Plot
    type_target : "ALL" | "TERRAIN" | "MONSTER" // If something targets the terrain, the monster on it, or both
}

/**
 * Events that can be called by the Battle runEvent method,
 * all options components of the interfaces that ineherit them.
 */
export interface CallEvents {
    onCanUseMove? : (this: Battle, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos | Scene | Side | Plot, source : ActivePos, sourceEffect: ActiveAction, relayVar: any, fromSource: boolean) => true | false;
    onCanUseItem? : (this: Battle, trainer : TrainerBase, trainerTarget : TrainerBase, source : TrainerBase, sourceEffect: ActiveItem, relayVar: any, fromSource: boolean) => true | false;
}

/**
 * Events called by Trainer Bots to determine what move
 * to select.
 */
export interface BehaviourEvents {
}

// -------------------------------- Databases --------------------------------------------

export interface SpeciesBattleTable {[speciesid: IDEntry]: ISpeciesBattle}
export interface SpeciesInfoTable {[speciesid: IDEntry]: ISpeciesInfo}
export interface ActionBattleTable {[actionid: IDEntry]: IActionBattle}
export interface ActionInfoTable {[actionid: IDEntry]: IActionInfo}
export interface TraitBattleTable {[traitid: IDEntry]: ITraitBattle}
export interface TraitInfoTable {[traitid: IDEntry]: ITraitInfo}
export interface ItemBattleTable {[itemid: IDEntry]: IItemBattle}
export interface ItemInfoTable {[itemid: IDEntry]: IItemInfo}
export interface TokenBattleTable {[tokenid: IDEntry]: ITokenBattle}
export interface TokenInfoTable {[tokenid: IDEntry]: ITokenInfo}
export interface BehaviourTable {[behaviourid: IDEntry]: IBehaviour}
export interface TypeChartTable {[typeID: number]: InfoSetNumber}