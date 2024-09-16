import { ActionBattleTable, MessageSet } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";
import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";

/**
 * Action mechanical information database
 */
export const ActionBattleDex : ActionBattleTable = {
}