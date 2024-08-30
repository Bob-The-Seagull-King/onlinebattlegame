import { TypeMatchup } from "../../../data/enum/types";
import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { ItemInfoDex } from "../../../data/static/item/item_inf";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { ActionAction, IDEntry, ItemAction, MessageSet, SelectedAction, SwitchAction, TargetSet } from "../../../global_types";
import { ActiveItem } from "../models/active_item";
import { ActiveMonster } from "../models/active_monster";
import { ActivePos } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { Scene } from "../models/terrain/terrain_scene";
import { Side } from "../models/terrain/terrain_side";
import { Battle } from "./battle"
import { TrainerBase } from "./trainer/trainer_basic";

class BattleEvents {

    public Battle : Battle; // The battle that is using this Events object

    /**
     * Simple constructor
     * @param _battle the parent Battle that created this BattleEvents
     */
    constructor(_battle : Battle) {
        this.Battle = _battle;
    }

    /**
     * Once given the actions being taken by trainers, it determines the appropriate
     * order and then performs them.
     * @param _choices The actions that will be performed (or attempted) this turn of play
     * @returns boolean value deciding if the battle should continue
     */
    public runTurns(_choices : SelectedAction[]): boolean {
        const OrderedChoices : SelectedAction[] = this.orderTurns(_choices);
        
        OrderedChoices.forEach(element => {
                this.runTurn(element)
            })
        return this.Battle.IsBattleAlive();
    }

    /**
     * Perform a single action
     * @param _action The action to run
     */
    public runTurn(_action : SelectedAction) {
        if (_action.type === "SWITCH") {            
            this.performSwitch(_action as SwitchAction);
        } else if (_action.type === "ITEM") {
            this.performItem(_action as ItemAction);
        } else {
            const DuplicateAction : SelectedAction = _action 
            DuplicateAction.trainer = new TrainerBase({ team : DuplicateAction.trainer.Team.ConvertToInterface(), pos : DuplicateAction.trainer.Position, name: DuplicateAction.trainer.Name })
            const Message : {[id : IDEntry]: any} = { "choice" : DuplicateAction}
            this.Battle.SendOutMessage([Message]);
        }
    }

    /**
     * Use an item on one or multiple monsters
     * and/or terrain pieces.
     * @param _action 
     */
    public performItem(_action : ItemAction) {
        // Prep Messages
        const Messages : MessageSet = []
        Messages.push({ "generic" : _action.trainer.Name + " used " + ItemInfoDex[_action.item.Item].name})

        // Find All Targets
        const TargetList : TargetSet = this.GetTargets(_action.target, ItemBattleDex[_action.item.Item].type_target)
       
        // Check if the item can be used at all
        let CanUseItem = true;
        TargetList.forEach(target => {
            let Trainer : TrainerBase | null = this.GetTrainer(target);
            CanUseItem = this.Battle.runEvent('AttemptItemAtAll', _action.trainer, Trainer, target, _action.trainer, _action.item, true, null, Messages);
        })

        if (CanUseItem) {
            TargetList.forEach(target => {
                let Trainer : TrainerBase | null = this.GetTrainer(target);
                const IsTargetAlive = (target instanceof ActivePos)? (target.Monster.HP_Current > 0) : true
                const UseOnTarget = this.Battle.runEvent('AttemptItem', _action.trainer, Trainer, target, _action.trainer, _action.item, IsTargetAlive, null, Messages);

                if (UseOnTarget) {
                    this.Battle.runEvent('ItemOnApply', _action.trainer, Trainer, target, _action.trainer, _action.item, true, null, Messages);
                }
            })
        } else {
            Messages.push({ "generic" : "But the item couldn't be used!"})
        }

        // Emit Messages
        this.Battle.SendOutMessage(Messages);
    }

