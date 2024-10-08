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
    trackers   : InfoSetGeneric // Used generically to track battle information (such as if the action is charging)
}

class ActiveAction {

    public Action   : IDEntry;          // The name of the action found in the database
    public Used     : number;           // How many times this action has been used so far
    public Trackers : InfoSetGeneric;   // Misc trackers for using this action

    /**
     * Simple constructor
     * @param _data The interface representing the action
     */
    constructor(_data : IActiveAction, _monster : ActiveMonster) {
        this.Action = _data.action;
        this.Used = _data.used;
        this.Trackers = _data.trackers;
    }

    /**
     * Given an ActiveAction object, give us the IActiveAction
     * @returns the IActiveAction reflecting this action
     */
    public ConvertToInterface() {
        const _interface : IActiveAction = {
            action: this.Action,
            used: this.Used,
            trackers: this.Trackers
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

    
    public GetOwner(_battle : Battle) {
        
        for (let i = 0; i < _battle.Trainers.length; i++) {
            for (let j = 0; j < _battle.Trainers[i].Team.Monsters.length; j++) {
                for (let k = 0; k < _battle.Trainers[i].Team.Monsters[j].Actions_Current.length; k++) {
                    if (this === _battle.Trainers[i].Team.Monsters[j].Actions_Current[k]) {
                        return _battle.Trainers[i].Team.Monsters[j];
                    }
                }
            }
        }
        return null;
    }

}

export {IActiveAction, ActiveAction}