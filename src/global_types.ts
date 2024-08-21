import { MonsterType } from "./data/enum/types";
import { ActionCategory, ItemCategory, TokenCategory, TraitCategory } from "./data/enum/categories";

// ----------------------------------- Types ---------------------------------------------

// Used for mapping tables
export type IDEntry = Lowercase<string>;
export type InfoSetNumber = {[type : number]: number};
export type InfoSetGeneric = {[id : IDEntry]: any};

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
export interface IActionBattle extends CallEvents {
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
export interface IItemBattle extends CallEvents {
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

// Parent interface with all events that can be called
export interface CallEvents {
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
export interface TypeChartTable {[typeID: number]: InfoSetNumber}