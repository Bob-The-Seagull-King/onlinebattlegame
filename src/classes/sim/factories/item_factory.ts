import { IDEntry } from "../../../global_types";
import { ActiveItem, IActiveItem } from "../models/active_item";

class ItemFactory {
    
    /**
     * Return an ActiveItem object from the Interface equivilent
     * @param _item the item interface
     * @returns a new ActiveItem object
     */
    public static CreateItem(_item : IActiveItem) {
        const newAction = new ActiveItem(_item);
        return newAction;
    }

    /**
     * Creates a default instance of an item based on the
     * item ID/name.
     * @param _item the item's name'
     * @returns a new ActiveItem object
     */
    public static CreateNewAction(_item : IDEntry) {
        const freshAction : IActiveItem = {
            item: _item,
            used: false,
            trackers: {}
        }
        return ItemFactory.CreateItem(freshAction);
    }

}

export {ItemFactory}