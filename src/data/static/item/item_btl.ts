import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveItem } from "../../../classes/sim/models/active_item";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { ActivePos } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { Side } from "../../../classes/sim/models/terrain/terrain_side";
import { ItemBattleTable, MessageSet } from "../../../global_types";
import { ItemCategory } from "../../enum/categories";
import { MonsterType } from "../../enum/types";

/**
 * Item mechanical information database
 */
export const ItemBattleDex : ItemBattleTable = {
    herb : {
        id          : 0,
        cost        : 10,
        category    : [ItemCategory.Restoration],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : trainer.Name + " healed up " + target.Monster.Nickname })
            const RecoveryVal = Math.floor(this.Events.GetStatValue(trainer, target, 'hp') * 0.25)
            this.Events.HealDamage(RecoveryVal, MonsterType.None, eventSource, target.Monster, null, trainer, messageList, false, false)
        }
    },
    sharpstones : {
        id          : 1,
        cost        : 20,
        category    : [ItemCategory.Terraform],
        team_target : "ENEMY",
        pos_target  : "SIDE",
        type_target : "TERRAIN",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : Side, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : "Pointed Stone filled " + trainerTarget.Name + "'s side of the battle!"})
            if (!target.Tokens.includes('pointed')) {
                target.Tokens.push('pointed')
            }
        }
    }
}