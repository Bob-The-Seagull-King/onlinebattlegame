import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { SpeciesInfoDex } from "../../../data/static/species/species_inf";
import { IDEntry } from "../../../global_types";
import { ActiveMonster, IActiveMonster } from "../models/active_monster";

class MonsterFactory {

    /**
     * Return an ActiveMonster object from the Interface equivilent
     * @param _monster the active monster interface
     * @returns a new ActiveMonster object
     */
    public static CreateMonster(_monster : IActiveMonster) {
        const newMonster = new ActiveMonster(_monster);
        return newMonster;
    }

    /**
     * Creates a default instance of a monster based on the
     * species ID/name.
     * @param _monster the species name of the monster
     * @returns a new ActiveMonster object
     */
    public static CreateNewMonster(_monster : IDEntry) {
        const freshMonster : IActiveMonster = {
            species     : _monster,
            nickname    : SpeciesInfoDex[_monster].name,
            actions     : [],
            traits      : [],
            boosts      : {hp: 0, dl: 0, dh: 0, ac: 0, pt: 0, sk: 0, rs: 0, sp: 0},
            tokens      : [],
            trackers    : {},
            hp_cur      : SpeciesBattleDex[_monster].stats.hp,
            actions_cur : []
        }
        return MonsterFactory.CreateMonster(freshMonster);
    }

}

export {MonsterFactory}