    /**
     * Given an amount of incoming damage, calculate the final
     * damage dealt and apply that to the monster.
     * @param _val the incoming damage number
     * @param _type the type of the damage
     * @param _source the source of the damage
     * @param _target monster the damage is being applied to
     * @param _trainer trainer associated with the source
     * @param _targetTrainer trainer associated with the target
     * @param _messageList list of messages to add to
     * @param _skipProt if protection will be ignored
     * @param _skipMod if % based modifiers will be ignored
     * @param _skipAll if all adjustments to the damage will be ignores
     */
    public DealDamage(
        _val : number, 
        _type : number,
        _source : ActivePos | ActiveMonster | ActiveItem | Scene | Side | Plot, 
        _target: ActiveMonster, 
        _trainer : TrainerBase | null, 
        _targetTrainer : TrainerBase | null,
        _messageList : MessageSet,
        _skipProt : boolean,
        _skipMod : boolean,
        _skipAll : boolean) {
            let Protection = 0;
            let ProtectionModifier = 0;
            let DamageTakenModifier = 0;
            // This means the protection of the monster will be considered
            if (!_skipProt) {
                Protection = this.GetStatValue(_targetTrainer, _target, "pt")
                let TypeModifier = 1;            
                for (const type in SpeciesBattleDex[_target.Species].type) {
                    const Matchup = TypeMatchup[_type][type];
                    if (Matchup === 1) { TypeModifier -= 0.25;
                    } else if (Matchup === 2) { TypeModifier += 0.25;
                    } else if (Matchup === 3) { TypeModifier = 0; break; }
                }
                ProtectionModifier = this.Battle.runEvent('GetProtectionModifiers', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, 1, null, _messageList )
            }
            // This means additional % based modifiers will be considered
            if (!_skipMod) {
                DamageTakenModifier = this.Battle.runEvent('GetDamageTakenModifiers', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, 1, null, _messageList )
            }

            const FinalProtection = Math.floor( Protection * ProtectionModifier )
            const ModifiedDamage = Math.floor( _val - (_val * ((FinalProtection * DamageTakenModifier)/100)))
            
            if (_skipAll) {
                _target.TakeDamage(ModifiedDamage, _messageList);
            } else {
                const FinalDamage = this.Battle.runEvent('GetFinalDamage', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, ModifiedDamage, null, _messageList )
                _target.TakeDamage(FinalDamage, _messageList);
            }
    }

    /**
     * Given an amount of HP to recover, determine the final
     * recovery amount and apply it to a monster
     * @param _val the base amount of HP to recover
     * @param _type the type of recovery
     * @param _source the reason for this recovery to happen
     * @param _target the monster being healed
     * @param _trainer the trainer associated with the source
     * @param _targetTrainer the trainer associated with the target
     * @param _messageList list of messages to add to
     * @param _skipMod if % based modifiers should be ignored
     * @param _skipAll if final modifiers should be ignored
     */
    public HealDamage(
        _val : number, 
        _type : number,
        _source : ActivePos | ActiveMonster | ActiveItem | Scene | Side | Plot, 
        _target: ActiveMonster, 
        _trainer : TrainerBase | null, 
        _targetTrainer : TrainerBase | null,
        _messageList : MessageSet,
        _skipMod : boolean,
        _skipAll : boolean) {
            
            let DamageRecoveredModifier = 0;
            
            // This means additional % based modifiers will be considered
            if (!_skipMod) {
                DamageRecoveredModifier = this.Battle.runEvent('GetDamageRecoveredModifiers', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, 1, null, _messageList )
            }
            const ModifiedRecovery = Math.floor( _val + (_val * ((DamageRecoveredModifier)/100)))
            
            if (_skipAll) {
                _target.HealDamage(ModifiedRecovery, _messageList, this.GetStatValue(this.GetTrainer(_target), _target, 'hp'));
            } else {
                const FinalRecovery = this.Battle.runEvent('GetFinalRecovery', this.GetTrainer(_source), this.GetTrainer(_target), _target, _source, null, ModifiedRecovery, null, _messageList )
                _target.HealDamage(FinalRecovery, _messageList, this.GetStatValue(this.GetTrainer(_target), _target, 'hp'));
            }
    }

