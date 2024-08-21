import { IDEntry } from "../../../global_types";
import { ActiveAction, IActiveAction } from "../models/active_action";
import { ActiveMonster } from "../models/active_monster";

class ActionFactory {

    public static CreateAction(_action : IActiveAction, _owner : ActiveMonster) {
        const newAction = new ActiveAction(_action);
        return newAction;
    }

    public static CreateNewAction(_action : IDEntry, _owner : ActiveMonster) {
        const freshAction : IActiveAction = {
            action: _action,
            used: 0,
            trackers: {}
        }
        return ActionFactory.CreateAction(freshAction, _owner);
    }

}

export {ActionFactory}