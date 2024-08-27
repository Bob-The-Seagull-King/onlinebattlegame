import { ActionInfoDex } from "../../data/static/action/action_inf";
import { ItemInfoDex } from "../../data/static/item/item_inf";
import { ActionAction, ItemAction, SelectedAction, SwitchAction } from "../../global_types";
import { IBattle } from "../sim/controller/battle";

export interface ActionTranslate {
    // postSearch: (model : ViewCollectionsModel) => void;
    selectOption: (_switch : SelectedAction, _battle : IBattle) => string;
    performedOption: (_switch : SelectedAction, _battle : IBattle) => string;
}

export interface ActionTranslateTable {[moveid: Lowercase<string>]: ActionTranslate}

function GetTargetName(_battle : IBattle, _positions : number[][]) {
    let targets = "";

    if (_positions.length <= 0) {
        targets += "the whole battle"
    }
    _positions.forEach(item => {
        if (item.length === 1) {
            targets += " (side) " + _battle.trainers[item[0]].name
        } else if (item.length === 2) {
            targets += " (monster) " + _battle.trainers[item[0]].team.monsters[_battle.trainers[item[0]].team.active[item[1]].position].nickname
        }
    })

    return targets
}

export const ActionTranslateDex : ActionTranslateTable = {
    item : {
        selectOption(_switch : ItemAction, _battle : IBattle) {
            return  "Use the item " + ItemInfoDex[_switch.item.Item].name + " on " + GetTargetName(_battle, _switch.target) + ".";
        },
        performedOption(_switch : ItemAction, _battle : IBattle) {
            return  _switch.trainer.Name + " used the item " + ItemInfoDex[_switch.item.Item].name + " on " + GetTargetName(_battle, _switch.target) + ".";
        }
    },
    action : {
        selectOption(_switch : ActionAction, _battle : IBattle) {
            return "Have " + _switch.source.Monster.Nickname + " use the move " + ActionInfoDex[_switch.action.Action].name + " on " + GetTargetName(_battle, _switch.target) + ".";
        },
        performedOption(_switch : ActionAction, _battle : IBattle) {
            return  _switch.trainer.Name + " had " + _switch.source.Monster.Nickname + " use the move " + ActionInfoDex[_switch.action.Action].name + " on " + GetTargetName(_battle, _switch.target) + ".";
        }
    },
    switch : {
        selectOption(_switch : SwitchAction, _battle : IBattle) {
            return "Switch out " + _switch.current.Monster.Nickname + " for " + _switch.newmon.Nickname;
        },
        performedOption(_switch : SwitchAction, _battle : IBattle) {
            return _switch.trainer.Name + " had " + _switch.current.Monster.Nickname + " switch out for " + _switch.newmon.Nickname;
        }
    },
    none : {
        selectOption(_switch : SelectedAction, _battle : IBattle) {
            return "Skip your turn.";
        },
        performedOption(_switch : SelectedAction, _battle : IBattle) {
            return _switch.trainer.Name + " skipped their turn.";
        }
    }
}