    /**
     * For a given object, attempt to find the right
     * trainer associated with it.
     * @param _obj the object to check
     * @returns the trainer, if one can be found, or null otherwise
     */
    public GetTrainer(_obj : any) {
        if (_obj instanceof Side) {
            return this.Battle.Trainers[_obj.Position]
        } else if (_obj instanceof Plot) {
            return this.Battle.Trainers[_obj.ScenePos]
        } else if (_obj instanceof ActivePos) {
            for (let i = 0; i < this.Battle.Trainers.length; i++) {
                for (let j = 0; j < this.Battle.Trainers[i].Team.Monsters.length; j++) {
                    if (this.Battle.Trainers[i].Team.Monsters[j] === _obj.Monster) { 
                        return this.Battle.Trainers[i]; }
                }
            }        
        } else if (_obj instanceof ActiveMonster) {
            for (let i = 0; i < this.Battle.Trainers.length; i++) {
                for (let j = 0; j < this.Battle.Trainers[i].Team.Monsters.length; j++) {
                    if (this.Battle.Trainers[i].Team.Monsters[j] === _obj) { 
                        return this.Battle.Trainers[i]; }
                }
            }                  
        } else if (_obj instanceof ActiveItem) {
            for (let i = 0; i < this.Battle.Trainers.length; i++) {
                for (let j = 0; j < this.Battle.Trainers[i].Team.Items.length; j++) {
                    if (this.Battle.Trainers[i].Team.Items[j] === _obj) { 
                        return this.Battle.Trainers[i]; }
                }
            }           
        }

        return null;
    } 

    /**
     * Given a list of targets, and the type of targets,
     * return an array listing every object affected.
     * @param _targets The coordinates of each target
     * @param _targettype the type of target (Monster, Terrain, or Both)
     * @returns Array of Scene, Plot, Side, and ActivePos objects
     */
    public GetTargets(_targets : number[][], _targettype : string): TargetSet {
        const Targets : TargetSet = []

        // If empty, return the scene
        if (_targets.length <= 0) {
            if ((_targettype === "ALL") || (_targettype === "MONSTER")) {
                this.Battle.Trainers.forEach(trainer => {
                    trainer.Team.Leads.forEach(lead => { Targets.push(lead); })
                })
            }
            if ((_targettype === "ALL") || (_targettype === "TERRAIN")) {
                Targets.push(this.Battle.Scene);
            }
        } else { // Otherwise locate the relevant side/plot/monster
            _targets.forEach(target => {
                if (target.length === 2) { 
                    // If plot coordinates are given
                    if ((_targettype === "ALL") || (_targettype === "MONSTER")) {
                        this.Battle.Trainers[target[0]].Team.Leads.forEach(lead => {
                            if (lead.Position === target[1]) {
                                Targets.push(lead);
                            }
                        })
                    }
                    if ((_targettype === "ALL") || (_targettype === "TERRAIN")) {
                        Targets.push(this.Battle.Scene.Sides[target[0]].Plots[target[1]])
                    }
                } else if (target.length === 1) {
                    // If side coordinates are given
                    if ((_targettype === "ALL") || (_targettype === "MONSTER")) {
                        this.Battle.Trainers[target[0]].Team.Leads.forEach(lead => {
                            Targets.push(lead);
                        })
                    }
                    if ((_targettype === "ALL") || (_targettype === "TERRAIN")) {
                        Targets.push(this.Battle.Scene.Sides[target[0]])
                    }
                }
            })
        }

        return Targets;
    }

    /**
     * Switch out one monster for another
     * @param _action the SwitchAction containing information on who to swap into who
     */
    public performSwitch(_action : SwitchAction) {
        
        // Prep Messages
        const Messages : MessageSet = []

        // Run Switch
        let CanSwitch = this.Battle.runEvent('AttemptSwitch', _action.trainer, _action.trainer, _action.newmon, _action.current, null, true, null, Messages);
        _action.trainer.Team.Leads.forEach(item => {
            if (item.Monster === _action.newmon) {
                CanSwitch = false;
            }
        })
        
        if (CanSwitch) {
            Messages.push({ "generic" : _action.current.Monster.Nickname + " come back!"})
            this.Battle.runEvent('SwitchOut', _action.trainer, null, null, _action.current, null, null, null, Messages);

            _action.current.SwapMon(_action, _action.trainer.Team);
            
            Messages.push({ "generic" : (_action.newmon.Nickname) + " it's your turn!"})
            this.Battle.runEvent('SwitchIn', _action.trainer, null, null, _action.current, null, null, null, Messages);
        } else {            
            Messages.push({ "generic" : "But " + _action.current.Monster.Nickname + " couldn't switch!"})
        }

        // Emit Messages
        this.Battle.SendOutMessage(Messages);
    }

