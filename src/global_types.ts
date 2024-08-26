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

// Used for mapping tables
export type IDEntry = Lowercase<string>;
export type InfoSetNumber = {[type : number]: number};
export type InfoSetGeneric = {[id : IDEntry]: any};
export type MessageSet = {[id : IDEntry]: any}[];

export type DescBlock = {
    cat : string,
    text : string
}

export type BaseStats = {
    hp  : number,
    dm  : number[],
    ac  : number,
    pt  : number,
    sk  : number,
    rs  : number,
    sp  : number
}

// --------------------------------- Constants -------------------------------------------


// --------------------------------- Interface -------------------------------------------

export type TurnSelect = {
    Choices : TurnChoices,
    Position : number,
    Battle  : IBattle
}

export type TurnChoices = {
    [actiontype : string] : SelectedAction[]
}

export interface SelectedAction {
    type    : 'SWITCH' | 'ITEM' | 'ACTION' | 'NONE',
    trainer : TrainerBase
}

export interface SubSelectAction extends SelectedAction {
    choice  : ActiveMonster | ActiveItem | ActiveAction | ActivePos,
    options : ItemAction[] | ActionAction[] | SwitchAction[]
}

export interface SwitchAction extends SelectedAction {
    current : ActivePos,
    newmon : ActiveMonster
}

export interface ItemAction extends SelectedAction {
    item    : ActiveItem,
    target  : number[][]
}

export interface ActionAction extends SelectedAction {
    source : ActivePos,
    action : ActiveAction,
    target : number[][]
}

// Species
export interface ISpeciesBattle extends CallEvents {
    id          : number,
    type        : MonsterType[],
    stats       : BaseStats,
    cost        : number
}

export interface ISpeciesInfo {
    id          : number,
    name        : string,
    subtitle    : string,
    description : string
}

// Action
export interface IActionBattle extends CallEvents, ChoiceTarget {
    id          : number,
    type        : MonsterType,
    cost        : number
    uses        : number,
    accuracy    : number,
    damage_mod  : number,
    category    : ActionCategory
}

export interface IActionInfo {
    id          : number,
    name        : string,
    description : DescBlock[]
}

// Trait
export interface ITraitBattle extends CallEvents {
    id          : number,
    cost        : number,
    category    : TraitCategory
}

export interface ITraitInfo {
    id          : number,
    name        : string,
    description : DescBlock[]
}

// Item
export interface IItemBattle extends CallEvents, ChoiceTarget {
    id          : number,
    cost        : number,
    category    : ItemCategory
}

export interface IItemInfo {
    id          : number,
    name        : string,
    description : DescBlock[]
}

// Token
export interface ITokenBattle extends CallEvents {
    id          : number,
    category    : TokenCategory
}

export interface ITokenInfo {
    id          : number,
    name        : string,
    description : DescBlock[]
}

// Behaviour
export interface IBehaviour extends BehaviourEvents {
    id          : number
}

// Parent interface with all events that can be called
export interface ChoiceTarget {
    team_target : "ALL" | "ANY" | "ENEMY" | "SELF" | "TEAM",
    pos_target  : "ALL" | "SINGLE" | "SIDE",
    type_target : "ALL" | "TERRAIN" | "MONSTER"
}

export interface CallEvents {
    onCanUseMove? : (this: Battle, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos | Scene | Side | Plot, source : ActivePos, sourceEffect: ActiveAction, relayVar: any, fromSource: boolean) => true | false;
    onCanUseItem? : (this: Battle, trainer : TrainerBase, trainerTarget : TrainerBase, source : TrainerBase, sourceEffect: ActiveItem, relayVar: any, fromSource: boolean) => true | false;
}

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