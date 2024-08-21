import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { TokenMonsterBattleDex } from "../../../data/static/token/t_monster/token_monster_btl";
import { TokenTerrainBattleDex } from "../../../data/static/token/t_terrain/token_terrain_btl";
import { TraitBattleDex } from "../../../data/static/trait/trait_btl";
import { ActiveAction } from "../models/active_action";
import { ActiveItem } from "../models/active_item";
import { ActiveMonster } from "../models/active_monster";
import { ActivePos } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { Scene } from "../models/terrain/terrain_scene";
import { Side } from "../models/terrain/terrain_side";
import { TrainerBase } from "./trainer/trainer_basic";

interface EventHolder {
	priority: number;
    self: any;
    source: any;
	callback: any;
    fromsource: boolean;
}

class Battle {
    public Trainers: TrainerBase[];
    public Scene : Scene;

    constructor(_trainers : TrainerBase[], _scene : Scene) {
        this.Trainers = _trainers;
        this.Scene = _scene
    }

    public runEvent(
        eventid: string,
        trainer: TrainerBase, 
        targettrainer : TrainerBase,
        target?: TrainerBase | ActivePos | Plot | Side | Scene | null, 
        source?: TrainerBase | ActivePos | Plot | Side | Scene | null,
        sourceEffect?: ActiveItem | ActiveAction | null, 
        relayVar?: any, 
        trackVal?: any, 
        onEffect?: boolean, 
        fastExit?: boolean,
        // fromSource
        eventdepth?: number
    ) {

        // Gather all event functions to call
        const Events : EventHolder[] = [];

        if (target) { this.getEvents(eventid, target, Events, false) }
        if (source) { this.getEvents(eventid, source, Events, true) }
        if (sourceEffect) { this.getEvents(eventid, sourceEffect, Events, true) }

        this.getEvents(eventid, this.Scene, Events, true);
        this.getEvents(eventid, this.Scene.Sides[trainer.Position], Events, true);
        this.getEvents(eventid, this.Scene.Sides[targettrainer.Position], Events, false);
        if (source instanceof ActivePos) {
            this.getEvents(eventid, this.Scene.Sides[trainer.Position].Plots[source.Position], Events, true);
        }
        if (target instanceof ActivePos) {
            this.getEvents(eventid, this.Scene.Sides[trainer.Position].Plots[target.Position], Events, false);
        }

        let relay_variable = relayVar;
        let returnVal;

        // Run each event
        for (const _event of Events) {
            
            // Determine function arguments
            const args = [];

            let i = 0;
            if ((trainer !== undefined) && (trainer !== null)) { args[i] = trainer; i += 1; }
            if ((targettrainer !== undefined) && (targettrainer !== null)) { args[i] = targettrainer; i += 1; }
            if ((target !== undefined) && (target !== null)) { args[i] = target; i += 1; }
            if ((source !== undefined) && (source !== null)) { args[i] = source; i += 1; }
            if ((sourceEffect !== undefined) && (sourceEffect !== null)) { args[i] = sourceEffect; i += 1; }
            if ((relay_variable !== undefined) && (relay_variable !== null)) { args[i] = relay_variable; i += 1; }
            if ((trackVal !== undefined) && (trackVal !== null)) { args[i] = trackVal; i += 1; }
            if ((onEffect !== undefined) && (onEffect !== null)) { args[i] = onEffect; i += 1; }
            if ((fastExit !== undefined) && (fastExit !== null)) { args[i] = fastExit; i += 1; }
            if ((fastExit !== undefined) && (fastExit !== null)) { args[i] = fastExit; i += 1; }
            if ((_event.fromsource !== undefined) && (_event.fromsource !== null)) { args[i] = _event.fromsource; i += 1; }
            if ((eventdepth !== undefined) && (eventdepth !== null)) {
                args[i] = eventdepth;
                i += 1;
            }

            returnVal = _event.callback.apply(this, args);
            relay_variable = returnVal;
        }

        return relay_variable;
    }

    public getEvents( eventid: string, target: TrainerBase | ActivePos | ActiveItem | ActiveAction | Plot | Side | Scene, events : EventHolder[], _fromSource : boolean ) {
        if (target instanceof ActivePos) {
            let i = 0;
            for (i = 0; i < target.Monster.Tokens.length; i ++) {
                let temp_condition = TokenMonsterBattleDex[target.Monster.Tokens[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 0, self: target, source: temp_condition, callback: func, fromsource: _fromSource } )
                }
            }
            for (i = 0; i < target.Monster.Traits.length; i ++) {
                let temp_condition = TraitBattleDex[target.Monster.Traits[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 0, self: target, source: target.Monster.Traits[i], callback: func, fromsource: _fromSource } )
                }
            }
        }if ((target instanceof Scene) || (target instanceof Side) || (target instanceof Plot)) {
            let i = 0;
            for (i = 0; i < target.Tokens.length; i ++) {
                let temp_condition = TokenTerrainBattleDex[target.Tokens[i]]
                // @ts-ignore - dynamic lookup
                const func = temp_condition['on'+eventid];
                if (func !== undefined) {
                    events.push( { priority: 0, self: target, source: temp_condition, callback: func, fromsource: _fromSource } )
                }
            }
        }
        if (target instanceof ActiveAction) {
            let temp_condition = ActionBattleDex[target.Action]
            // @ts-ignore - dynamic lookup
            const func = temp_condition['on'+eventid];
            if (func !== undefined) {
                events.push( { priority: 0, self: target.Owner, source: target, callback: func, fromsource: _fromSource } )
            }     
        }
        if (target instanceof ActiveItem) {
            let temp_condition = ItemBattleDex[target.Item]
            // @ts-ignore - dynamic lookup
            const func = temp_condition['on'+eventid];
            if (func !== undefined) {
                events.push( { priority: 0, self: target, source: target, callback: func, fromsource: _fromSource } )
            }     
        }
    }
}

export {Battle}