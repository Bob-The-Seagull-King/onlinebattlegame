import { ChosenAction, TurnSelect, TurnSelectReturn } from "../../../../global_types";
import { IRoomMember, RoomHold } from "../../../structure/room/RoomHold";
import { BattleSide } from "../../models/battle_side";
import { ITrainer, TrainerBase } from "./trainer_basic";
import { EventEmitter } from 'events';

// Tool for awaiting / creating events. Used for action selection.
const eventEmitter = new EventEmitter();

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
    constructor(_trainer : ITrainerUser, _owner : BattleSide) {
        super(_trainer, _owner)
        this.User = _trainer.user;
    }

    /**
     * Sends the user information on where in
     * the battle this trainer is located
     * @param _room the room to have transmit this information
     */
    public SendPositionInfo(_room : RoomHold) {         
        _room.SetUserPosition(this, this.Position, this.Owner.Position)
    }

    /**
     * Given an array of possible options for a trainer to take (per active monster)
     * send these options to the user through the room and await a response message.
     * @param _options The possible options a trainer can take this turn
     * @param _room The room that this trainer is currently a part of.
     * @returns Returns a SelectedAction object describing what action(s) the trainer takes this turn
     */
    public async SelectChoice(_options: TurnSelect, _room : RoomHold) {
        _room.GetUserTurn(this, _options)     
        return new Promise<TurnSelectReturn>((resolve) => {
            eventEmitter.once('user' + this.Name + 'position' + this.Position + 'selectAction' + this.User.socket.MyID, (action: TurnSelectReturn) => {
                resolve(action);
            });
        });
    }

    /**
     * Given an option is selected, trigger the appropriate
     * event and send that information to the user.
     * @param _option the option chosen
     * @param refID the 
     */
    public SendOptions(_option : ChosenAction, refPos : string) {
        eventEmitter.emit('user' + this.Name + 'position' + this.Position + 'selectAction' + this.User.socket.MyID, _option);
    }
    
}

export {TrainerUser, ITrainerUser}