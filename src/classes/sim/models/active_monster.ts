import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { BaseStats, IDEntry, InfoSetGeneric, MessageSet } from "../../../global_types"
import { Battle } from "../controller/battle";
import { TrainerBase } from "../controller/trainer/trainer_basic";
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
            ActionList.push(ActionFactory.CreateAction(_actions[i], this))
        }
        return ActionList;
    }

    /**
     * Pushes a new action to the monster based on an ID.
     * @param _action The ID/name of the action to add
     */
    public AddFreshAction(_action : IDEntry) {
        this.Actions.push(_action);
        const NewAction = ActionFactory.CreateNewAction(_action, this);
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

    /**
     * Gets the species of a monster, accounting for potential
     * evolutions.
     * @returns The current species to reference
     */
    public GetSpecies() {
        if (this.Trackers["evolution"]) {
            return this.Trackers["evolution"];
        } else {
            return this.Species;
        }
    }

    /**
     * Return the base stat value by species
     * @param _stat the stat to get
     * @returns number reflecting the stat, defaults to 0
     * if the stat parameter isn't valid.
     */
    public GetStat(_stat : string) {
        switch (_stat) {
            case "hp": { return SpeciesBattleDex[this.GetSpecies()].stats.hp; }
            case "dl": { return SpeciesBattleDex[this.GetSpecies()].stats.dl; }
            case "dh": { return SpeciesBattleDex[this.GetSpecies()].stats.dh; }
            case "ac": { return SpeciesBattleDex[this.GetSpecies()].stats.ac; }
            case "pt": { return SpeciesBattleDex[this.GetSpecies()].stats.pt; }
            case "rs": { return SpeciesBattleDex[this.GetSpecies()].stats.rs; }
            case "sk": { return SpeciesBattleDex[this.GetSpecies()].stats.sk; }
            case "sp": { return SpeciesBattleDex[this.GetSpecies()].stats.sp; }
            default: { return 0; }
        }
    }

    /**
     * Return the number of boosts applied to a monster's stat
     * @param _stat the stat to check
     * @returns number reflecting the stat boost, defaults to 0
     * if the stat parameter isn't valid.
     */
    public GetStatBoost(_stat : string) {
        switch (_stat) {
            case "hp": { return this.Boosts.hp; }
            case "dl": { return this.Boosts.dl; }
            case "dh": { return this.Boosts.dh; }
            case "ac": { return this.Boosts.ac; }
            case "pt": { return this.Boosts.pt; }
            case "rs": { return this.Boosts.rs; }
            case "sk": { return this.Boosts.sk; }
            case "sp": { return this.Boosts.sp; }
            default: { return 0; }
        }
    }

    /**
     * Deal damage to a monster's HP, and check if the monster
     * is still alive.
     * @param _dmg the amount of damage to apply
     * @param _messageList message list to apply messages to
     */
    public TakeDamage(_dmg : number, _messageList : MessageSet) {
        let DmgTrack = _dmg;
        if (_dmg > this.HP_Current) { DmgTrack = this.HP_Current }
        _messageList.push({ "generic" : this.Nickname + " took " + DmgTrack + " damage!"})

        this.HP_Current -= _dmg;
        if (this.HP_Current < 0) { this.HP_Current = 0}
        if (this.HP_Current <= 0) {
            _messageList.push({ "generic" : this.Nickname + " was Knocked Out!"})
        }

        return DmgTrack;
    }

    /**
     * Restore a monster's HP, not going over the maximum
     * @param _hp the amount of HP to recover
     * @param _messageList message list to apply messages to
     * @param _limit the monster's calculated max HP
     */
    public HealDamage(_hp : number, _messageList : MessageSet, _limit : number) {
        let HPTrack = _hp;
        if (HPTrack + this.HP_Current > _limit) { HPTrack = _limit - this.HP_Current }
        _messageList.push({ "generic" : this.Nickname + " recovered " + HPTrack + " HP!"})
        
        this.HP_Current += _hp;
        if (this.HP_Current > _limit) { this.HP_Current = _limit}

        return HPTrack;
    }

}

export {IActiveMonster, ActiveMonster}