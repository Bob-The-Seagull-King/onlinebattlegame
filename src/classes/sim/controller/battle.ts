import { Console } from "console";
import { ActionBattleDex } from "../../../data/static/action/action_btl";
import { ItemBattleDex } from "../../../data/static/item/item_btl";
import { TokenMonsterBattleDex } from "../../../data/static/token/t_monster/token_monster_btl";
import { TokenTerrainBattleDex } from "../../../data/static/token/t_terrain/token_terrain_btl";
import { TraitBattleDex } from "../../../data/static/trait/trait_btl";
import { ActionAction, IDEntry, ItemAction, MessageSet, SelectedAction, SubSelectAction, SwitchAction, TurnChoices } from "../../../global_types";
import { ActiveAction } from "../models/active_action";
import { ActiveItem } from "../models/active_item";
import { ActiveMonster } from "../models/active_monster";
import { ActivePos, Team } from "../models/team";
import { Plot } from "../models/terrain/terrain_plot";
import { IScene, Scene } from "../models/terrain/terrain_scene";
import { Side } from "../models/terrain/terrain_side";
import { ITrainer, TrainerBase } from "./trainer/trainer_basic";
import { BattleManager } from "../../viewmodel/battle_manager";

interface EventHolder {
	priority: number;
    self: any;
    source: any;
	callback: any;
    fromsource: boolean;
}

interface IBattle {
    trainers: ITrainer[],
    scene: IScene
}

class Battle {
    public Trainers: TrainerBase[];
    public Scene : Scene;
    public SendMessage : any;

    constructor(_trainers : TrainerBase[], _scene : Scene, _manager : any) {
        this.Trainers = _trainers;
        this.Scene = _scene
        this.SendMessage = _manager;

        this.StartBattle();
    }

    public ConvertToInterface() {
        const _trainers : ITrainer[] = []
        this.Trainers.forEach(item => {
            _trainers.push(item.ConvertToInterface())
        })
            
        const _interface : IBattle = {
            trainers: _trainers,
            scene: this.Scene.ConvertToInterface()
        }
        return _interface;
    }

    public SendOutMessage(_messages : MessageSet) {
        this.SendMessage.ReceiveMessages(_messages);
    }

    public async StartBattle() {
        
        let cont = true;
        while(cont) {
            cont = await this.RunRound();
        }
    }

    public async RunRound() {
        const Choices : SelectedAction[] = await this.GetTurns()

        if (Choices) {
            const messages : MessageSet = [];
            Choices.forEach(element => {
                element.trainer = new TrainerBase({ team : element.trainer.Team.ConvertToInterface(), pos : element.trainer.Position, name: element.trainer.Name })
                const Message : {[id : IDEntry]: any} = { "choice" : element}
                messages.push(Message)
            })
            this.SendOutMessage(messages);
            // return true;
            return this.IsBattleAlive();
        }
    }

    public IsBattleAlive() {
        let LivingCount = 0
        
        this.Trainers.forEach(item => {
            if (this.IsAlive(item.Team)) {
                LivingCount += 1
            }
        })
        return (LivingCount > 1)
    }

    public IsAlive(_team : Team) {
        let LivingCount = 0
        _team.Monsters.forEach(item => {
            if (item.HP_Current > 0) {
                LivingCount += 1;
            }
        })
        return (LivingCount > 0);
    }

    public async GetTurns() {
        const Choices : SelectedAction[] = [];

        const TurnPromise = this.Trainers.map(async (item) => {
            if (item.Team.Leads.length > 0) {
                const LeadPromise = item.Team.Leads.map( async (element) => {
                    const Options : TurnChoices = this.GetTrainerChoices(item, element)
                    const Turn : SelectedAction = await (item.SelectChoice({ Choices: Options, Position: element.Position, Battle: this.ConvertToInterface()}, this.SendMessage))
                    if (Turn) {
                        Turn.trainer = item
                        Choices.push(Turn)
                    }
                })

                await Promise.all(LeadPromise);
            } else {
                const Turn : SelectedAction = {type: "NONE", trainer: item}
                if (Turn) {
                    Choices.push(Turn)
                }
            }

        });

        await Promise.all(TurnPromise);

        if (TurnPromise) {
            return Choices;
        }
    }

    public GetTrainerChoices(_trainer : TrainerBase, _monster : ActivePos) {
        // Simplified Trainer Info for Socket-Safe message size
        const baseTrainer = new TrainerBase({ team : _trainer.Team.ConvertToInterface(), pos : _trainer.Position, name: _trainer.Name })

        // Setup Empties
        const SwitchChoices : SubSelectAction[] = []
        const ItemChoices : SubSelectAction[] = [];
        const ActionChoices : SubSelectAction[] = [];
        const NoneActions : SelectedAction[] = [{type : "NONE", trainer : baseTrainer}];

        const _activeChoices : TurnChoices = {}

        // Gather Choices


        // Switch
        const SwitchOptions : SwitchAction[] = []
        _trainer.Team.Monsters.forEach(item => {
            let IsOut = false;
            for (let i = 0; i < _trainer.Team.Leads.length; i++) {
                if (_trainer.Team.Leads[i].Monster === item) {
                    IsOut = true;
                    break;
                }
            }
            if (IsOut === false) { SwitchOptions.push( { type: "SWITCH", trainer: baseTrainer, current: _monster, newmon: item }) }
        })
        if (SwitchOptions.length > 0) {
            SwitchChoices.push({
                type    : "SWITCH",
                trainer : baseTrainer,
                choice  : _monster,
                options : SwitchOptions
            })
        }

        // Item
        _trainer.Team.Items.forEach(item => {
            const ItemOptions : ItemAction[] = []
            this.GetTrainerItemChoices(item, _trainer, ItemOptions)
            ItemChoices.push({
                type    : "ITEM",
                trainer : baseTrainer,
                choice  : item,
                options : ItemOptions
            })
        })

        // Actions
        _monster.Monster.Actions_Current.forEach(item => {
            const ActionOptions : ActionAction[] = []
            this.GetMonsterActionChoices(item, _trainer, _monster, ActionOptions)
            ActionChoices.push({
                type    : "ACTION",
                trainer : baseTrainer,
                choice  : item,
                options : ActionOptions
            })
        })

        // Assign to choice list
        if (SwitchChoices.length > 0) { _activeChoices["SWITCH"] = SwitchChoices; }
        if (ItemChoices.length > 0) { _activeChoices["ITEM"] = ItemChoices; }
        if (ActionChoices.length > 0) { _activeChoices["ACTION"] = ActionChoices; 

        }
        if ((SwitchChoices.length <= 0) &&
            (ItemChoices.length <= 0) &&
            (ActionChoices.length <= 0)) {
            _activeChoices["NONE"] = NoneActions;
        }
        return _activeChoices
    }

