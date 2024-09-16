import { IDEntry } from "../../../global_types";
import { ActiveItem, IActiveItem } from "../models/active_item";
import { Team } from "../models/team";

class ItemFactory {
    
    /**
     * Return an ActiveItem object from the Interface equivilent
     * @param _item the item interface
     * @returns a new ActiveItem object
     */
    public static CreateItem(_item : IActiveItem, _owner : Team) {
        const newAction = new ActiveItem(_item, _owner);
        return newAction;
    }

    /**
     * Creates a default instance of an item based on the
     * item ID/name.
     * @param _item the item's name'
     * @returns a new ActiveItem object
     */
    public static CreateNewItem(_item : IDEntry, _owner : Team ) {
        const freshAction : IActiveItem = {
            item: _item,
            used: false
        }
        return ItemFactory.CreateItem(freshAction, _owner);
    }

}

export {ItemFactory}