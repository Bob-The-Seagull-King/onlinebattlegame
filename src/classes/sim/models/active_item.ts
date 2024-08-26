import { IDEntry, InfoSetGeneric } from "../../../global_types"

interface IActiveItem {
    item     : IDEntry, // The type of the action
    used       : boolean, // How many times the action has been used
    trackers   : InfoSetGeneric // Used generically to track battle information (such as if the move is charging)
}

class ActiveItem {
    public Item : IDEntry;
    public Used : boolean;
    public Trackers : InfoSetGeneric;

    constructor(_data : IActiveItem) {
        this.Item = _data.item;
        this.Used = _data.used;
        this.Trackers = _data.trackers;
    }

    public ConvertToInterface() {
        const _interface : IActiveItem = {
            item        : this.Item,
            used        : this.Used,
            trackers    : this.Trackers,
        }
        return _interface;
    }

}

export {IActiveItem, ActiveItem}