import { MessageSet } from "../../global_types";
import { IBattle } from "../sim/controller/battle";
import { ActionTranslateDex } from "./translator_static";

class MessageTranslator {

    /**
     * Take an array of message objects and return the
     * human readable string form of those messages.
     * @param _messages The array of messages
     * @param _battle The current state of the battle, to provide context
     * @returns human readable string of these messages
     */
    public static TranslateMessages(_messages : MessageSet, _battle : IBattle) : string[] {
        const MessageList : string[] = [];
        
        _messages.forEach(element => {
            Object.keys(element).forEach(item => {
                let MessageStr = ""
                if (item === 'choice') {
                    // If the message represents a User Choice
                    MessageStr = "Selected Action: "
                    if (element[item].type === 'NONE') { MessageStr     += ActionTranslateDex['none'].performedOption(element[item], _battle) }
                    if (element[item].type === 'SWITCH') { MessageStr   += ActionTranslateDex['switch'].performedOption(element[item], _battle)}
                    if (element[item].type === 'ACTION') { MessageStr   += ActionTranslateDex['action'].performedOption(element[item], _battle) }
                    if (element[item].type === 'ITEM') { MessageStr     += ActionTranslateDex['item'].performedOption(element[item], _battle) }
                } else if (item === 'generic') {
                    // If the message is a generic (human readable format) string
                    MessageStr = element[item]
                }
                MessageList.push(MessageStr);
            })
        })

        return MessageList;
    }
}

export {MessageTranslator}