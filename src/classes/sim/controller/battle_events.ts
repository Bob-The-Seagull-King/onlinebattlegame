import { MonsterType, TypeMatchup } from "../../../data/enum/types";
import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ActionInfoDex } from "../../../data/static/action/action_inf";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { ItemInfoDex } from "../../../data/static/item/item_inf";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";
import { ActionAction, IDEntry, ItemAction, MessageSet, SelectedAction, SwitchAction, TargetSet } from "../../../global_types";
import { ActiveAction } from "../models/active_action";
import { ActiveItem } from "../models/active_item";
import { ActiveMonster } from "../models/active_monster";
import { FieldedMonster } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { Scene } from "../models/terrain/terrain_scene";
import { Battle } from "./battle"
import { TrainerBase } from "./trainer/trainer_basic";

class BattleEvents {

    public Battle : Battle; // The battle that is using this Events object

    /**
     * Simple constructor
     * @param _battle the parent Battle that created this BattleEvents
     */
    constructor(_battle : Battle) {
        this.Battle = _battle;
    }

}

export {BattleEvents}