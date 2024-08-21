import { IDEntry } from "../../../global_types";
import { ActiveItem, IActiveItem } from "../models/active_item";

class ItemFactory {

    public static CreateItem(_item : IActiveItem) {
        const newAction = new ActiveItem(_item);
        return newAction;
    }

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