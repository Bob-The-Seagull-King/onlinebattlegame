import { Button } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { PlaceAction, SelectedAction, MoveAction, TurnCharacter } from "../../../../global_types";
import { ActionTranslateDex } from "../../../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';

const MoveDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar = props.turn;    
    const Action : MoveAction = props.action;

    const placeName =  "Make A Move"

    return (
        <div style={{marginBottom:"0.5rem"}}>
           <Button bsPrefix="TestButton SmallText" onClick={() => Manager.UpdatePlotsMove(Action, Position, TurnChar)}>{placeName}</Button>
        </div>
    )

}

export default MoveDisplay