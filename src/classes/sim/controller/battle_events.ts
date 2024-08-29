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
        console.log(this.orderTurns(_choices))
        const messages : MessageSet = [];
        _choices.forEach(element => {
                element.trainer = new TrainerBase({ team : element.trainer.Team.ConvertToInterface(), pos : element.trainer.Position, name: element.trainer.Name })
                const Message : {[id : IDEntry]: any} = { "choice" : element}
                messages.push(Message)
            })
        this.Battle.SendOutMessage(messages);
        return this.Battle.IsBattleAlive();
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

        // Order Arrays
        const OrderedItemTurnArray : ItemAction[] = [];
        const OrderedActionTurnArray : ActionAction[] = [];
        const OrderedOtherTurnArray : SelectedAction[] = [];

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