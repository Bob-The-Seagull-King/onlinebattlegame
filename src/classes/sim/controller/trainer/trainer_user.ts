import { SelectedAction, TurnChoices, TurnSelect } from "../../../../global_types";
import { IRoomMember, RoomHold } from "../../../structure/room/RoomHold";
import { ITrainer, TrainerBase } from "./trainer_basic";

class ITrainerUser extends ITrainer {
    user : IRoomMember;
}

class TrainerUser extends TrainerBase {

    public User : IRoomMember;

    constructor(_team : ITrainerUser) {
        super(_team)
        this.User = _team.user;
    }
    
    public async SelectChoice(_options: TurnSelect, _room : RoomHold) {
        const SelectedAction = await _room.GetUserTurn(this, _options)
        return SelectedAction;
    }

}

export {TrainerUser, ITrainerUser}