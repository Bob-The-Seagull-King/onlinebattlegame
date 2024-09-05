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
import { ActionBattleDex } from "../action/action_btl";
import { TokenMonsterBattleDex } from "../token/t_monster/token_monster_btl";
import { TokenMonsterInfoDex } from "../token/t_monster/token_monster_inf";

/**
 * Trait mechanical information database
 */
export const TraitBattleDex : TraitBattleTable = {
    
    harshlife : {
        id          : 1,
        cost        : 20,
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
        cost        : 20,
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
        cost        : 50,
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
    },
    bullseye: {
        id          : 5,
        cost        : 20,
        category    : [TraitCategory.Damage, TraitCategory.Lucky],
        events      : {},
        onGetFinalDamageDealt(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            
            if (fromSource) {
                const chance = Math.random() * 10;

                if (chance === 0) {
                    messageList.push({ "generic" : source.Monster.Nickname + " landed a critical hit!"})
                    return relayVar * 2
                }
            }
            return relayVar;
        }
    },
    entrenched: {
        id          : 6,
        cost        : 40,
        category    : [TraitCategory.Restoration],
        events      : {},
        onRoundEnd(this: Battle, eventSource : any, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                const HealVal = Math.floor(this.Events.GetStatValue(trainer, source, "hp", messageList) * 0.1)
                messageList.push({ "generic" : source.Monster.Nickname + " absorbed nutrients from the ground."})
                this.Events.HealDamage(HealVal, 0, source, source.Monster, trainer, trainer, messageList, false, false)
            }
        }
    },
    firstdefense: {
        id          : 7,
        cost        : 15,
        category    : [TraitCategory.Armour],
        events      : {},
        onSwitchIn(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                if (!source.Monster.Tokens.includes("firstdefense")) {
                    source.Monster.Tokens.push("firstdefense");
                }
            }
        }
    },
    hotfeet: {
        id          : 8,
        cost        : 40,
        category    : [TraitCategory.Terraform, TraitCategory.Sacrifice],
        events      : {},
        onSwitchIn(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                const _plot : Plot = this.Scene.Sides[trainer.Position].Plots[source.Position];
                
                if (!_plot.Tokens.includes("hotcoal")) {
                    _plot.Tokens.push("hotcoal");
                }
            }
        }
    },
    innerfurnace: {
        id          : 9,
        cost        : 20,
        category    : [TraitCategory.Lucky, TraitCategory.Revenge, TraitCategory.Armour],
        events      : {},
        onAfterDealingDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) {
            if (!fromSource) {
                if (fromSource) {
                    const chance = Math.random() * 5;
    
                    if (chance === 0) {
                        messageList.push({ "generic" : target.Monster.Nickname + " burned " + source.Monster.Nickname + "!" })
                        if (!source.Monster.Tokens.includes("burn")) {
                            source.Monster.Tokens.push("burn");
                        }
                    }
                }
            }
        }
    },
    overgrown: {
        id          : 10,
        cost        : 25,
        category    : [TraitCategory.Damage, TraitCategory.Skill],
        events      : {},
        onGetSkillAllModifiers(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Side | Plot, source : TrainerBase | ActivePos, sourceEffect : ActiveAction, relayVar: number, trackVal: string, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (ActionBattleDex[ sourceEffect.Action ].type === MonsterType.Flowering) {
                    return Math.floor(relayVar * 0.25);
                }
            }            
            return relayVar
        },
        onGetFinalDamageDealt(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (ActionBattleDex[ sourceEffect.Action ].type === MonsterType.Flowering) {
                    return Math.floor(relayVar * 0.25);
                }
            }            
            return relayVar
        }
    },
    retreat: {
        id          : 11,
        cost        : 30,
        category    : [TraitCategory.Armour],
        events      : {}, 
        onGetProtectionModifiers(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Side | Plot, source : ActivePos, relayVar: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                if (source.Monster.HP_Current < (this.Events.GetStatValue(trainer, source, "hp", messageList) * 0.5))
                return relayVar * 2;
            }            
            return relayVar;
        },
        onAfterDealingDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) {
            if (!fromSource) {                
                if (source.Monster.HP_Current < (this.Events.GetStatValue(trainer, source, "hp", messageList) * 0.5)) {
                    messageList.push({ "generic" : source.Monster.Nickname + "Retreated into its shell." })
                }
            }
        }
    },
    sacrificialaltar: {
        id          : 12,
        cost        : 35,
        category    : [TraitCategory.Drain],
        events      : {},
        onAfterKnockOut(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | ActivePos | Scene | Side | Plot, source : ActivePos, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) {
            if (fromSource) {
                const _plot : Plot = this.Scene.Sides[trainer.Position].Plots[source.Position];
                
                if (!_plot.Tokens.includes("altar")) {
                    _plot.Tokens.push("altar");
                }
                if (_plot.Trackers["altar"]) {
                    _plot.Trackers["altar"] = _plot.Trackers["altar"] + 1;
                } else {
                    _plot.Trackers["altar"] = 1
                }
            }
        }
    },
    scaryface: {
        id          : 13,
        cost        : 50,
        category    : [TraitCategory.Debuff],
        events      : {},
        onSwitchIn(this: Battle, eventSource : Scene | Side | Plot, trainer : TrainerBase, source : ActivePos, messageList: MessageSet, fromSource: boolean) {
            if (fromSource){
                this.Trainers.forEach(item => {
                    if (item != trainer) {
                        item.Team.Leads.forEach(lead => {                            
                            messageList.push({ "generic" : lead.Monster.Nickname + " got scared!"})
                            if (!lead.Monster.Tokens.includes("boostdamage")) {
                                lead.Monster.Tokens.push("boostdamage")
                            }
                            if (lead.Monster.Trackers["boostdamage"]) {
                                lead.Monster.Trackers["boostdamage"] -= 1;
                            } else {
                                lead.Monster.Trackers["boostdamage"] = -1;
                            }
                        })
                    }
                })
            }
        }
    },
    solidcomposition: {
        id          : 15,
        cost        : 10,
        category    : [TraitCategory.Revenge, TraitCategory.Terraform],
        events      : {},
        onWhenKnockedOut(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActiveMonster | Scene | Side | Plot, source : TrainerBase, messageList: MessageSet, fromSource: boolean) {
            if (!fromSource) {
                messageList.push({ "generic" : "Pointed Stone filled " + trainerTarget.Name + "'s side of the battle!"})
                if (!this.Scene.Sides[trainer.Position].Tokens.includes('pointed')) {
                    this.Scene.Sides[trainer.Position].Tokens.push('pointed')
                }
            }
        }
    },
    thunderclap: {
        id          : 16,
        cost        : 25,
        category    : [TraitCategory.Terraform, TraitCategory.Debuff],
        events      : {}, 
        onAfterDealingDamage(this: Battle, eventSource : any, trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : ActivePos, sourceEffect : ActiveAction, trackVal: number, messageList: MessageSet, fromSource: boolean) {
            if (!fromSource) {
                messageList.push({ "generic" : target.Monster.Nickname + " shot out sparks!"})
                if (!target.Monster.Tokens.includes("lightningstorm")) {
                    target.Monster.Tokens.push("lightningstorm")
                }
                if (!target.Monster.Trackers["lightningstorm"]) {
                    target.Monster.Trackers["lightningstorm"] = 2;
                }
            }
        }
    }
}