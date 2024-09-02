import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { ActivePos } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { Side } from "../../../classes/sim/models/terrain/terrain_side";
import { MessageSet, TraitBattleTable } from "../../../global_types";
import { TokenCategory, TraitCategory } from "../../enum/categories";
import { MonsterType } from "../../enum/types";
import { TokenMonsterBattleDex } from "../token/t_monster/token_monster_btl";
import { TokenMonsterInfoDex } from "../token/t_monster/token_monster_inf";

/**
 * Trait mechanical information database
 */
export const TraitBattleDex : TraitBattleTable = {
    clearbody : {
        id          : 0,
        cost        : 10,
        category    : [TraitCategory.Restoration],
        events      : {},
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens.forEach(token => {
                    if (TokenMonsterBattleDex[token].category.includes(TokenCategory.Condition)) {
                        const randomValue = Math.random() * (100);
                        if (randomValue <= 33) {                
                            messageList.push({ "generic" : source.Monster.Nickname + " cured itself of " + TokenMonsterInfoDex[token].name})
                            source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === token))
                        }
                    }
                })           
            }
        }
    },
    harshlife : {
        id          : 1,
        cost        : 10,
        category    : [TraitCategory.Armour],
        events      : {},
        onGetFinalDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster, source : TrainerBase, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (relayVar === 1) {
                messageList.push({ "generic" : target.Nickname + " shrugged off the damage!"})
                return 0;
            } else {
                return relayVar;
            }
        }
    },
    retaliation : {
        id          : 2,
        cost        : 15,
        category    : [TraitCategory.Revenge],
        events      : {},
        onAfterDealingDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) {
            if (!fromSource) {
                messageList.push({ "generic" : target.Monster.Nickname + " got mad!"})
                if (!target.Monster.Tokens.includes("retaliation")) {
                    target.Monster.Tokens.push("retaliation")
                }
                if (target.Monster.Trackers["retaliation"]) {
                    target.Monster.Trackers["retaliation"] += 1;
                } else {
                    target.Monster.Trackers["retaliation"] = 1;
                }
            }
        }
    },
    vampire : {
        id          : 3,
        cost        : 20,
        category    : [TraitCategory.Drain],
        events      : {},
        onEffectApply(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | ActivePos | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, trackVal: string, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                this.Events.HealDamage(
                    Math.floor(this.Events.GetStatValue(trainer, source, "hp", messageList) * 0.1),
                    MonsterType.None,
                    source,
                    source.Monster,
                    trainer,
                    trainer,
                    messageList,
                    false,
                    false,
                )
            }
        }
    }
}