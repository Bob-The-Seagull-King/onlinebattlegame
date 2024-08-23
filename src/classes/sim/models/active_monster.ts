import { BaseStats, IDEntry, InfoSetGeneric } from "../../../global_types"
import { ActionFactory } from "../factories/action_factory";
import { IActiveAction, ActiveAction } from "./active_action"

interface IActiveMonster {
    species     : IDEntry, // The species of the monster
    nickname    : string, // A nickname that a monster displays instead of the species name
    actions     : IDEntry[], // The actions a monster has been equipped with
    traits      : IDEntry[], // The traits a monster has been equipped with
    boosts      : BaseStats, // The boosts to stats a monster has been equipped with
    tokens      : IDEntry[], // Any tokens (conditions or statuses) a monster currently has
    trackers    : InfoSetGeneric, // Used generically to track battle information (such as the number of turns a token has remianing)
    hp_cur      : number, // The current Health of the monster
    actions_cur : IActiveAction[] // The current state of the monster's moves
}

class ActiveMonster {
    public Species : IDEntry;
    public Nickname : string;
    public Actions : IDEntry[];
    public Traits : IDEntry[];
    public Boosts : BaseStats;
    public Tokens : IDEntry[];
    public Trackers : InfoSetGeneric;
    public HP_Current : number;
    public Actions_Current : ActiveAction[];

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

    private ActionGenerator(_actions : IActiveAction[]) {
        const ActionList : ActiveAction[] = [];
        let i = 0;
        for (i = 0; i < _actions.length; i++) {
            ActionList.push(ActionFactory.CreateAction(_actions[i]))
        }
        return ActionList;
    }

    public AddFreshAction(_action : IDEntry) {
        this.Actions.push(_action);
        const NewAction = ActionFactory.CreateNewAction(_action);
        this.Actions_Current.push(NewAction)
    }

}

export {IActiveMonster, ActiveMonster}