    /**
     * Takes a list of actions and sorts them in order
     * of play with the first item being run first, the
     * second being run second, and so on.
     * @param _choices the SelectedAction list to organize
     * @returns an organized array of SelectedAction objects
     */
    public orderTurns(_choices : SelectedAction[]): SelectedAction[] {

        const OrderedTurnArray : SelectedAction[] = [];

        // ---------------------------------------- Populate Arrays ---------------------------------------

        const NoneTurnArray : SelectedAction[] = [];
        const SwitchTurnArray : SwitchAction[] = [];
        const ItemTurnArray : ItemAction[] = [];
        const ActionTurnArray : ActionAction[] = [];
        const OtherTurnArray : SelectedAction[] = [];

        _choices.forEach(choice => {
            if (choice.type === "NONE") {
                NoneTurnArray.push(choice);
            } else if (choice.type === "SWITCH") {
                SwitchTurnArray.push(choice as SwitchAction)
            } else if (choice.type === "ITEM") {
                ItemTurnArray.push(choice as ItemAction)
            } else if (choice.type === "ACTION") {
                ActionTurnArray.push(choice as ActionAction)
            } else {
                OtherTurnArray.push(choice)
            }
        })        

        // ---------------------------------------- Turn Skip ---------------------------------------------
        const OrderedNoneTurnArray : SelectedAction[] = [];
        NoneTurnArray.forEach(item => {
            OrderedNoneTurnArray.push(item);
        })

        // ---------------------------------------- Switch Monster ----------------------------------------
        const OrderedSwitchTurnArray : SwitchAction[] = [];

        // Sort By Speed
        var sorted = {};
        for( let i = 0, max = SwitchTurnArray.length; i < max ; i++ ){
            if( sorted[this.GetStatValue(SwitchTurnArray[i].trainer, SwitchTurnArray[i].current, "sp")] == undefined ){
                sorted[this.GetStatValue(SwitchTurnArray[i].trainer, SwitchTurnArray[i].current, "sp")] = [];
            }
            sorted[this.GetStatValue(SwitchTurnArray[i].trainer, SwitchTurnArray[i].current, "sp")].push(SwitchTurnArray[i]);
        }

        // Order the speed tiers
        const sortedEntries = Object.entries(sorted).sort((a, b) => { return parseInt(b[0].toString()) - parseInt(a[0].toString())})
        const sortedDictionary: {} = Object.fromEntries(sortedEntries);

        // Shuffle within speed tiers and add to turn order
        for (let i = (Object.keys(sortedDictionary).length - 1); i >= 0; i--) {
            OrderedSwitchTurnArray.push.apply(OrderedSwitchTurnArray, this.shuffleArray(sortedDictionary[Object.keys(sortedDictionary)[i]]))
        }
        
        // ---------------------------------------- Use Item ----------------------------------------------
        const OrderedItemTurnArray : ItemAction[] = [];

        // Group Item usage by impact on the field
        // Scene-affecting items go first, then items
        // for the trainer, then items affecting an
        // opposing team.
        const ItemScene : ItemAction[] = [];
        const ItemSelf : ItemAction[] = [];
        const ItemOther : ItemAction[] = [];

        ItemTurnArray.forEach(item => {
            if (item.target.length === 0) {
                ItemScene.push(item)
            } else {                
                if (item.target[0][0] === item.trainer.Position) {
                    ItemSelf.push(item);
                } else { ItemOther.push(item) }
            }
        })
        
        // Shuffle within Item groups and add to turn order
        OrderedItemTurnArray.push.apply(OrderedItemTurnArray, this.shuffleArray(ItemScene))
        OrderedItemTurnArray.push.apply(OrderedItemTurnArray, this.shuffleArray(ItemSelf))
        OrderedItemTurnArray.push.apply(OrderedItemTurnArray, this.shuffleArray(ItemOther))

        // ---------------------------------------- Perform Action ----------------------------------------
        const OrderedActionTurnArray : ActionAction[] = [];

        // Sort By priority
        var sorted = {};
        for( let i = 0, max = ActionTurnArray.length; i < max ; i++ ){
            if( sorted[ActionBattleDex[ActionTurnArray[i].action.Action].priority] == undefined ){
                sorted[ActionBattleDex[ActionTurnArray[i].action.Action].priority] = [];
            }
            sorted[ActionBattleDex[ActionTurnArray[i].action.Action].priority].push(ActionTurnArray[i]);
        }
        
        // Order the priority tiers
        const sortedActionEntries = Object.entries(sorted).sort((a, b) => {
            return parseInt(b[0].toString()) - parseInt(a[0].toString())})
        const sortedActionDictionary: {} = Object.fromEntries(sortedActionEntries);

        // Iterate through each tier of priority
        for (let i = (Object.keys(sortedActionDictionary).length - 1); i >= 0; i--) {
            const ArrayOfActions : ActionAction[] = sortedActionDictionary[Object.keys(sortedActionDictionary)[i]];

            // Organize by speed within priority
            var sorted = {};
            for( let i = 0, max = ArrayOfActions.length; i < max ; i++ ){
                if( sorted[this.GetStatValue(ArrayOfActions[i].trainer, ArrayOfActions[i].source.Monster, "sp")] == undefined ){
                    sorted[this.GetStatValue(ArrayOfActions[i].trainer, ArrayOfActions[i].source.Monster, "sp")] = [];
                }
                sorted[this.GetStatValue(ArrayOfActions[i].trainer, ArrayOfActions[i].source.Monster, "sp")].push(ArrayOfActions[i]);
            }

            // Order the speed tiers
            const sortedPriorityActionEntries = Object.entries(sorted).sort((a, b) => { return parseInt(b[0].toString()) - parseInt(a[0].toString())})
            const sortedPriorityActionDictionary: {} = Object.fromEntries(sortedPriorityActionEntries);
            // Shuffle within speed tiers and add to turn order
            for (let i = (Object.keys(sortedPriorityActionDictionary).length - 1); i >= 0; i--) {
                OrderedActionTurnArray.push.apply(OrderedActionTurnArray, this.shuffleArray(sortedPriorityActionDictionary[Object.keys(sortedPriorityActionDictionary)[i]]))
            }
        }

        // ---------------------------------------- Emergency Misc Dump -----------------------------------
        const OrderedOtherTurnArray : SelectedAction[] = [];

        OtherTurnArray.forEach(item => {
            OrderedOtherTurnArray.push(item)
        })

        // ---------------------------------------- Combine Arrays ----------------------------------------

        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedNoneTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedSwitchTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedItemTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedActionTurnArray);
        OrderedTurnArray.push.apply(OrderedTurnArray, OrderedOtherTurnArray);

