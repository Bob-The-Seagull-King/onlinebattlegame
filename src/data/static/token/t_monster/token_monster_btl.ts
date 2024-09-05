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
        onGetStatModac(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                return relayVar - 2;
            }            
            return relayVar;
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
        onGetStatModsp(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Tokens.includes("stumbling")) {
                    return Math.floor(relayVar - 2)
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
        onGetStatModdl(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Tokens.includes("boostdamage")) {
                    if (source.Trackers["boostdamage"]) {
                        return relayVar + (1 * source.Trackers["boostdamage"]);
                    } else {
                        source.Trackers["boostdamage"] = 1;
                        return relayVar + 1;                      
                    }
                    
                }
            }
            return relayVar;
        },
        onGetStatModdh(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Tokens.includes("boostdamage")) {
                    if (source.Trackers["boostdamage"]) {
                        return relayVar + (1 * source.Trackers["boostdamage"]);
                    } else {
                        source.Trackers["boostdamage"] = 1;
                        return relayVar + 1;                      
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
    },
    firstdefense : {
        id          : 4,
        category    : [TokenCategory.Status,TokenCategory.Boost],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "firstdefense"))                
            }
        },
        onGetStatModpt(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                return relayVar + 4;
            }            
            return relayVar;
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : source.Monster.Nickname + " dropped their defense!"})
            source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "firstdefense"))
        }
    },
    burn : {
        id          : 5,
        category    : [TokenCategory.Condition,TokenCategory.Debuff],
        onGetStatModpt(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                return relayVar - 1;
            }            
            return relayVar;
        },
    }
}