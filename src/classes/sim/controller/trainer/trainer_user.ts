import { TurnSelect } from "../../../../global_types";
import { IRoomMember, RoomHold } from "../../../structure/room/RoomHold";
import { ITrainer, TrainerBase } from "./trainer_basic";

/**
 * Interface of human trainers playing on a server
 */
class ITrainerUser extends ITrainer {
    user : IRoomMember; // Information on the room, socket, etc that this trainer is associated with.
}

class TrainerUser extends TrainerBase {
    /**
     * NOTE: Online trainers are stored on the server, not the browser.
     * Players are limited to information provided by the battle.
     */

    public User : IRoomMember; // Information on the room, socket, etc that this trainer is associated with.

    /**
     * Simple constructor
     * @param _trainer The interface representing the trainer
     */
    constructor(_trainer : ITrainerUser) {
        super(_trainer)
        this.User = _trainer.user;
    }

    /**
     * Given an array of possible options for a trainer to take (per active monster)
     * send these options to the user through the room and await a response message.
     * @param _options The possible options a trainer can take this turn
     * @param _room The room that this trainer is currently a part of.
     * @returns Returns a SelectedAction object describing what action(s) the trainer takes this turn
     */
    public async SelectChoice(_options: TurnSelect, _room : RoomHold) {
        const SelectedAction = await _room.GetUserTurn(this, _options)
        return SelectedAction;
    }
    
}

export {TrainerUser, ITrainerUser}