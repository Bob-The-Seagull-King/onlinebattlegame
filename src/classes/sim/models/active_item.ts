import { IDEntry, InfoSetGeneric } from "../../../global_types"

/**
 * Interface of the Item object
 */
interface IActiveItem {
    item        : IDEntry,          // The type of the action
    used        : boolean,          // How many times the action has been used
    trackers    : InfoSetGeneric    // Used generically to track battle information
}

class ActiveItem {

    public Item     : IDEntry;          // The type of the action
    public Used     : boolean;          // How many times the action has been used
    public Trackers : InfoSetGeneric;   // Used generically to track battle information

    /**
     * Simple constructor
     * @param _data The interface representing the item
     */
    constructor(_data : IActiveItem) {
        this.Item = _data.item;
        this.Used = _data.used;
        this.Trackers = _data.trackers;
    }

    /**
     * Given an ActiveItem object, give us the IActiveItem
     * @returns the IActiveItem reflecting this item
     */
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