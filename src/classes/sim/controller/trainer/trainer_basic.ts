import { IDEntry, TurnSelect } from "../../../../global_types";
import { RoomHold } from "../../../structure/room/RoomHold";
import { TeamFactory } from "../../factories/team_factory";
import { BattleSide } from "../../models/battle_side";
import { Team, ITeam } from "../../models/team"
import { Battle } from "../battle";

/**
 * Interface of the TrainerBase class
 */
class ITrainer {
    team : ITeam // The trainer's team - in Interface form
    pos  : number // The position (side) the trainer takes in the battle
    name : string // The name/username of the trainer
    type : IDEntry // the type of Trainer this is
}

class TrainerBase {

    public Team     : Team;     // The trainer's team
    public Position : number;   // The position (side) the trainer takes in battle
    public Name     : string;   // The trainer's name
    public Owner    : BattleSide
    public Type     : IDEntry;

    /**
     * Simple constructor
     * @param _trainer The interface representing the trainer
     */
    constructor(_trainer : ITrainer, _owner : BattleSide) {
        this.Team = TeamFactory.CreateTeam(_trainer.team, this);
        this.Type = _trainer.type;
        this.Owner = _owner
        this.Position = _trainer.pos;
        this.Name = _trainer.name;
    }
    
    /**
     * Given an array of possible options for a trainer to take (per active monster)
     * the trainer must return one of them as its selection.
     * @param _options The possible options a trainer can take this turn
     * @param _room Optional parameter that describes the room the battle takes place in, used for socket emmission
     * @param _battle Optional parameter that provides the battle the trainer is a part of
     * @returns Returns a SelectedAction object describing what action(s) the trainer takes this turn
     */
    public async SelectChoice(_options: TurnSelect, _room? : any, _battle? : Battle) { return null; }

    /**
     * Sends the user information on where in
     * the battle this trainer is located
     * @param _room the room to have transmit this information
     */
    public SendPositionInfo(_room? : RoomHold) { undefined; }

    /**
     * Given a TrainerBase object, give us the
     * ITrainer, with all child objects also converted
     * into their respective interfaces
     * @returns the ITrainer reflecting this trainer
     */
    public ConvertToInterface() {
        const _interface : ITrainer = {
            team : this.Team.ConvertToInterface(),
            pos  : this.Position,
            name : this.Name,
            type : this.Type
        }
        return _interface;
    }

}

export {TrainerBase, ITrainer}