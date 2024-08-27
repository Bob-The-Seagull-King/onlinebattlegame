import { IDEntry, MessageSet, SelectedAction } from "../../../global_types";
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
        const messages : MessageSet = [];
        _choices.forEach(element => {
                element.trainer = new TrainerBase({ team : element.trainer.Team.ConvertToInterface(), pos : element.trainer.Position, name: element.trainer.Name })
                const Message : {[id : IDEntry]: any} = { "choice" : element}
                messages.push(Message)
            })
        this.Battle.SendOutMessage(messages);
        return this.Battle.IsBattleAlive();
    }
}

export {BattleEvents}