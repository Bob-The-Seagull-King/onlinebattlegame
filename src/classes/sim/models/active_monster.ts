import { BaseStats, IDEntry, InfoSetGeneric } from "../../../global_types"
import { ActionFactory } from "../factories/action_factory";
import { IActiveAction, ActiveAction } from "./active_action"

/**
 * Interface of the Monster object
 */
interface IActiveMonster {
    species     : IDEntry,          // The species of the monster
    nickname    : string,           // A nickname that a monster displays instead of the species name
    actions     : IDEntry[],        // The actions a monster has been equipped with
    traits      : IDEntry[],        // The traits a monster has been equipped with
    boosts      : BaseStats,        // The boosts to stats a monster has been equipped with
    tokens      : IDEntry[],        // Any tokens (conditions or statuses) a monster currently has
    trackers    : InfoSetGeneric,   // Used generically to track battle information (such as the number of turns a token has remianing)
    hp_cur      : number,           // The current Health of the monster
    actions_cur : IActiveAction[]   // The current state of the monster's moves
}

class ActiveMonster {

    public Species          : IDEntry;          // The species of the monster
    public Nickname         : string;           // A nickname that a monster displays instead of the species name
    public Actions          : IDEntry[];        // The actions a monster has been equipped with
    public Traits           : IDEntry[];        // The traits a monster has been equipped with
    public Boosts           : BaseStats;        // The boosts to stats a monster has been equipped with
    public Tokens           : IDEntry[];        // Any tokens (conditions or statuses) a monster currently has
    public Trackers         : InfoSetGeneric;   // Used generically to track battle information (such as the number of turns a token has remianing)
    public HP_Current       : number;           // The current Health of the monster
    public Actions_Current  : ActiveAction[];   // The current state of the monster's moves

    /**
     * Simple constructor
     * @param _data The interface representing the monster
     */
    constructor (_data : IActiveMonster) {
        this.Species = _data.species;
        this.Nickname = _data.nickname;
        this.Actions = _data.actions;
        this.Traits = _data.traits;
        this.Boosts = _data.boosts;
        this.Tokens = _data.tokens;
        this.Trackers = _data.trackers;
        this.HP_Current = _data.hp_cur;
        this.Actions_Current = this.ActionGenerator(_data.actions_cur);
    }

    /**
     * Converts the IActiveActions to usable ActiveAction
     * objects.
     * @param _actions List of actions to recreate
     * @returns Array of ActiveAction objects
     */
    private ActionGenerator(_actions : IActiveAction[]) {
        const ActionList : ActiveAction[] = [];
        let i = 0;
        for (i = 0; i < _actions.length; i++) {
            ActionList.push(ActionFactory.CreateAction(_actions[i]))
        }
        return ActionList;
    }

    /**
     * Pushes a new action to the monster based on an ID.
     * @param _action The ID/name of the action to add
     */
    public AddFreshAction(_action : IDEntry) {
        this.Actions.push(_action);
        const NewAction = ActionFactory.CreateNewAction(_action);
        this.Actions_Current.push(NewAction)
    }

    /**
     * Given an ActiveMonster object, give us the
     * IActiveAction, with all child objects also converted
     * into their respective interfaces
     * @returns the IActiveAction reflecting this monster
     */
    public ConvertToInterface() {
        const _actions : IActiveAction[] = []
        this.Actions_Current.forEach(item => {
            _actions.push(item.ConvertToInterface())
        })
            
        const _interface : IActiveMonster = {
            species     : this.Species,
            nickname    : this.Nickname, 
            actions     : this.Actions,
            traits      : this.Traits, 
            boosts      : this.Boosts, 
            tokens      : this.Tokens, 
            trackers    : this.Trackers,
            hp_cur      : this.HP_Current, 
            actions_cur : _actions
        }
        return _interface;
    }

}

export {IActiveMonster, ActiveMonster}