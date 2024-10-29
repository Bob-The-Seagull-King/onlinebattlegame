import { Battle } from "../../../../classes/sim/controller/battle";
import { TrainerBase } from "../../../../classes/sim/controller/trainer/trainer_basic";
import { ActiveAction } from "../../../../classes/sim/models/active_action";
import { ActiveItem } from "../../../../classes/sim/models/active_item";
import { ActiveMonster } from "../../../../classes/sim/models/active_monster";
import { FieldedMonster } from "../../../../classes/sim/models/team";
import { Plot } from "../../../../classes/sim/models/terrain/terrain_plot";
import { Scene } from "../../../../classes/sim/models/terrain/terrain_scene";
import { MessageSet, TokenBattleTable } from "../../../../global_types";
import { TokenCategory } from "../../../enum/categories";

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
        }
    }
}