import { Button } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { PlaceAction, SelectedAction, MoveAction, TurnCharacter, ItemAction } from "../../../../global_types";
import { ActionTranslateDex } from "../../../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';
import { ItemInfoDex } from "../../../../data/static/item/item_inf";

const ItemDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar = props.turn;    
    const Action : ItemAction = props.action;

    const placeName =  "Use Item " + ItemInfoDex[Manager.BattleState.sides[Manager.BattlePosition].trainers[Manager.SidePosition].team.items[(Action).item].item].name

    return (
        <div style={{marginBottom:"0.5rem"}}>
           <Button bsPrefix="TestButton SmallText" onClick={() => Manager.UpdatePlotsItem(Action, Position, TurnChar)}>{placeName}</Button>
        </div>
    )

}

export default ItemDisplay