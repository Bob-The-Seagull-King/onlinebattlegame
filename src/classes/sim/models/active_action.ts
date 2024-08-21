import { IDEntry, InfoSetGeneric } from "../../../global_types"

interface IActiveAction {
    action     : IDEntry, // The type of the action
    used       : number, // How many times the action has been used
    trackers   : InfoSetGeneric // Used generically to track battle information (such as if the move is charging)
}

class ActiveAction {
    public Action : IDEntry;
    public Used : number;
    public Trackers : InfoSetGeneric;

    constructor(_data : IActiveAction) {
        this.Action = _data.action;
        this.Used = _data.used;
        this.Trackers = _data.trackers;
    }

}

export {IActiveAction, ActiveAction}