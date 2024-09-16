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
}