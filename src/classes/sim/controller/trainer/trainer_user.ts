import { SelectedAction, TurnChoices } from "../../../../global_types";
import { IRoomMember, RoomHold } from "../../../structure/room/RoomHold";
import { ITrainer, TrainerBase } from "./trainer_basic";

class ITrainerUser extends ITrainer {
    user : IRoomMember;
    room : RoomHold;
}

class TrainerUser extends TrainerBase {

    public User : IRoomMember;
    public Room : RoomHold;

    constructor(_team : ITrainerUser) {
        super(_team)
        this.User = _team.user;
        this.Room = _team.room;
    }
    
    public async SelectChoice(_options: TurnChoices) {
        return this.Room.GetUserTurn(this.User, _options);
    }

}

export {TrainerUser, ITrainerUser}