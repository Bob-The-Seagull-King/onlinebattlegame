import { SelectedAction, TurnChoices, TurnSelect } from "../../../../global_types";
import { OfflineBattleManager } from "../../../viewmodel/battle_manager_local";
import { ITrainer, TrainerBase } from "./trainer_basic";

class ITrainerLocal extends ITrainer {
    manager : OfflineBattleManager;
}

class TrainerLocal extends TrainerBase {

    public Manager : OfflineBattleManager;

    constructor(_team : ITrainerLocal) {
        super(_team)
        this.Manager = _team.manager;
    }
    
    public async SelectChoice(_options: TurnSelect)  {
        const SelectedAction = await this.Manager.ReceiveOptions(_options.Choices, _options.Position);
        return SelectedAction;
    }

}

export {TrainerLocal, ITrainerLocal}