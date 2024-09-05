import { Battle } from "../../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../../classes/sim/models/active_action";
import { ActiveItem } from "../../../../classes/sim/models/active_item";
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
                        source.Trackers["boostdamage"] = 0;
                        return relayVar;                      
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
                        source.Trackers["boostdamage"] = 0;
                        return relayVar;                      
                    }
                    
                }
            }
            return relayVar;
        }
    },
    boostprotection : {
        id          : 2,
        category    : [TokenCategory.Boost],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "boostprotection"))
                delete source.Monster.Trackers["boostprotection"];                
            }
        },
        onGetStatModpt(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Tokens.includes("boostprotection")) {
                    if (source.Trackers["boostprotection"]) {
                        return relayVar + (1 * source.Trackers["boostprotection"]);
                    } else {
                        source.Trackers["boostprotection"] = 0;
                        return relayVar;                      
                    }                    
                }
            }
            return relayVar;
        }
    },
    boostskill : {
        id          : 2,
        category    : [TokenCategory.Boost],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "boostskill"))
                delete source.Monster.Trackers["boostskill"];                
            }
        },
        onGetStatModsk(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Tokens.includes("boostskill")) {
                    if (source.Trackers["boostskill"]) {
                        return relayVar + (1 * source.Trackers["boostskill"]);
                    } else {
                        source.Trackers["boostskill"] = 0;
                        return relayVar;                      
                    }                    
                }
            }
            return relayVar;
        }
    },
    boostspeed : {
        id          : 2,
        category    : [TokenCategory.Boost],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "boostspeed"))
                delete source.Monster.Trackers["boostspeed"];                
            }
        },
        onGetStatModsp(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Tokens.includes("boostspeed")) {
                    if (source.Trackers["boostspeed"]) {
                        return relayVar + (1 * source.Trackers["boostspeed"]);
                    } else {
                        source.Trackers["boostspeed"] = 0;
                        return relayVar;                      
                    }                    
                }
            }
            return relayVar;
        }
    },
    boostresistance : {
        id          : 2,
        category    : [TokenCategory.Boost],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "boostresistance"))
                delete source.Monster.Trackers["boostresistance"];                
            }
        },
        onGetStatModrs(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Tokens.includes("boostresistance")) {
                    if (source.Trackers["boostresistance"]) {
                        return relayVar + (1 * source.Trackers["boostresistance"]);
                    } else {
                        source.Trackers["boostresistance"] = 0;
                        return relayVar;                      
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
    },
    trapped : {
        id          : 6,
        category    : [TokenCategory.Condition,TokenCategory.Debuff],        
        onAttemptSwitch(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster, source : ActivePos, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                messageList.push({ "generic" : source.Monster.Nickname + " was trapped!"});
                return false;
            }
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (source.Monster.Trackers["trapped"]) {
                source.Monster.Trackers["trapped"] -= 1;
                if (source.Monster.Trackers["trapped"] <= 0) {
                    source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "trapped"))
                    delete source.Monster.Trackers["trapped"];
                    messageList.push({ "generic" : source.Monster.Nickname + " freed itself"});
                }
            } else {
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "trapped"))
                delete source.Monster.Trackers["trapped"];
                messageList.push({ "generic" : source.Monster.Nickname + " freed itself"})
            }
        }
    },
    ill : {
        id          : 7,
        category    : [TokenCategory.Debuff],
        onSwitchOut(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                source.Monster.Trackers["ill"] = 1;                
            }
        },
        onGetStatFinalsk(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (!source.Trackers["ill"]) {
                    source.Trackers["ill"] = 1
                }
                return Math.floor(relayVar * Math.max(0, (1 - (0.05 * source.Trackers["ill"]))))
            }
            return relayVar;
        },
        onGetStatFinalrs(this: Battle, eventSource : any, trainer : TrainerBase, source : ActiveMonster, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (!source.Trackers["ill"]) {
                    source.Trackers["ill"] = 1
                }
                return Math.floor(relayVar * Math.max(0, (1 - (0.05 * source.Trackers["ill"]))))
            }
            return relayVar;
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (source.Monster.Trackers["ill"]) {
                source.Monster.Trackers["ill"] *= 2;
            } else {
                source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "ill"))
                delete source.Monster.Trackers["ill"];
                messageList.push({ "generic" : source.Monster.Nickname + " got better!"})
            }
        }
    },
    protect : {
        id          : 8,
        category    : [TokenCategory.Condition,TokenCategory.Debuff],  
        onAttemptAction(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            if (!fromSource) {
                messageList.push({ "generic" : target.Monster.Nickname + " was protected!"});
                return false;
            }
        },
        onAttemptItem(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            if (!fromSource) {
                messageList.push({ "generic" : target.Monster.Nickname + " was protected!"});
                return false;
            }
        },
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            
            source.Monster.Tokens = source.Monster.Tokens.filter(item => !(item === "protect"))
        }
    }
}