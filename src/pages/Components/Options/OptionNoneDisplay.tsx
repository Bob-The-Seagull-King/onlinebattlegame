import { Button } from "react-bootstrap";
import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction } from "../../../global_types";
import { ActionTranslateDex } from "../../../classes/tools/translator_static";

const OptionsNoneDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Choices   : SubSelectAction[] = props.turns;  // The list of choices being displayed
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)

    // Sends a selected objct to the viewmodel manager as the chosen action
    const SendSingleOption = (_pos : number) => {
        Manager.SendOptions("NONE", 0, -1, _pos)
    }

    return (
        <div>
            {Choices.map(item => (
                <div key={"none" + Choices.indexOf(item)}>
                    {item.options.map(element => (
                        <div key={"none" + Choices.indexOf(item) + "sub" + item.options.indexOf(element)}>
                            <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(Position)}>{ActionTranslateDex['none'].selectOption(element, Manager.BattleState)}</Button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )

}

export default OptionsNoneDisplay