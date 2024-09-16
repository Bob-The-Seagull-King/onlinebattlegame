import { TurnSelect } from "../../../../global_types";
import { OfflineBattleManager } from "../../../viewmodel/battle_manager_local";
import { BattleSide } from "../../models/battle_side";
import { ITrainer, TrainerBase } from "./trainer_basic";

/**
 * Interface of human trainers playing locally
 */
class ITrainerLocal extends ITrainer {
    manager : OfflineBattleManager; // The local manager that handles this battle, stored in the browser
}

class TrainerLocal extends TrainerBase {

    public Manager : OfflineBattleManager; // The local manager that handles this battle, stored in the browser
    
    /**
     * Simple constructor
     * @param _trainer The interface representing the trainer
     */
    constructor(_trainer : ITrainerLocal, _owner : BattleSide) {
        super(_trainer, _owner)
        this.Manager = _trainer.manager;
    }

    public SendPositionInfo() {         
        this.Manager.SetUserInfo(this.Position, this.Owner.Position)
    }
    
    /**
     * Given an array of possible options for a trainer to take (per active monster)
     * send these options to the local manager and await the user to select one.
     * @param _options The possible options a trainer can take this turn
     * @returns Returns a SelectedAction object describing what action(s) the trainer takes this turn
     */
    public async SelectChoice(_options: TurnSelect)  {
        const SelectedAction = await this.Manager.ReceiveOptions(_options.Choices, _options.Position, _options.Battle);
        return SelectedAction;
    }

}

export {TrainerLocal, ITrainerLocal}