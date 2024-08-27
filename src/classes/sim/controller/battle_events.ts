import { IDEntry, MessageSet, SelectedAction } from "../../../global_types";
import { Battle } from "./battle"
import { TrainerBase } from "./trainer/trainer_basic";

class BattleEvents {

    public Battle : Battle;

    constructor(_battle : Battle) {
        this.Battle = _battle;
    }

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