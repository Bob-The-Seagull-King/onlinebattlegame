import { IDEntry } from "../../../global_types";
import { ActiveAction, IActiveAction } from "../models/active_action";
import { ActiveMonster } from "../models/active_monster";

class ActionFactory {

    /**
     * Return an ActiveAction object from the Interface equivilent
     * @param _action the active action interface
     * @returns a new ActiveAction object
     */
    public static CreateAction(_action : IActiveAction, _owner : ActiveMonster) {
        const newAction = new ActiveAction(_action, _owner);
        return newAction;
    }

    /**
     * Creates a default instance of an action based on the
     * action's ID/name.
     * @param _action the name of the action
     * @returns a new ActiveAction object
     */
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