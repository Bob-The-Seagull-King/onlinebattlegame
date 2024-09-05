import { ActionBattleTable, MessageSet } from "../../../global_types";
import { MonsterType } from "../../enum/types";
import { ActionCategory } from "../../enum/categories";
import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../classes/sim/models/active_action";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { ActivePos } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { Side } from "../../../classes/sim/models/terrain/terrain_side";

/**
 * Action mechanical information database
 */
export const ActionBattleDex : ActionBattleTable = {
    tackle : {
        id          : 0,
        type        : MonsterType.None,
        cost        : 0,
        uses        : 20,
        accuracy    : 100,
        damage_mod  : 0,
        priority    : 0,
        category    : [ActionCategory.Blunt],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {}
    },
    superhotslam : {
        id          : 1,
        type        : MonsterType.Blaze,
        cost        : 20,
        uses        : 5,
        accuracy    : 115,
        damage_mod  : 20,
        priority    : 0,
        category    : [ActionCategory.Debuff, ActionCategory.Energy],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const TriggerProtA = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 50, trainerTarget, target.Monster, 'protectionboost', messageList)
            const TriggerProtB = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 50, trainerTarget, target.Monster, 'protectionboost', messageList)
            const TriggerProtC = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 50, trainer, source.Monster, 'protectionboost', messageList)
            if (TriggerProtA) {
                messageList.push({ "generic" : target.Monster.Nickname + " was melted"})

                if (!target.Monster.Tokens.includes('boostprotection')) {
                    target.Monster.Tokens.push('boostprotection')                    
                }
                
                if (target.Monster.Trackers["boostprotection"]) {
                    target.Monster.Trackers["boostprotection"] -= 1;
                } else {
                    target.Monster.Trackers["boostprotection"] -= 1;
                }
            }
            if (TriggerProtB) {
                messageList.push({ "generic" : target.Monster.Nickname + " was melted"})

                if (!target.Monster.Tokens.includes('boostprotection')) {
                    target.Monster.Tokens.push('boostprotection')                    
                }
                
                if (target.Monster.Trackers["boostprotection"]) {
                    target.Monster.Trackers["boostprotection"] -= 1;
                } else {
                    target.Monster.Trackers["boostprotection"] -= 1;
                }
            }
            if (TriggerProtC) {
                messageList.push({ "generic" : source.Monster.Nickname + " was melted"})

                if (!source.Monster.Tokens.includes('boostprotection')) {
                    source.Monster.Tokens.push('boostprotection')                    
                }
                
                if (source.Monster.Trackers["boostprotection"]) {
                    source.Monster.Trackers["boostprotection"] -= 1;
                } else {
                    source.Monster.Trackers["boostprotection"] -= 1;
                }
            }
        }
    },
    sparkup : {
        id          : 2,
        type        : MonsterType.Blaze,
        cost        : 30,
        uses        : 15,
        accuracy    : 100,
        damage_mod  : -50,
        priority    : 1,
        category    : [ActionCategory.Debuff],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const TriggerDizzy = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 100, trainerTarget, target.Monster, 'burn', messageList)
            if (TriggerDizzy) {
                if (!target.Monster.Tokens.includes('burn')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " started burning up!"})
                    target.Monster.Tokens.push('burn')
                }
            }
        }
    },
    deeproots : {
        id          : 3,
        type        : MonsterType.Flowering,
        cost        : 35,
        uses        : 5,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Terraform, ActionCategory.Restoration],
        team_target : "TEAM",
        pos_target  : "SIDE",
        type_target : "TERRAIN",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : Side, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : "Trees grow on " + trainer.Name + "'s side of the battle!"})
            if (!target.Tokens.includes('deepforest')) {
                target.Tokens.push('deepforest')
            }
        }
    },
    aromatherapy : {
        id          : 4,
        type        : MonsterType.Flowering,
        cost        : 20,
        uses        : 15,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Boost],
        team_target : "SELF",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                messageList.push({ "generic" : target.Monster.Nickname + " stopped and smelled the flowers"})
                if (!target.Monster.Tokens.includes("boostskill")) {
                    target.Monster.Tokens.push("boostskill")
                }
                if (target.Monster.Trackers["boostskill"]) {
                    target.Monster.Trackers["boostskill"] += 1;
                } else {
                    target.Monster.Trackers["boostskill"] = 1;
                }

                if (!target.Monster.Tokens.includes("boostresistance")) {
                    target.Monster.Tokens.push("boostresistance")
                }
                if (target.Monster.Trackers["boostresistance"]) {
                    target.Monster.Trackers["boostresistance"] += 1;
                } else {
                    target.Monster.Trackers["boostresistance"] = 1;
                }
            }
        }
    },
    flytrap : {
        id          : 5,
        type        : MonsterType.Flowering,
        cost        : 30,
        uses        : 10,
        accuracy    : 90,
        damage_mod  : -40,
        priority    : 0,
        category    : [ActionCategory.Blunt, ActionCategory.Debuff, ActionCategory.Tactical],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            if (!target.Monster.Tokens.includes('trapped')) {
                messageList.push({ "generic" : target.Monster.Nickname + " was trapped!"})
                target.Monster.Tokens.push('trapped')
                
                target.Monster.Trackers["trapped"] = 4;
            }
        }
    },
    pressurecannon : {
        id          : 6,
        type        : MonsterType.Pelagic,
        cost        : 15,
        uses        : 15,
        accuracy    : 80,
        damage_mod  : 100,
        priority    : -1,
        category    : [ActionCategory.Aggressive, ActionCategory.Energy],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {}
    },
    wavecrash : {
        id          : 7,
        type        : MonsterType.Pelagic,
        cost        : 10,
        uses        : 20,
        accuracy    : 100,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Debuff, ActionCategory.Tactical],
        team_target : "ENEMY",
        pos_target  : "SIDE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const TriggerDizzy = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 40, trainerTarget, target.Monster, 'stumbling', messageList)
            if (TriggerDizzy) {
                if (!target.Monster.Tokens.includes('stumbling')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " started stumbling"})
                    target.Monster.Tokens.push('stumbling')
                    
                    target.Monster.Trackers["stumbling"] = 4;
                }
            }
        }
    },
    slam : {
        id          : 8,
        type        : MonsterType.Skirmish,
        cost        : 10,
        uses        : 15,
        accuracy    : 90,
        damage_mod  : 25,
        priority    : 0,
        category    : [ActionCategory.Blunt, ActionCategory.Aggressive],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const TriggerDizzy = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 33, trainerTarget, target.Monster, 'dizzy', messageList)
            if (TriggerDizzy) {
                if (!target.Monster.Tokens.includes('dizzy')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " got dizzy"})
                    target.Monster.Tokens.push('dizzy')
                }
            }
        }
    },
    getpumped : {
        id          : 9,
        type        : MonsterType.Skirmish,
        cost        : 5,
        uses        : 5,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Boost, ActionCategory.Aggressive],
        team_target : "SELF",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                messageList.push({ "generic" : target.Monster.Nickname + " got pumped up!"})
                if (!target.Monster.Tokens.includes("boostdamage")) {
                    target.Monster.Tokens.push("boostdamage")
                }
                if (target.Monster.Trackers["boostdamage"]) {
                    target.Monster.Trackers["boostdamage"] += 1;
                } else {
                    target.Monster.Trackers["boostdamage"] = 1;
                }
            }
        }
    },
    scatter : {
        id          : 10,
        type        : MonsterType.Stonework,
        cost        : 10,
        uses        : 5,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Terraform],
        team_target : "ENEMY",
        pos_target  : "SIDE",
        type_target : "TERRAIN",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : Side, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : "Pointed Stone filled " + trainerTarget.Name + "'s side of the battle!"})
            if (!target.Tokens.includes('pointed')) {
                target.Tokens.push('pointed')
            }
        }
    },
    rockthrow : {
        id          : 11,
        type        : MonsterType.Stonework,
        cost        : 20,
        uses        : 15,
        accuracy    : 90,
        damage_mod  : 0,
        priority    : 0,
        category    : [ActionCategory.Blunt, ActionCategory.Debuff],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const TriggerDizzy = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 100, trainerTarget, target.Monster, 'dizzy', messageList)
            if (TriggerDizzy) {
                if (!target.Monster.Tokens.includes('dizzy')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " got dizzy"})
                    target.Monster.Tokens.push('dizzy')
                }
            }
        }
    },
    nausea : {
        id          : 12,
        type        : MonsterType.Poison,
        cost        : 45,
        uses        : 5,
        accuracy    : true,
        damage_mod  : -50,
        priority    : 0,
        category    : [ActionCategory.Energy, ActionCategory.Debuff],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const TriggerIll = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 100, trainerTarget, target.Monster, 'ill', messageList)
            if (TriggerIll) {
                if (!target.Monster.Tokens.includes('ill')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " got ill"})
                    target.Monster.Tokens.push('ill')
                    target.Monster.Trackers['ill'] = 1;
                }
            }
        }
    },
    braindrain : {
        id          : 13,
        type        : MonsterType.Poison,
        cost        : 25,
        uses        : 10,
        accuracy    : 100,
        damage_mod  : -25,
        priority    : 0,
        category    : [ActionCategory.Restoration, ActionCategory.Energy],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {"drain" : 0.5}
    },
    stinger : {
        id          : 14,
        type        : MonsterType.Poison,
        cost        : 20,
        uses        : 15,
        accuracy    : 100,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Debuff],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const EffectVal = Math.floor(Math.random() * 3)
            if (EffectVal === 0) {
                if (!target.Monster.Tokens.includes('dizzy')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " got dizzy"})
                    target.Monster.Tokens.push('dizzy')
                }
            } else if (EffectVal === 1) {
                if (!target.Monster.Tokens.includes('stumbling')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " started stumbling"})
                    target.Monster.Tokens.push('stumbling')
                    
                    target.Monster.Trackers["stumbling"] = 4;
                }
            } else if (EffectVal === 2) {
                if (!target.Monster.Tokens.includes('trapped')) {                    
                    messageList.push({ "generic" : target.Monster.Nickname + " was trapped!"})
                    target.Monster.Tokens.push('trapped')
                    
                    target.Monster.Trackers["trapped"] = 4;
                }
            }
        }
    },
    stormwinds : {
        id          : 15,
        type        : MonsterType.Tempest,
        cost        : 20,
        uses        : 20,
        accuracy    : 80,
        damage_mod  : -15,
        priority    : 1,
        category    : [ActionCategory.Debuff, ActionCategory.Energy, ActionCategory.Tactical],
        team_target : "ENEMY",
        pos_target  : "SIDE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            const TriggerDizzy = this.Events.SimpleEffectTriggerCheck(trainer, source, sourceEffect, 50, trainerTarget, target.Monster, 'dizzy', messageList)
            if (TriggerDizzy) {
                if (!target.Monster.Tokens.includes('stumbling')) {
                    messageList.push({ "generic" : target.Monster.Nickname + " started stumbling"})
                    target.Monster.Tokens.push('stumbling')
                    
                    target.Monster.Trackers["stumbling"] = 4;
                }
            }
        }
    },
    raindance : {
        id          : 16,
        type        : MonsterType.Tempest,
        cost        : 15,
        uses        : 5,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Boost, ActionCategory.Terraform],
        team_target : "SELF",
        pos_target  : "SIDE",
        type_target : "TERRAIN",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : Side, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : "A storm is brewing on " + trainer.Name + "'s side of the battle!"})
            if (!target.Tokens.includes('lightningstorm')) {
                target.Tokens.push('lightningstorm')
                target.Trackers["lightningstorm"] = 6;
            }
        }
    },
    blindinglight : {
        id          : 17,
        type        : MonsterType.Gilded,
        cost        : 25,
        uses        : 10,
        accuracy    : true,
        damage_mod  : false,
        priority    : 5,
        category    : [ActionCategory.Armour],
        team_target : "SELF",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : Side, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : source.Monster.Nickname + "protected itself"})
            if (!target.Tokens.includes('protect')) {
                target.Tokens.push('protect')
            }
        }
    },
    dancinglights : {
        id          : 18,
        type        : MonsterType.Enchanted,
        cost        : 40,
        uses        : 5,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Terraform],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onRunActionEvents(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : Scene, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : "Dancing lights filled the battle!"})
            if (!target.Tokens.includes('dancinglights')) {
                target.Tokens.push('dancinglights')
            }
        }
    },
    moonbeam : {
        id          : 19,
        type        : MonsterType.Enchanted,
        cost        : 20,
        uses        : 15,
        accuracy    : 100,
        damage_mod  : 0,
        priority    : 0,
        category    : [ActionCategory.Energy, ActionCategory.Boost],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onAfterDealingDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) { 
                messageList.push({ "generic" : target.Monster.Nickname + " saw visions of Skill"})               
                if (!source.Monster.Tokens.includes('boostskill')) {
                    source.Monster.Tokens.push("boostskill");
                }
                if (source.Monster.Trackers['boostskill']) {
                    source.Monster.Trackers['boostskill'] += 1
                } else {
                    source.Monster.Trackers['boostskill'] = 1
                }
            }
        }
    },
    regrow : {
        id          : 20,
        type        : MonsterType.Bizarro,
        cost        : 25,
        uses        : 10,
        accuracy    : true,
        damage_mod  : false,
        priority    : 0,
        category    : [ActionCategory.Restoration],
        team_target : "SELF",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {'heal': true},
        onReturnHealVal(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : target.Monster.Nickname + " regrew some damaged parts!"})
            return (Math.floor(target.Monster.HP_Current * 0.5));
        }
    },
    mindread : {
        id          : 21,
        type        : MonsterType.Bizarro,
        cost        : 35,
        uses        : 15,
        accuracy    : 100,
        damage_mod  : true,
        priority    : 0,
        category    : [ActionCategory.Blunt],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onDealCustomDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target :  ActivePos, source : ActivePos, sourceEffect : ActiveAction, messageList: MessageSet, fromSource: boolean) {
            let DamageRatio = 0;

            DamageRatio += Math.abs(this.runEvent(('GetStatModdl'),trainerTarget, null, null, target.Monster, null, target.Monster.GetStatBoost('dl'), messageList))
            DamageRatio += Math.abs(this.runEvent(('GetStatModdh'),trainerTarget, null, null, target.Monster, null, target.Monster.GetStatBoost('dh'), messageList))
            DamageRatio += Math.abs(this.runEvent(('GetStatModac'),trainerTarget, null, null, target.Monster, null, target.Monster.GetStatBoost('ac'), messageList))
            DamageRatio += Math.abs(this.runEvent(('GetStatModpt'),trainerTarget, null, null, target.Monster, null, target.Monster.GetStatBoost('pt'), messageList))
            DamageRatio += Math.abs(this.runEvent(('GetStatModsk'),trainerTarget, null, null, target.Monster, null, target.Monster.GetStatBoost('sk'), messageList))
            DamageRatio += Math.abs(this.runEvent(('GetStatModrs'),trainerTarget, null, null, target.Monster, null, target.Monster.GetStatBoost('rs'), messageList))
            DamageRatio += Math.abs(this.runEvent(('GetStatModsp'),trainerTarget, null, null, target.Monster, null, target.Monster.GetStatBoost('sp'), messageList))

            const DamageValue = Math.floor((Math.max(1, DamageRatio)) * (this.Events.GetStatValue(trainerTarget, target, 'hp', messageList) / 16))
            return DamageValue;
        }
    },
    harshthenoise : {
        id          : 22,
        type        : MonsterType.Bizarro,
        cost        : 20,
        uses        : 20,
        accuracy    : 100,
        damage_mod  : -50,
        priority    : 0,
        category    : [ActionCategory.Tactical],
        team_target : "ENEMY",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onSkipDamageDealProtection(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | ActivePos | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            return true;
        }
    }
}