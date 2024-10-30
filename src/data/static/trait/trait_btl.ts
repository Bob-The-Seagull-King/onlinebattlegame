import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { MessageSet, TraitBattleTable } from "../../../global_types";
import { TokenCategory, TraitCategory } from "../../enum/categories";
import { MonsterType } from "../../enum/types";
import { ActionBattleDex } from "../action/action_btl";
import { TokenMonsterBattleDex } from "../token/t_monster/token_monster_btl";
import { TokenMonsterInfoDex } from "../token/t_monster/token_monster_inf";

/**
 * Trait mechanical information database
 */
export const TraitBattleDex : TraitBattleTable = {
    hospitality: {
        id          : 0,
        cost        : 5,
        category    : [TraitCategory.Restoration],
        events      : {},
        async onSwitchInMonster(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            for (let i = 0; i < source.Owner.Leads.length; i++) {
                const BaseHeal = await this.Events.GetStatValue(source.Owner.Leads[i], 'hp', false, false)
                const HealVal = await this.Events.HealDamage(Math.ceil(BaseHeal/10), 0, source, source.Owner.Leads[i].Monster, source.Owner.Owner, source.Owner.Leads[i].Owner.Owner, messageList, false, false)
            }
        }
    }
}