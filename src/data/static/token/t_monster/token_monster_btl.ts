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

/**
 * Monster Token mechanical information database
 */
export const TokenMonsterBattleDex : TokenBattleTable = {
    dizzy : {
        id          : 0,
        category    : [TokenCategory.Status,TokenCategory.Debuff],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "dizzy"))                
            }
        },        
        onGetAccuracyModifier(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | ActivePos | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                return relayVar * 0.5;
            } else {
                return relayVar
            }
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            const randomValue = Math.random() * (100);
            if (randomValue <= 50) {                
                messageList.push({ "generic" : source.Monster.Nickname + " stopped being dizzy!"})
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "dizzy"))
            }
        }
    },
    stumbling : {
        id          : 1,
        category    : [TokenCategory.Condition,TokenCategory.Debuff],
        onGetStatFinalsp(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            
            if (fromSource) {
                if (source.Tokens.includes("stumbling")) {
                    return Math.floor(relayVar * 0.5)
                }
            }
            return relayVar;
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (source.Monster.Trackers["stumbling"]) {
                source.Monster.Trackers["stumbling"] -= 1;
                if (source.Monster.Trackers["stumbling"] <= 0) {
                    source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "stumbling"))
                    delete source.Monster.Trackers["stumbling"];
                    messageList.push({ "generic" : source.Monster.Nickname + " stopped stumbling"});
                }
            } else {
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "stumbling"))
                delete source.Monster.Trackers["stumbling"];
                messageList.push({ "generic" : source.Monster.Nickname + " stopped stumbling"})
            }
        }
    },
    boostdamage : {
        id          : 2,
        category    : [TokenCategory.Boost],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "boostdamage"))
                delete source.Monster.Trackers["boostdamage"];                
            }
        },
        onGetDamageRangeModifiers(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Monster.Tokens.includes("boostdamage")) {
                    if (source.Monster.Trackers["boostdamage"]) {
                        return relayVar + (0.25 * source.Monster.Trackers["boostdamage"]);
                    } else {
                        source.Monster.Trackers["boostdamage"] = 1;
                        return relayVar + 0.25;                      
                    }
                    
                }
            }
            return relayVar;
        }
    },
    retaliation : {
        id          : 3,
        category    : [TokenCategory.Boost, TokenCategory.Revenge],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "retaliation"))
                delete source.Monster.Trackers["retaliation"];                
            }
        },
        onGetDamageRangeModifiers(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Monster.Tokens.includes("retaliation")) {
                    if (source.Monster.Trackers["retaliation"]) {
                        source.Monster.Trackers["retaliation"] -= 1;
                        if (source.Monster.Trackers["retaliation"] <= 0) {
                            source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "retaliation"))
                            delete source.Monster.Trackers["retaliation"];
                        }
                    } else {
                        source.Monster.Tokens = source.Monster.Tokens.filter(item => item != "retaliation")                        
                    }
                    messageList.push({ "generic" : source.Monster.Nickname + " took revenge!"})
                    return relayVar + 0.5;
                }
            }
            return relayVar;
        }
    }
}