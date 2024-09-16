import { MonsterType } from "./data/enum/types";
import { ActionCategory, ItemCategory, TokenCategory, TraitCategory } from "./data/enum/categories";
import { TrainerBase } from "./classes/sim/controller/trainer/trainer_basic";
import { ActiveMonster } from "./classes/sim/models/active_monster";
import { ActiveItem } from "./classes/sim/models/active_item";
import { ActiveAction } from "./classes/sim/models/active_action";
import { FieldedMonster } from "./classes/sim/models/team";
import { Scene } from "./classes/sim/models/terrain/terrain_scene";
import { Plot } from "./classes/sim/models/terrain/terrain_plot";
import { Battle, IBattle } from "./classes/sim/controller/battle";
import { TrainerBot } from "./classes/sim/controller/trainer/trainer_bot";

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
    type    : 'SWITCH' | 'ITEM' | 'ACTION' | 'NONE',    // What kind of action is being taken
    trainer : TrainerBase   // The trainer selecting this action
}

/**
 * Grouping of possible action choices for a user to select from.
 * Cannot be returned to the battle as a valid course of action.
 */
export interface SubSelectAction extends SelectedAction {
    choice  : ActiveMonster | ActiveItem | ActiveAction | FieldedMonster,    // The basic component the actions are derived from
    options : SelectedAction[]    // Collection of possible actions to take
}

/**
 * Action type for switching out one monster for another
 */
export interface SwitchAction extends SelectedAction {
    current : FieldedMonster,    // The monster currently in play to switch out
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
    source : FieldedMonster,     // The monster taking the action
    action : ActiveAction,  // The action to take
    target : number[][]     // The position(s) on the field to target with the action
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
    onCanUseMove? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect: ActiveAction, relayVar: any, messageList: MessageSet, fromSource: boolean) => true | false; // If a monster is able to use a move
    onCanUseItem? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, source : TrainerBase, sourceEffect: ActiveItem, relayVar: any, messageList: MessageSet, fromSource: boolean) => true | false; // If a trainer is able to use an item
    onAttemptSwitch? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster, source : FieldedMonster, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // If the monster is prevented from switching for any reason
    onAttemptItemAtAll? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // If the item cannot be used at all, because of any one target
    onAttemptItem? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // If the item can be used generally, but not on the specific target
    onAttemptActionAtAll? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // If the item cannot be used at all, because of any one target
    onAttemptAction? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // If the action can be used generally, but not on the specific target
    onGetHitMaximum? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) => boolean; // Modify the highest number of times a move can hit
    onGetHitMinimum? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) => boolean; // Modify the lowest number of times a move can hit   
    onSkipDamageMods? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Check if you can skip the regular damage modifiers
    onSkipDamageChanges? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Check if you can skip all other damage modifiers  
    onSkipDamageDealProtection? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Check if you can skip the damage dealt protection mod
    onSkipDamageDealModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Check if you can skip the damage dealt modifiers
    onSkipDamageDealAll? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Check if you can skip the changes to damage dealt
    onSkipHealModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Check if you can skip the damage healed modifiers
    onSkipHealAll? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Check if you can skip the changes to damage recovered
    onModifyDrainVal? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Modify the percentage of damage dealt that a monster recovers
    onReturnHealVal? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Return the amount of HP to heal
    onAfterDealingDamage? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) => void; // After Dealing Damage
    onAfterKnockOut? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) => void; // When a foe is knocked out by a move
    onAfterHealingDamage? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) => void; // After Healing Damage
    onGetActionAccuracy? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // Get the modified accuracy of the action   
    onGetAccuracyModifier? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Get a mulitplier to modify the final accuracy
    onActionMiss? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) => boolean; // Triggers when an action misses
    onEffectApply? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, trackVal: string, messageList: MessageSet, fromSource: boolean) => void; // Triggers when an effect applies
    onDealCustomDamage? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) => number; // Get total damage to deal when the action uses a special case
    onConsumeActionUses? : (this: Battle, eventSource : any, trainer : TrainerBase, source : FieldedMonster, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => boolean; // If the action can be used generally, but not on the specific target
    onItemOnApply? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) => void; // Starts the action by applying it to one of the targets
    onGetProtectionModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase | FieldedMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the defending monster's protection
    onGetDamageTakenModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the defending monster's incoming damage
    onGetDamageRangeModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase | FieldedMonster, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the attacking modifiers range of damage
    onGetDamageDealtModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the attacking monster's damage dealt
    onGetSkillBaseModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase | FieldedMonster, sourceEffect : ActiveAction, relayVar: number, trackVal: string, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the action's base effect chance
    onGetSkillAllModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase | FieldedMonster, sourceEffect : ActiveAction, relayVar: number, trackVal: string, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the skills effect chance
    onGetSkillResistModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase | FieldedMonster, sourceEffect : ActiveAction, relayVar: number, trackVal: string, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the chance to resist
    onModifyFinalSkillChance? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase | FieldedMonster, sourceEffect : ActiveAction, relayVar: number, trackVal: string, messageList: MessageSet, fromSource: boolean) => number; // Modify the final chance for a skill to trigger
    onGetFinalDamage? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Modify the final damage taken
    onWhenKnockedOut? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase, messageList: MessageSet, fromSource: boolean) => void; // If the target is knocked out by damage (generic)
    onGetFinalDamageDealt? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : FieldedMonster, sourceEffect : ActiveAction | ActiveItem, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Modify the final damage outputted
    onGetDamageRecoveredModifiers? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Get any additional modifiers for the recovering monster's incoming hp
    onGetFinalRecovery? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Plot, source : TrainerBase, relayVar: number, messageList: MessageSet, fromSource: boolean) => number; // Modify the final hp recovered
    onRunActionEvents? : (this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | FieldedMonster | Scene | Plot, source : TrainerBase | FieldedMonster, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) => void; // Run any Effects that an action has
    onSwitchOut? : (this: Battle, eventSource : any, trainer : TrainerBase, source : FieldedMonster, messageList: MessageSet, fromSource: boolean) => void;
    onSwitchIn? : (this: Battle, eventSource : any, trainer : TrainerBase, source : FieldedMonster, messageList: MessageSet, fromSource: boolean) => void
    onRoundEnd? : (this: Battle, eventSource : any, trainer : TrainerBase, source : FieldedMonster, messageList: MessageSet, fromSource: boolean) => void
    onGetStatModdl? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatModdh? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatModpt? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatModsp? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatModsk? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatModrs? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatModac? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatFinalsp? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatFinalac? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatFinalsk? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatFinalrs? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
    onGetStatFinalpt? : (this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) => number
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
export interface ItemBattleTable {[itemid: IDEntry]: IItemBattle}
export interface ItemInfoTable {[itemid: IDEntry]: IItemInfo}
export interface TokenBattleTable {[tokenid: IDEntry]: ITokenBattle}
export interface TokenInfoTable {[tokenid: IDEntry]: ITokenInfo}
export interface BehaviourTable {[behaviourid: IDEntry]: IBehaviour}
export interface TypeChartTable {[typeID: number]: InfoSetNumber}