        return OrderedTurnArray;
    }

    /**
     * Given an array of objects, randomise their order
     * @param array the array to shuffle
     * @returns the array, with objects randomly swapped around
     */
    public shuffleArray(array: any[]): any[] {
        const newArray = array.slice();
    
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
    
        return newArray;
    }

    /**
     * Given a particular stat, get the base value of that stat
     * @param _trainer the trainer of the relevant monster
     * @param _monster the monster to get the stat from
     * @param _stat the stat to find
     * @returns returns a number or number[], based on the stat
     */
    public GetStatValue(_trainer : TrainerBase, _monster : ActivePos | ActiveMonster, _stat : string) {
        
        const _mon : ActiveMonster = (_monster instanceof ActiveMonster)? _monster : _monster.Monster;

        const BaseStat = this.Battle.runEvent(('GetStatBase'+_stat),_trainer, null, null, _mon, null, _mon.GetStat(_stat))
        const StatMod = this.Battle.runEvent(('GetStatMod'+_stat),_trainer, null, null, _mon, null, _mon.GetStatBoost(_stat))
        const FinalStat = this.Battle.runEvent(('GetStatFinal'+_stat),_trainer, null, null, _mon, null, (Math.floor(BaseStat + (Math.floor(BaseStat * StatMod)))))
        
        return FinalStat;
    }
}

export {BattleEvents}