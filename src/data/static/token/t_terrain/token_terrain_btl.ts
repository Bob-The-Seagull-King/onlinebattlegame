import { Battle } from "../../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../../classes/sim/models/active_monster";
import { ActivePos } from "../../../../classes/sim/models/team";
import { Plot } from "../../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../../classes/sim/models/terrain/terrain_scene";
import { Side } from "../../../../classes/sim/models/terrain/terrain_side";
import { MessageSet, TokenBattleTable } from "../../../../global_types";
import { TokenCategory } from "../../../enum/categories";
import { MonsterType, TypeMatchup } from "../../../enum/types";
import { SpeciesBattleDex } from "../../species/species_btl";

/**
 * Terrain Token mechanical information database
 */
export const TokenTerrainBattleDex : TokenBattleTable = {
    pointed : {
        id          : 0,
        category    : [TokenCategory.Harsh,TokenCategory.Ground],
        onSwitchIn(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                messageList.push({ "generic" : "Pointed Stones hurt " + source.Monster.Nickname})
                const DamageVal = Math.floor(this.Events.GetStatValue(trainer, source.Monster, 'hp', messageList) * 0.3)
                this.Events.DealDamage(DamageVal, MonsterType.None, eventSource, source.Monster, null, trainer, messageList, true, false, false)
            }
        }
    },
    hotcoal : {
        id          : 1,
        category    : [TokenCategory.Debuff,TokenCategory.Ground],       
        onGetStatFinalsp(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                return relayVar + 8;
            }
            return relayVar;
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                const DamageVal = Math.max(1, Math.floor(this.Events.GetStatValue(trainer, source, "hp", messageList) * (1/12)))
                messageList.push({ "generic" : source.Monster.Nickname + " got hurt by the Hot Coal!"})
                this.Events.DealDamage(DamageVal, MonsterType.Blaze, eventSource, source.Monster, null, trainer, messageList, true, true, false);
            }
        }
    },
    altar : {
        id          : 2,
        category    : [TokenCategory.Debuff,TokenCategory.Boost],       
        onGetStatFinalpt(this: Battle, eventSource : Plot, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (eventSource.Trackers["altar"] ) {
                    return Math.floor(relayVar * (1 - (0.1 * eventSource.Trackers["altar"])));
                } else {                    
                    eventSource.Tokens = eventSource.Tokens.filter(item => !(item === "altar"))
                    delete source.Trackers["altar"];    
                }
            }
            return relayVar;
        },
        onGetStatModdl(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (eventSource.Trackers["altar"] ) {
                    return Math.floor(relayVar + eventSource.Trackers["altar"]);
                } else {                    
                    eventSource.Tokens = eventSource.Tokens.filter(item => !(item === "altar"))
                    delete eventSource.Trackers["altar"];    
                }
            }
            return relayVar;
        },
        onGetStatModdh(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (eventSource.Trackers["altar"] ) {
                    return Math.floor(relayVar + eventSource.Trackers["altar"]);
                } else {                    
                    eventSource.Tokens = eventSource.Tokens.filter(item => !(item === "altar"))
                    delete eventSource.Trackers["altar"];    
                }
            }
            return relayVar;
        }
    },
    lightningstorm : {
        id: 3,
        category: [],
        onGetStatModsp(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                let TypeMod = 3
                for (const type in SpeciesBattleDex[source.GetSpecies()].type) {
                    const Matchup = TypeMatchup[MonsterType.Tempest][type];
                    if (Matchup === 1) { TypeMod -= 1;
                    } else if (Matchup === 2) { TypeMod += 1;
                    } else if (Matchup === 3) { TypeMod += 2; }
                }
                return relayVar + TypeMod;
            }
            return relayVar;
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (eventSource.Trackers["lightningstorm"]) {
                    eventSource.Trackers["lightningstorm"] -= 1;
                    if (eventSource.Trackers["lightningstorm"] <= 0) {
                        eventSource.Tokens = eventSource.Tokens.filter(item => !(item === "lightningstorm"))
                        delete eventSource.Trackers["lightningstorm"];
                        messageList.push({ "generic" : "The storm faded"});
                    }
                } else {
                    eventSource.Tokens = eventSource.Tokens.filter(item => !(item === "lightningstorm"))
                    delete eventSource.Trackers["lightningstorm"];
                    messageList.push({ "generic" : "The storm faded"});
                }
            }
        }
    },
    deepforest : {
        id: 4,
        category: [],
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                const HealBaseAmount = this.Events.GetStatValue(trainer, source, "hp", messageList);
                const HealedAmount = this.Events.HealDamage(HealBaseAmount, MonsterType.None, source, source.Monster, trainer, trainer, messageList, true, true);
                messageList.push({ "generic" : "The forest recovered " + HealedAmount + " HP to " + source.Monster.Nickname});
            }
        }
    },
    dancinglights : {
        id: 5,
        category: [],
        onActionMiss(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | ActivePos | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            
            const HealBaseAmount = this.Events.GetStatValue(trainer, source, "hp", messageList);
            const HealedAmount = this.Events.HealDamage(HealBaseAmount, MonsterType.None, source, source.Monster, trainer, trainer, messageList, true, true);
            messageList.push({ "generic" : "As compensation, the spirits recovered " + HealedAmount + " HP to " + source.Monster.Nickname});
            
            return true;
        }
    }
}