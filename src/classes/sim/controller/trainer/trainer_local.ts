import { SelectedAction, TurnChoices } from "../../../../global_types";
import { IRoomMember, RoomHold } from "../../../structure/room/RoomHold";
import { ITrainer, TrainerBase } from "./trainer_basic";

class ITrainerLocal extends ITrainer {
}

class TrainerLocal extends TrainerBase {


    constructor(_team : ITrainerLocal) {
        super(_team)
    }
    
    public SelectChoice(_options: TurnChoices): SelectedAction | null {
        return null;
    }

}

export {TrainerLocal, ITrainerLocal}