import { Button } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { PlaceAction, SelectedAction, MoveAction, TurnCharacter, ActionAction } from "../../../../global_types";
import { ActionTranslateDex } from "../../../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';
import { ActionInfoDex } from "../../../../data/static/action/action_inf";

const ActionDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar = props.turn;    
    const Action : ActionAction = props.action;
    
    const placeName =   "Use Move " + ActionInfoDex[Manager.BattleState.sides[Manager.BattlePosition].trainers[Manager.SidePosition].team.monsters[TurnChar.pos].actions[(Action).action_id]].name

    return (
        <div style={{marginBottom:"0.5rem"}}>
           <Button bsPrefix="TestButton SmallText" onClick={() => Manager.UpdatePlotsAction(Action, Position, TurnChar)}>{placeName}</Button>
        </div>
    )

}

export default ActionDisplay