    public GetMonsterActionChoices( _action : ActiveAction, _trainer : TrainerBase, _monster : ActivePos, choiceList : ActionAction[]) {
        const ActionData = ActionBattleDex[_action.Action];
        const baseTrainer = new TrainerBase({ team : _trainer.Team.ConvertToInterface(), pos : _trainer.Position, name: _trainer.Name })

        if (this.runEvent("CanUseMove", _trainer, _trainer, _monster, _monster, _action, true)) {
            if (ActionData.team_target === "SELF") {
                choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[_trainer.Position, _monster.Position]] })            
            } else if (ActionData.team_target === "ALL") {
                if (ActionData.pos_target === "ALL") {
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: []
                    })
                } else if (ActionData.pos_target === "SIDE") {
                    const SideList : number[][] = []
                    this.Scene.Sides.forEach(item => { SideList.push([item.Position]) })
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: SideList })
                } else if (ActionData.pos_target === "SINGLE") {
                    const PlotList : number[][] = []
                    this.Scene.Plots.forEach(item => {PlotList.push([item.ScenePos, item.Position]) })
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: PlotList })
                }
            } else if (ActionData.team_target === "ANY") {
                if (ActionData.pos_target === "SIDE") {
                    this.Scene.Sides.forEach(item => {
                        choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.Position]] })
                    })
                } else if (ActionData.pos_target === "SINGLE") {
                    this.Scene.Plots.forEach(item => {
                        choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.ScenePos, item.Position]] })
                    })
                }
            } else if (ActionData.team_target === "TEAM") {
                if (ActionData.pos_target === "SIDE") {
                    choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[_trainer.Position]] })
                } else if (ActionData.pos_target === "SINGLE") {
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos === _trainer.Position) {
                            choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            } else if (ActionData.team_target === "ENEMY") {
                if (ActionData.pos_target === "SIDE") {
                    this.Scene.Sides.forEach(item => {
                        if (item.Position != _trainer.Position) {
                            choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.Position]] })
                        }
                    })
                } else if (ActionData.pos_target === "SINGLE") {
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos != _trainer.Position) {
                            choiceList.push({ type: "ACTION", trainer: baseTrainer, source: _monster, action: _action, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            }
        }
    }

    public GetTrainerItemChoices(_item : ActiveItem, _trainer : TrainerBase, choiceList : ItemAction[]) {
        const ItemData = ItemBattleDex[_item.Item];
        const baseTrainer = new TrainerBase({ team : _trainer.Team.ConvertToInterface(), pos : _trainer.Position, name: _trainer.Name })

        if (this.runEvent("CanUseItem", _trainer, _trainer, null, _trainer, _item, true)) {
            if (ItemData.team_target === "ALL") {
                if (ItemData.pos_target === "ALL") {
                    choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: []
                    })
                } else if (ItemData.pos_target === "SIDE") {
                    const SideList : number[][] = []
                    this.Scene.Sides.forEach(item => {
                        SideList.push([item.Position])
                    })
                    choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: SideList })
                } else if (ItemData.pos_target === "SINGLE") {
                    const PlotList : number[][] = []
                    this.Scene.Plots.forEach(item => {
                        PlotList.push([item.ScenePos, item.Position])
                    })
                    choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: PlotList })
                }
            } else if (ItemData.team_target === "ANY") {
                if (ItemData.pos_target === "SIDE") {
                    this.Scene.Sides.forEach(item => {
                        choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.Position]] })
                    })
                } else if (ItemData.pos_target === "SINGLE") {
                    this.Scene.Plots.forEach(item => {
                        choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.ScenePos, item.Position]] })
                    })
                }
            } else if (ItemData.team_target === "ENEMY") {
                if (ItemData.pos_target === "SIDE") {
                    this.Scene.Sides.forEach(item => {
                        if (item.Position != _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.Position]] })
                        }
                    })
                } else if (ItemData.pos_target === "SINGLE") {
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos != _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            } else if (ItemData.team_target === "TEAM") {
                if (ItemData.pos_target === "SIDE") {
                    this.Scene.Sides.forEach(item => {
                        if (item.Position === _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.Position]] })
                        }
                    })
                } else if (ItemData.pos_target === "SINGLE") {
                    this.Scene.Plots.forEach(item => {
                        if (item.ScenePos === _trainer.Position) {
                            choiceList.push({ type: "ITEM", trainer: baseTrainer, item: _item, target: [[item.ScenePos, item.Position]] })
                        }
                    })
                }
            }
        }

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

export {Battle, IBattle}