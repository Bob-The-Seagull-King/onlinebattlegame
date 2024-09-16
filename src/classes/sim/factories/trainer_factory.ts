import { IDEntry } from "../../../global_types";
import { ITrainer, TrainerBase } from "../controller/trainer/trainer_basic";
import { ITrainerBot, TrainerBot } from "../controller/trainer/trainer_bot";
import { ITrainerLocal, TrainerLocal } from "../controller/trainer/trainer_local";
import { ITrainerUser, TrainerUser } from "../controller/trainer/trainer_user";
import { BattleSide } from "../models/battle_side";
import { ITeam, Team } from "../models/team";

class TrainerFactory {

    /**
     * Return a Team object from the Interface equivilent
     * @param _team the Team interface
     * @returns a new Team object
     */
    public static CreateTrainer(_team : ITrainer, _owner : BattleSide) {
        if (_team.type === "local") {
            const newTrainer = new TrainerLocal(_team as ITrainerLocal, _owner);
            return newTrainer;
        }
        if (_team.type === "bot") {
            const newTrainer = new TrainerBot(_team as ITrainerBot, _owner);
            return newTrainer;
        }
        if (_team.type === "user") {
            const newTrainer = new TrainerUser(_team as ITrainerUser, _owner);
            return newTrainer;
        }
        const newTeam = new TrainerBase(_team, _owner);
        return newTeam;
    }

    /**
     * Generate an empty Team
     * @returns a new Team object
     */
    public static CreateNewTrainer(_name : string, _type : IDEntry, _pos : number, _owner : BattleSide) {
        
        const freshTeam : ITeam = {
            name: _name, 
            items: [],
            monsters: [],
            active: []
        }
        
        if (_type === "local") {
            const freshTrainer : ITrainer = {
                team : freshTeam, // The trainer's team - in Interface form
                pos  : _pos, // The position (side) the trainer takes in the battle
                name : _name, // The name/username of the trainer
                type : _type // the type of Trainer this is
            }
            return TrainerFactory.CreateTrainer(freshTrainer, _owner);
        }
        if (_type === "bot") {
            const freshTrainer : ITrainer = {
                team : freshTeam, // The trainer's team - in Interface form
                pos  : _pos, // The position (side) the trainer takes in the battle
                name : _name, // The name/username of the trainer
                type : _type // the type of Trainer this is
            }
            return TrainerFactory.CreateTrainer(freshTrainer, _owner);
        }
        if (_type === "user") {
            const freshTrainer : ITrainer = {
                team : freshTeam, // The trainer's team - in Interface form
                pos  : _pos, // The position (side) the trainer takes in the battle
                name : _name, // The name/username of the trainer
                type : _type // the type of Trainer this is
            }
            return TrainerFactory.CreateTrainer(freshTrainer, _owner);
        }
    }

}

export {TrainerFactory}