import { IDEntry, InfoSetGeneric } from "../../../global_types"
import { Team } from "./team";

/**
 * Interface of the Item object
 */
interface IActiveItem {
    item        : IDEntry,          // The type of the action
    used        : boolean,          // How many times the action has been used
}

class ActiveItem {

    public Item     : IDEntry;          // The type of the action
    public Used     : boolean;          // How many times the action has been used
    public Owner    : Team;

    /**
     * Simple constructor
     * @param _data The interface representing the item
     */
    constructor(_data : IActiveItem, _owner : Team) {
        this.Item = _data.item;
        this.Used = _data.used;
        this.Owner = _owner;
    }

    /**
     * Given an ActiveItem object, give us the IActiveItem
     * @returns the IActiveItem reflecting this item
     */
    public ConvertToInterface() {
        const _interface : IActiveItem = {
            item        : this.Item,
            used        : this.Used
        }
        return _interface;
    }

}

export {IActiveItem, ActiveItem}