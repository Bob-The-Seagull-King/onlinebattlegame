import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ActionAction, IDEntry, ItemAction, MessageSet, SelectedAction, SwitchAction } from "../../../global_types";
import { ActiveMonster } from "../models/active_monster";
import { ActivePos } from "../models/team";
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
        const DuplicateAction : SelectedAction = _action 
        DuplicateAction.trainer = new TrainerBase({ team : DuplicateAction.trainer.Team.ConvertToInterface(), pos : DuplicateAction.trainer.Position, name: DuplicateAction.trainer.Name })
        
        const Message : {[id : IDEntry]: any} = { "choice" : DuplicateAction}
        this.Battle.SendOutMessage([Message]);
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

    public shuffleArray(array: any[]): any[] {
        const newArray = array.slice();
    
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
    
        return newArray;
    }

    public GetStatValue(_trainer : TrainerBase, _monster : ActivePos | ActiveMonster, _stat : string) {
        const _mon : ActiveMonster = (_monster instanceof ActiveMonster)? _monster : _monster.Monster;

        const BaseStat = this.Battle.runEvent(('GetStatBase'+_stat),_trainer, null, null, _mon, null, _mon.GetStat(_stat))
        const StatMod = this.Battle.runEvent(('GetStatMod'+_stat),_trainer, null, null, _mon, null, _mon.GetStatBoost(_stat))
        const FinalStat = this.Battle.runEvent(('GetStatFinal'+_stat),_trainer, null, null, _mon, null, (Math.floor(BaseStat + (Math.floor(BaseStat * StatMod)))))
        
        return FinalStat;
    }
}

export {BattleEvents}