import { ActionInfoDex } from "../../data/static/action/action_inf";
import { ItemInfoDex } from "../../data/static/item/item_inf";
import { ActionAction, ItemAction, MessageSet, SelectedAction, SwitchAction } from "../../global_types";

class MessageTranslator {

    public static TranslateMessages(_messages : MessageSet) : string[] {
        const MessageList : string[] = [];
        
        _messages.forEach(element => {
            Object.keys(element).forEach(item => {
                let MessageStr = ""
                if (item === 'choice') {
                    MessageStr = "Selected Action: "
                    if (element[item].type === 'NONE') { MessageStr     += MessageTranslator.TranslateActionNothing(element[item]) }
                    if (element[item].type === 'SWITCH') { MessageStr   += MessageTranslator.TranslateActionSwitch(element[item])}
                    if (element[item].type === 'ACTION') { MessageStr   += MessageTranslator.TranslateActionAction(element[item]) }
                    if (element[item].type === 'ITEM') { MessageStr     += MessageTranslator.TranslateActionItem(element[item]) }
                } else if (item === 'generic') {
                    MessageStr = element[item]
                }
                MessageList.push(MessageStr);
            })
        })

        return MessageList;
    }

    public static TranslateActionSwitch(_switch : SwitchAction) {
        return "Trainer " + _switch.trainer.Name +  " Switched " + _switch.current.Monster.Nickname + " for " + _switch.newmon.Nickname ;
    }

    public static TranslateActionAction(_switch : ActionAction) {
        return "Trainer " + _switch.trainer.Name +  " Had " + _switch.source.Monster.Nickname + " Use " + ActionInfoDex[_switch.action.Action].name ;
    }

    public static TranslateActionItem(_switch : ItemAction) {
        return "Trainer " + _switch.trainer.Name +  " Used " + ItemInfoDex[_switch.item.Item].name ;
    }

    public static TranslateActionNothing(_switch : SelectedAction) {
        return "Trainer " + _switch.trainer.Name +  " Did Nothing" ;
    }
}

export {MessageTranslator}