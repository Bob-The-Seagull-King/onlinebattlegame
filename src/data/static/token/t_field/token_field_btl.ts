import { Battle } from "../../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../../classes/sim/models/team";
import { Plot } from "../../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../../classes/sim/models/terrain/terrain_scene";
import { MessageSet, TokenBattleTable } from "../../../../global_types";
import { TokenCategory } from "../../../enum/categories";
import { MonsterType, TypeMatchup } from "../../../enum/types";
import { SpeciesBattleDex } from "../../species/species_btl";

/**
 * Terrain Token mechanical information database
 */
export const TokenFieldBattleDex : TokenBattleTable = {
}