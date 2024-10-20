import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveItem } from "../../../classes/sim/models/active_item";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { ItemBattleTable, MessageSet } from "../../../global_types";
import { ItemCategory } from "../../enum/categories";
import { MonsterType } from "../../enum/types";
import { SpeciesEvolutionDex } from "../species/species_evl";
import { SpeciesInfoDex } from "../species/species_inf";

/**
 * Item mechanical information database
 */
export const ItemBattleDex : ItemBattleTable = {
    greenherb: {
        id                  : 0,
        cost                : 40,
        category            : [],
        events              : {},
        target_team         : "SELF",
        target_pos          : "SINGLE",
        target_type         : "MONSTER",
        target_direction    : "ALL",
        target_choice       : "MONSTER",
        target_range        : 0
    },
    blockofstone: {
        id                  : 1,
        cost                : 25,
        category            : [],
        events              : {},
        target_team         : "ANY",
        target_pos          : "SINGLE",
        target_type         : "TERRAIN",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0
    },
    mudshot: {
        id                  : 2,
        cost                : 50,
        category            : [],
        events              : {},
        target_team         : "ANY",
        target_pos          : "SMALL",
        target_type         : "TERRAIN",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0
    },
    microbomb: {
        id                  : 3,
        cost                : 75,
        category            : [],
        events              : {},
        target_team         : "ENEMY",
        target_pos          : "MEDIUM",
        target_type         : "MONSTER",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0
    },
    gunklauncher: {
        id                  : 4,
        cost                : 50,
        category            : [],
        events              : {},
        target_team         : "ANY",
        target_pos          : "LARGE",
        target_type         : "ALL",
        target_direction    : "ALL",
        target_choice       : "ALL",
        target_range        : 0
    }
}