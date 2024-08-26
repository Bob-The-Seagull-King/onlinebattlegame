import { Button } from "react-bootstrap";
import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction, SwitchAction } from "../../../global_types";
import { MessageTranslator } from "../../../classes/tools/translator";

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
                            <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(element, Position)}>{MessageTranslator.TranslateActionSwitch(element)}</Button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )

}

export default OptionsSwitchDisplay