import { Button, Collapse } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction, SwitchAction } from "../../../../global_types";
import { MessageTranslator } from "../../../../classes/tools/translator";
import { useState } from "react";
import { ItemInfoDex } from "../../../../data/static/item/item_inf";
import { ActiveItem } from "../../../../classes/sim/models/active_item";

const ItemChoicesDisplay = (props: any) => {
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
                        {"Use " + ItemInfoDex[(Choices.choice as ActiveItem ).Item].name}
                    </Button>  
                </div>
            </div>
            <Collapse in={open}>
                <div>
                    {Choices.options.map(item => (
                        <div key={"switch" + Choices.options.indexOf(item) + "sub" + Choices.options.indexOf(item)} style={{padding:"1em"}}>
                            <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(item, Position)}>{MessageTranslator.TranslateActionItem(item)}</Button>
                        </div>
                    ))}                    
                </div>
            </Collapse>
        </div>
    )

}

export default ItemChoicesDisplay