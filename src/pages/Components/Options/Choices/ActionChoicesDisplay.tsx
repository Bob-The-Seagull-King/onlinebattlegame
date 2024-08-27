import { Button, Collapse } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction } from "../../../../global_types";
import { useState } from "react";
import { ActionInfoDex } from "../../../../data/static/action/action_inf";
import { ActiveAction } from "../../../../classes/sim/models/active_action";
import { ActionTranslateDex } from "../../../../classes/tools/translator_static";

const ActionChoicesDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Choices   : SubSelectAction = props.turns;    // The list of choices being displayed
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)

    // Determines if the item shows all possible sub items
    const [open, setOpen]   = useState(false);

    // Sends a selected objct to the viewmodel manager as the chosen action
    const SendSingleOption = (_item : SelectedAction, _pos : number) => {
        Manager.SendOptions(_item, _pos)
    }

    return (
        <div className="BaseBorder">
            <div className="row">
                <div className="col-12">
                    <Button className={"BorderlessButton SmallText"} onClick={() => setOpen(!open)}>
                        {"Perform " + ActionInfoDex[(Choices.choice as ActiveAction ).Action].name}
                    </Button>  
                </div>
            </div>
            <Collapse in={open}>
                <div>
                    {Choices.options.map(item => (
                        <div key={"action" + Choices.options.indexOf(item) + "sub" + Choices.options.indexOf(item)} style={{padding:"1em"}}>
                            <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(item, Position)}>{ActionTranslateDex['action'].selectOption(item, Manager.BattleState)}</Button>
                        </div>
                    ))}                    
                </div>
            </Collapse>
        </div>
    )

}

export default ActionChoicesDisplay