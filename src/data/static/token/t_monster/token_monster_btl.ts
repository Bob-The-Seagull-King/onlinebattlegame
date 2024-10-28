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
    }
}