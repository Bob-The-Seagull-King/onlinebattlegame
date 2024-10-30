import { Battle } from "../../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../../classes/sim/models/active_action";
import { ActiveItem } from "../../../../classes/sim/models/active_item";
import { ActiveMonster } from "../../../../classes/sim/models/active_monster";
import { FieldEffect } from "../../../../classes/sim/models/Effects/field_effect";
import { WeatherEffect } from "../../../../classes/sim/models/Effects/weather_effect";
import { FieldedMonster } from "../../../../classes/sim/models/team";
import { Plot } from "../../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../../classes/sim/models/terrain/terrain_scene";
import { MessageSet, TokenBattleTable } from "../../../../global_types";
import { FieldCategory, TokenCategory } from "../../../enum/categories";
import { FieldBattleDex } from "../../field/field_btl";

/**
 * Monster Token mechanical information database
 */
export const TokenMonsterBattleDex : TokenBattleTable = {
    
    undying: {
        id          : 0,       // Numerical ID of the token
        category    : [TokenCategory.Buff, TokenCategory.Help],
        async onWhenHitZero (this : Battle, eventSource : any, source : ActiveMonster, messageList : MessageSet, fromSource : boolean) {
            source.Tokens = source.Tokens.filter( item => item != 'undying')
            source.HP_Current = 1;
            messageList.push({ "generic" : source.Nickname + " survived a brush with death!"})
        }
    },
    dizzy: {
        id          : 1,       // Numerical ID of the token
        category    : [TokenCategory.Debuff, TokenCategory.Movement, TokenCategory.Control],
        async onEndTurn(this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) {
            if (eventSource === source) {
                if (source.Monster.Trackers['dizzy']) {
                    if (source.Monster.Trackers['dizzy'] > 0) {
                        messageList.push({ "generic" : source.Monster.Nickname + " stumbled around!"})
                        source.Plot.UpdateMovePlot(source);
                        const rnmd = Math.floor(Math.random() * (Math.min(4,source.Plot.MovePlot.neighbours.length)));
                        if ((await source.Plot.MovePlot.neighbours[rnmd].IsPlaceable())) {
                            await this.Events.MoveMonster(source, source.Plot, source.Plot.MovePlot.neighbours[rnmd], source.Owner.Owner);
                        }
                        source.Monster.Trackers['dizzy'] -= 1;
                    }
                    if (source.Monster.Trackers['dizzy'] <= 0) {                        
                        messageList.push({ "generic" : source.Monster.Nickname + " stopped being DIZZY."})
                        source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'dizzy')
                        source.Monster.Trackers['dizzy'] = null;
                    }
                } else {                      
                    messageList.push({ "generic" : source.Monster.Nickname + " stopped being DIZZY."})
                    source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'dizzy')
                    source.Monster.Trackers['dizzy'] = null;                    
                }
            }
        },
        async onSwitchOutMonster(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'dizzy')
            source.Monster.Trackers['dizzy'] = null;  
        }
    },
    weakened: {
        id          : 1,       // Numerical ID of the token
        category    : [TokenCategory.Debuff, TokenCategory.Movement, TokenCategory.Control],
        async onEndTurn(this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) {
            if (eventSource === source) {
                if (source.Monster.Trackers['weakened']) {
                    if (source.Monster.Trackers['weakened'] > 0) {
                        source.Monster.Trackers['weakened'] -= 1;
                    }
                    if (source.Monster.Trackers['weakened'] <= 0) {                        
                        messageList.push({ "generic" : source.Monster.Nickname + " stopped being WEAKENED."})
                        source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'weakened')
                        source.Monster.Trackers['weakened'] = null;
                    }
                } else {                      
                    messageList.push({ "generic" : source.Monster.Nickname + " stopped being WEAKENED."})
                    source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'weakened')
                    source.Monster.Trackers['weakened'] = null;                    
                }
            }
        },
        async onGetStatFinaldh(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster, relayVar : number, trackVal : number, messageList : MessageSet, fromSource : boolean) {
            return await this.Events.GetStatValue(source, 'dl', false, false);
        }
    },
    enveloped: {
        id          : 3,       // Numerical ID of the token
        category    : [TokenCategory.Debuff, TokenCategory.Range],        
        async onModifyActionRange(this : Battle, eventSource : any, source : FieldedMonster , sourceEffect : ActiveAction, relayVar : number, messageList : MessageSet, fromSource : boolean) {
            if (relayVar > 1) {
                return Math.floor(relayVar / 2)
            } else {
                return relayVar;
            }
        },
        async onEndTurn(this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) {
            if (eventSource === source) {
                if (source.Monster.Trackers['enveloped']) {
                    if (source.Monster.Trackers['enveloped'] > 0) {
                        source.Monster.Trackers['enveloped'] -= 1;
                    }
                    if (source.Monster.Trackers['enveloped'] <= 0) {                        
                        messageList.push({ "generic" : source.Monster.Nickname + " stopped being ENVELOPED."})
                        source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'enveloped')
                        source.Monster.Trackers['enveloped'] = null;
                    }
                } else {                      
                    messageList.push({ "generic" : source.Monster.Nickname + " stopped being ENVELOPED."})
                    source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'enveloped')
                    source.Monster.Trackers['enveloped'] = null;                    
                }
            }
        }
    },
    whimsical: {
        id          : 4,       // Numerical ID of the token
        category    : [TokenCategory.Buff, TokenCategory.Defense],
        async onEndTurn(this : Battle, eventSource : any, source : FieldedMonster, messageList : MessageSet, fromSource : boolean) {
            if (eventSource === source) {
                if (source.Monster.Trackers['whimsical']) {
                    if (source.Monster.Trackers['whimsical'] > 0) {
                        source.Monster.Trackers['whimsical'] -= 1;
                    }
                    if (source.Monster.Trackers['whimsical'] <= 0) {                        
                        messageList.push({ "generic" : source.Monster.Nickname + " stopped being WHIMSICAL."})
                        source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'whimsical')
                        source.Monster.Trackers['whimsical'] = null;
                    }
                } else {                      
                    messageList.push({ "generic" : source.Monster.Nickname + " stopped being WHIMSICAL."})
                    source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'whimsical')
                    source.Monster.Trackers['whimsical'] = null;                    
                }
            }
        },        
        async onFinalDoesHit(this : Battle, eventSource : any, source : FieldedMonster, target : FieldedMonster, sourceEffect : ActiveAction, relayVar : boolean, trackVal : boolean, messageList : MessageSet, fromSource : boolean) {
            if ((relayVar === true) && (source.Owner != target.Owner)) {
                const rnmd = Math.floor(Math.random() * 4);
                return rnmd === 0;
            } else {
                return relayVar;
            }
        },
        async onSwitchOutMonster(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'whimsical')
            source.Monster.Trackers['whimsical'] = null;  
        }
    },
    tempest: {
        id          : 5,       // Numerical ID of the token
        category    : [TokenCategory.Buff, TokenCategory.Movement],
        async onSwitchOutMonster(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'tempest')
            source.Monster.Trackers['tempest'] = null;  
        },
        async onMonsterAffectedByTerrain(this : Battle, eventSource : any, source : FieldEffect, target : FieldedMonster, relayVar : boolean, messageList : MessageSet, fromSource : boolean) {
            if (FieldBattleDex[source.Field].category.includes(FieldCategory.Damage)) {
                return false;
            } else {
                return relayVar;
            }
        }
    },
    insured: {
        id          : 5,       // Numerical ID of the token
        category    : [TokenCategory.Buff, TokenCategory.Defense],        
        async onGetStatModpt(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster, relayVar : number, messageList : MessageSet, fromSource : boolean) {
            const SourceMonster = (source instanceof FieldedMonster)? source.Monster : source;
            let FinalOutput = relayVar

            if (SourceMonster.Trackers['insured']) {
                if (SourceMonster.Trackers['insured'] > 0) {
                    FinalOutput += SourceMonster.Trackers['insured'];
                    messageList.push({ "generic" : SourceMonster.Nickname + " lost some insurance."})
                    SourceMonster.Trackers['insured'] -= 1;
                }
                if (SourceMonster.Trackers['insured'] <= 0) {                        
                    messageList.push({ "generic" : SourceMonster.Nickname + " stopped being INSURED."})
                    SourceMonster.Tokens = SourceMonster.Tokens.filter(item => item != 'insured')
                    SourceMonster.Trackers['insured'] = null;
                }
            } else {                      
                messageList.push({ "generic" : SourceMonster.Nickname + " stopped being INSURED."})
                SourceMonster.Tokens = SourceMonster.Tokens.filter(item => item != 'insured')
                SourceMonster.Trackers['insured'] = null;                    
            }
            
            return FinalOutput;
        }
    },
    immunised: {
        id          : 7,       // Numerical ID of the token
        category    : [TokenCategory.Buff, TokenCategory.Defense],        
        async onGetStatFinalrs(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster, relayVar : number, trackVal : number, messageList : MessageSet, fromSource : boolean) {
            const SourceMonster = (source instanceof FieldedMonster)? source.Monster : source;
            let FinalOutput = relayVar

            if (SourceMonster.Trackers['immunised']) {
                if (SourceMonster.Trackers['immunised'] > 0) {
                    FinalOutput = (FinalOutput * (1 + (SourceMonster.Tokens.length / 10)))
                    SourceMonster.Trackers['immunised'] -= 1;
                }
                if (SourceMonster.Trackers['immunised'] <= 0) {                        
                    messageList.push({ "generic" : SourceMonster.Nickname + " stopped being IMMUNISED."})
                    SourceMonster.Tokens = SourceMonster.Tokens.filter(item => item != 'immunised')
                    SourceMonster.Trackers['immunised'] = null;
                }
            } else {                      
                messageList.push({ "generic" : SourceMonster.Nickname + " stopped being IMMUNISED."})
                SourceMonster.Tokens = SourceMonster.Tokens.filter(item => item != 'immunised')
                SourceMonster.Trackers['immunised'] = null;                    
            }
            
            return FinalOutput;
        }
    },
    branded: {
        id          : 8,       // Numerical ID of the token
        category    : [TokenCategory.Debuff, TokenCategory.Defense],
        async onSwitchOutMonster(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'tempest')
            source.Monster.Trackers['tempest'] = null;  
        },
        async onGetTypeMatchupMod(this : Battle, eventSource : any, source : FieldedMonster | ActiveMonster | Plot | WeatherEffect | FieldEffect | ActiveItem | null, target : FieldedMonster, relayVar : number, trackVal : number, messageList : MessageSet, fromSource : boolean) {
            if (relayVar > 1) {
                if (target.Monster.Trackers['branded']) {
                    if (target.Monster.Trackers['branded'] > 0) {                        
                        target.Monster.Trackers['branded'] -= 1;
                        return 1 + ((relayVar - 1) * 3)
                    }
                    if (target.Monster.Trackers['branded'] <= 0) {                        
                        messageList.push({ "generic" : target.Monster.Nickname + " stopped being BRANDED."})
                        target.Monster.Tokens = target.Monster.Tokens.filter(item => item != 'branded')
                        target.Monster.Trackers['branded'] = null;
                    }
                } else {                      
                    messageList.push({ "generic" : target.Monster.Nickname + " stopped being BRANDED."})
                    target.Monster.Tokens = target.Monster.Tokens.filter(item => item != 'branded')
                    target.Monster.Trackers['branded'] = null;                    
                }
            }
            
            return relayVar;
        }
    },
    wounded: {
        id          : 9,       // Numerical ID of the token
        category    : [TokenCategory.Debuff, TokenCategory.Movement],
        async onSwitchOutMonster(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            source.Monster.Tokens = source.Monster.Tokens.filter(item => item != 'tempest')
            source.Monster.Trackers['tempest'] = null;  
        },
        async onMonsterEndMove(this : Battle, eventSource : any, source : FieldedMonster , messageList : MessageSet, fromSource : boolean) {
            const BaseVal = await this.Events.GetStatValue(source, 'hp', false, false)
            if (BaseVal) {
                const dmg = await this.Events.DealDamage((Math.ceil(BaseVal/10)), 0, eventSource, source, true, true, true)
            }
        }
    }
}