import { IDEntry, InfoSetGeneric } from "../../../global_types"
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
    public Owner    : ActiveMonster;    // The monster that has this action

    /**
     * Simple constructor
     * @param _data The interface representing the action
     */
    constructor(_data : IActiveAction) {
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

}

export {IActiveAction, ActiveAction}