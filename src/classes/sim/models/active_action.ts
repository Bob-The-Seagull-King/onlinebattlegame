import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { IDEntry, InfoSetGeneric } from "../../../global_types"
import { Battle } from "../controller/battle";
import { ActiveMonster } from "./active_monster";

/**
 * Interface of the Action object
 */
interface IActiveAction {
    action     : IDEntry,       // The type of the action
    used       : number,        // How many times the action has been used
}

class ActiveAction {

    public Action   : IDEntry;          // The name of the action found in the database
    public Used     : number;           // How many times this action has been used so far
    public Owner    : ActiveMonster;

    /**
     * Simple constructor
     * @param _data The interface representing the action
     */
    constructor(_data : IActiveAction, _monster : ActiveMonster) {
        this.Action = _data.action;
        this.Used = _data.used;
        this.Owner = _monster;
    }

    /**
     * Given an ActiveAction object, give us the IActiveAction
     * @returns the IActiveAction reflecting this action
     */
    public ConvertToInterface() {
        const _interface : IActiveAction = {
            action: this.Action,
            used: this.Used
        }
        return _interface;
    }

    /**
     * Checks if the move has been used less times than
     * the action can be used in one battle.
     * @returns true if there are uses remaining
     */
    public HasUsesRemaining() {
        return (this.Used < ActionBattleDex[this.Action].uses)
    }

    /**
     * Increases the number of uses for an action
     */
    public UseActionUp() {
        this.Used += 1;
    }

}

export {IActiveAction, ActiveAction}