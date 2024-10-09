import { Battle } from "../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveItem } from "../../../classes/sim/models/active_item";
import { ActiveMonster } from "../../../classes/sim/models/active_monster";
import { FieldEffect } from "../../../classes/sim/models/Effects/field_effect";
import { WeatherEffect } from "../../../classes/sim/models/Effects/weather_effect";
import { FieldedMonster } from "../../../classes/sim/models/team";
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../classes/sim/models/terrain/terrain_scene";
import { FieldBattleTable, MessageSet } from "../../../global_types";
import { FieldCategory, ItemCategory } from "../../enum/categories";
import { MonsterType } from "../../enum/types";
import { SpeciesEvolutionDex } from "../species/species_evl";
import { SpeciesInfoDex } from "../species/species_inf";

/**
 * Item mechanical information database
 */
export const FieldBattleDex : FieldBattleTable = {
    dangerousterrain: {
        id          : 1,    
        category    : [FieldCategory.Damage, FieldCategory.Piercing, FieldCategory.Enter],
        events      : {},
        async onMonsterEntersPlot(this : Battle, eventSource : FieldEffect, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) {
            let TypeVal = 0;
            if (eventSource.Trackers["damagetype"]) {
                TypeVal = eventSource.Trackers["damagetype"]
            } else { TypeVal = 0 }
            await this.Events.DealDamage(5, TypeVal, eventSource, source, true, false, false)

            messageList.push({ "generic" : source.Monster.Nickname + " has been damaged by the Dangerous Terrain."})
        }
    },
    harshterrain: {
        id          : 2,     
        category    : [FieldCategory.Damage, FieldCategory.Enter],
        events      : {},
        async onMonsterEntersPlot(this : Battle, eventSource : FieldEffect, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) {
            let TypeVal = 0;
            if (eventSource.Trackers["damagetype"]) {
                TypeVal = eventSource.Trackers["damagetype"]
            } else { TypeVal = 0 }

            this.Events.DealDamage(5, TypeVal, eventSource, source, false, false, false)

            messageList.push({ "generic" : source.Monster.Nickname + " has been damaged by the Harsh Terrain."})
        }
    },
    difficultterrain: {
        id          : 5,     
        category    : [FieldCategory.Impede, FieldCategory.Enter],
        events      : {},
        async onPlotEnterCost(this : Battle, eventSource : any, source : Plot, relayVar : number, messageList : MessageSet, fromSource : boolean) {
            return relayVar + 1;
        }
    },
    thickterrain: {
        id          : 3,     
        category    : [FieldCategory.Trap],
        events      : {},
        async onCanSwapOut(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | null, relayVar : boolean, messageList : MessageSet, fromSource : boolean) {
            return false;
        }
    },
    obstacle: {
        id          : 4,   
        category    : [FieldCategory.Block, FieldCategory.Object],
        events      : {},
        async onCanUsePlot(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | null, relayVar : boolean, messageList : MessageSet, fromSource : boolean) {
            return false
        }
    }
}