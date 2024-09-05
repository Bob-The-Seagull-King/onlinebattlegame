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
import { SpeciesEvolutionDex } from "../species/species_evl";

/**
 * Item mechanical information database
 */
export const ItemBattleDex : ItemBattleTable = {
    blueherb: {
        id          : 1,
        cost        : 25,
        category    : [ItemCategory.Restoration],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : trainer.Name + " restored the stats of " + target.Monster.Nickname })
            
            if (target.Monster.Trackers['boostdamage']) {
                if (target.Monster.Trackers['boostdamage'] < 0) {target.Monster.Trackers['boostdamage'] = 0}
            }
            if (target.Monster.Trackers['bootprotection']) {
                if (target.Monster.Trackers['bootprotection'] < 0) {target.Monster.Trackers['bootprotection'] = 0}
            }
            if (target.Monster.Trackers['boostaccuracy']) {
                if (target.Monster.Trackers['boostaccuracy'] < 0) {target.Monster.Trackers['boostaccuracy'] = 0}
            }
            if (target.Monster.Trackers['boostskill']) {
                if (target.Monster.Trackers['boostskill'] < 0) {target.Monster.Trackers['boostskill'] = 0}
            }
            if (target.Monster.Trackers['boostresistance']) {
                if (target.Monster.Trackers['boostresistance'] < 0) {target.Monster.Trackers['boostresistance'] = 0}
            }
            if (target.Monster.Trackers['boostspeed']) {
                if (target.Monster.Trackers['boostspeed'] < 0) {target.Monster.Trackers['boostspeed'] = 0}
            }
        }
    },
    greenherb: {
        id          : 2,
        cost        : 40,
        category    : [ItemCategory.Restoration],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : trainer.Name + " healed up " + target.Monster.Nickname })
            const RecoveryVal = Math.floor(this.Events.GetStatValue(trainer, target, 'hp', messageList) * 0.5)
            this.Events.HealDamage(RecoveryVal, MonsterType.None, eventSource, target.Monster, null, trainer, messageList, false, false)
        }
    },
    redherb: {
        id          : 3,
        cost        : 35,
        category    : [ItemCategory.Boost, ItemCategory.Debuff],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            
            messageList.push({ "generic" : target.Monster.Nickname + " went into a craze!"})
            if (!target.Monster.Tokens.includes("boostdamage")) {
                target.Monster.Tokens.push("boostdamage")
            }
            if (target.Monster.Trackers["boostdamage"]) {
                target.Monster.Trackers["boostdamage"] += 4;
            } else {
                target.Monster.Trackers["boostdamage"] = 4;
            }

            const DamageVal = Math.floor(this.Events.GetStatValue(trainer, target, 'hp', messageList) * 0.33)
            this.Events.DealDamage(DamageVal, MonsterType.None, eventSource, target.Monster, null, trainer, messageList, true, true, true)
        }
    },
    saltyberry: {
        id          : 4,
        cost        : 20,
        category    : [ItemCategory.Boost],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : target.Monster.Nickname + " had a snack!"})
            if (!target.Monster.Tokens.includes("boostresistance")) {
                target.Monster.Tokens.push("boostresistance")
            }
            if (target.Monster.Trackers["boostresistance"]) {
                target.Monster.Trackers["boostresistance"] += 2;
            } else {
                target.Monster.Trackers["boostresistance"] = 2;
            }
        }
    },
    savouryberry: {
        id          : 5,
        cost        : 20,
        category    : [ItemCategory.Boost],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : target.Monster.Nickname + " had a snack!"})
            if (!target.Monster.Tokens.includes("boostprotection")) {
                target.Monster.Tokens.push("boostprotection")
            }
            if (target.Monster.Trackers["boostprotection"]) {
                target.Monster.Trackers["boostprotection"] += 2;
            } else {
                target.Monster.Trackers["boostprotection"] = 2;
            }
        }
    },
    sourberry: {
        id          : 6,
        cost        : 20,
        category    : [ItemCategory.Boost],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : target.Monster.Nickname + " had a snack!"})
            if (!target.Monster.Tokens.includes("boostskill")) {
                target.Monster.Tokens.push("boostskill")
            }
            if (target.Monster.Trackers["boostskill"]) {
                target.Monster.Trackers["boostskill"] += 2;
            } else {
                target.Monster.Trackers["boostskill"] = 2;
            }
        }
    },
    spicyberry: {
        id          : 7,
        cost        : 20,
        category    : [ItemCategory.Boost],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : target.Monster.Nickname + " had a snack!"})
            if (!target.Monster.Tokens.includes("boostdamage")) {
                target.Monster.Tokens.push("boostdamage")
            }
            if (target.Monster.Trackers["boostdamage"]) {
                target.Monster.Trackers["boostdamage"] += 2;
            } else {
                target.Monster.Trackers["boostdamage"] = 2;
            }
        }
    },
    sweetberry: {
        id          : 8,
        cost        : 10,
        category    : [ItemCategory.Restoration],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            messageList.push({ "generic" : target.Monster.Nickname + " had a snack!"})
            if (!target.Monster.Tokens.includes("boostspeed")) {
                target.Monster.Tokens.push("boostspeed")
            }
            if (target.Monster.Trackers["boostspeed"]) {
                target.Monster.Trackers["boostspeed"] += 2;
            } else {
                target.Monster.Trackers["boostspeed"] = 2;
            }
        }
    },
    strongsoil: {
        id          : 9,
        cost        : 10,
        category    : [ItemCategory.Restoration],
        team_target : "TEAM",
        pos_target  : "SINGLE",
        type_target : "MONSTER",
        events      : {},
        onItemOnApply(this: Battle, eventSource : ActiveItem,  trainer : TrainerBase, trainerTarget : TrainerBase, target : ActivePos, source : TrainerBase, sourceEffect : ActiveItem, relayVar: boolean, messageList: MessageSet, fromSource: boolean) {
            if (SpeciesEvolutionDex[target.Monster.GetSpecies()]) {
                for (let i = 0; i < SpeciesEvolutionDex[target.Monster.GetSpecies()].evolutions.length; i++) {
                    if (SpeciesEvolutionDex[target.Monster.GetSpecies()].evolutions[i].triggeritem === "strongsoil") {
                        target.Monster.Trackers["evolution"] = SpeciesEvolutionDex[target.Monster.GetSpecies()].evolutions[i].newspecies;
                        return true;
                    }
                }
            }
            messageList.push({ "generic" : "But nothing happened!"})
        }
    }
}