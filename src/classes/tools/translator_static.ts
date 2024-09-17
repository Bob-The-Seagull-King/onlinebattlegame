import { ActionInfoDex } from "../../data/static/action/action_inf";
import { ItemInfoDex } from "../../data/static/item/item_inf";
import { ActionAction, ItemAction, SelectedAction } from "../../global_types";
import { IBattle } from "../sim/controller/battle";

/**
 * Given a battle and a position on that battlefield, return
 * a string naming each target (the monster).
 * @param _battle the current state of the battle
 * @param _positions the list of target positions
 * @returns string naming all targets
 */
function GetTargetName(_battle : IBattle, _positions : number[][]) {
    let targets = "";

    if (_positions.length <= 0) {
        targets += "the whole battle"
    }

    return targets
}

// ---------------------------------------------- Action Selection / Performance -------------------------------------
export interface ActionTranslate {
    selectOption: (_switch : SelectedAction, _battle : IBattle) => string;
    performedOption: (_switch : SelectedAction, _battle : IBattle) => string;
}

export interface ActionTranslateTable {[moveid: Lowercase<string>]: ActionTranslate}

export const ActionTranslateDex : ActionTranslateTable = {
    item : {
        // Using an Item
        selectOption(_switch : ItemAction, _battle : IBattle) {
            return  "Use the item " + " on " + ".";
        },
        performedOption(_switch : ItemAction, _battle : IBattle) {
            return  " used the item " + " on " + ".";
        }
    },
    action : {
        // Having a Monster use an Action
        selectOption(_switch : ActionAction, _battle : IBattle) {
            return "Have  use the move " + " on " + ".";
        },
        performedOption(_switch : ActionAction, _battle : IBattle) {
            return  " had " + " use the move " + " on " + ".";
        }
    },
    switch : {
        // Swapping one Monster for another Monster
        selectOption(_switch : SelectedAction, _battle : IBattle) {
            return "Switch out "
        },
        performedOption(_switch : SelectedAction, _battle : IBattle) {
            return " had  switch out for " 
        }
    },
    none : {
        // Doing nothing for this turn
        selectOption(_switch : SelectedAction, _battle : IBattle) {
            return "Skip your turn.";
        },
        performedOption(_switch : SelectedAction, _battle : IBattle) {
            return " skipped their turn.";
        }
    }
}

// -------------------------------------------------------------------------------------------------------------------