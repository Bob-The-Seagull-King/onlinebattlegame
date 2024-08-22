import { SelectedAction, TurnChoices } from "../../../../global_types";
import { OfflineBattleManager } from "../../../viewmodel/battle_manager_local";
import { ITrainer, TrainerBase } from "./trainer_basic";

class ITrainerLocal extends ITrainer {
    manager : OfflineBattleManager;
}

class TrainerLocal extends TrainerBase {

    public Manager;

    constructor(_team : ITrainerLocal) {
        super(_team)
        this.Manager = _team.manager;
    }
    
    public SelectChoice(_options: TurnChoices): SelectedAction | null {
        try {
            const TypeCount = Object.keys(_options).length;
            if (TypeCount > 0) {
                const TypeRnmd = Math.floor(Math.random() * TypeCount);
                const ActionRnmd = Math.floor(Math.random() * _options[Object.keys(_options)[TypeRnmd]].length);

                return _options[Object.keys(_options)[TypeRnmd]][ActionRnmd]
            }
        } catch(e) {
            return null
        }
        return null
    }

}

export {TrainerLocal, ITrainerLocal}