import { ActionInfoDex } from "../../data/static/action/action_inf";
import { ItemInfoDex } from "../../data/static/item/item_inf";
import { ActionAction, ItemAction, MessageSet, SelectedAction, SwitchAction } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { ActionTranslateDex } from "./translator_static";

class MessageTranslator {

    public static TranslateMessages(_messages : MessageSet, _battle : IBattle) : string[] {
        const MessageList : string[] = [];
        
        _messages.forEach(element => {
            Object.keys(element).forEach(item => {
                let MessageStr = ""
                if (item === 'choice') {
                    MessageStr = "Selected Action: "
                    if (element[item].type === 'NONE') { MessageStr     += ActionTranslateDex['none'].performedOption(element[item], _battle) }
                    if (element[item].type === 'SWITCH') { MessageStr   += ActionTranslateDex['switch'].performedOption(element[item], _battle)}
                    if (element[item].type === 'ACTION') { MessageStr   += ActionTranslateDex['action'].performedOption(element[item], _battle) }
                    if (element[item].type === 'ITEM') { MessageStr     += ActionTranslateDex['item'].performedOption(element[item], _battle) }
                } else if (item === 'generic') {
                    MessageStr = element[item]
                }
                MessageList.push(MessageStr);
            })
        })

        return MessageList;
    }
}

export {MessageTranslator}