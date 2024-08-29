import { Button, Collapse } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction } from "../../../../global_types";
import { useState } from "react";
import { ItemInfoDex } from "../../../../data/static/item/item_inf";
import { ActiveItem } from "../../../../classes/sim/models/active_item";
import { ActionTranslateDex } from "../../../../classes/tools/translator_static";

const ItemChoicesDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Choices   : SubSelectAction = props.turns;    // The list of choices being displayed
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const IndexVal  : number = props.indexval           // The position of this selected action in the battle's array

    // Determines if the item shows all possible sub items
    const [open, setOpen]   = useState(false);

    // Sends a selected objct to the viewmodel manager as the chosen action
    const SendSingleOption = (_item : number, _pos : number) => {
        Manager.SendOptions("ITEM", IndexVal, _item, _pos)
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
                            <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(Choices.options.indexOf(item), Position)}>{ActionTranslateDex['item'].selectOption(item, Manager.BattleState)}</Button>
                        </div>
                    ))}                    
                </div>
            </Collapse>
        </div>
    )

}

export default ItemChoicesDisplay