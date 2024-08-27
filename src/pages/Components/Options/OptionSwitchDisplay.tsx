import { Button } from "react-bootstrap";
import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction, SwitchAction } from "../../../global_types";
import { MessageTranslator } from "../../../classes/tools/translator";
import { ActionTranslateDex } from "../../../classes/tools/translator_static";

const OptionsSwitchDisplay = (props: any) => {
    const Manager : BattleManager = props.manager;
    const Choices : SubSelectAction[] = props.turns;
    const Position : number = props.position

    const SendSingleOption = (_item : SelectedAction, _pos : number) => {
        Manager.SendOptions(_item, _pos)
    }

    return (
        <div>
            {Choices.map(item => (
                <div key={"switch" + Choices.indexOf(item)}>
                    {item.options.map(element => (
                        <div key={"switch" + Choices.indexOf(item) + "sub" + item.options.indexOf(element)}>
                            <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(element, Position)}>{ActionTranslateDex['switch'].selectOption(element, Manager.BattleState)}</Button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )

}

export default OptionsSwitchDisplay