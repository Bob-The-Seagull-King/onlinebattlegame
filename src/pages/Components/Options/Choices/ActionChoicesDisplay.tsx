import { Button, Collapse } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction, SwitchAction } from "../../../../global_types";
import { MessageTranslator } from "../../../../classes/tools/translator";
import { useState } from "react";
import { ItemInfoDex } from "../../../../data/static/item/item_inf";
import { ActiveItem } from "../../../../classes/sim/models/active_item";
import { ActionInfoDex } from "../../../../data/static/action/action_inf";
import { ActiveAction } from "../../../../classes/sim/models/active_action";

const ActionChoicesDisplay = (props: any) => {
    const Manager : BattleManager = props.manager;
    const Choices : SubSelectAction = props.turns;
    const Position : number = props.position

    const [open, setOpen]   = useState(false);

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
                            <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(item, Position)}>{MessageTranslator.TranslateActionAction(item)}</Button>
                        </div>
                    ))}                    
                </div>
            </Collapse>
        </div>
    )

}

export default ActionChoicesDisplay