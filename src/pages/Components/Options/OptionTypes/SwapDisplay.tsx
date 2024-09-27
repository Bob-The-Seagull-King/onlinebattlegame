import { Button } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { PlaceAction, SelectedAction, TurnCharacter } from "../../../../global_types";
import { ActionTranslateDex } from "../../../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';

const SwapDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar = props.turn;    
    const Action : PlaceAction = props.action;

    const placeName =  Manager.BattleState.sides[Manager.BattlePosition].trainers[Manager.SidePosition].team.monsters[(Action as PlaceAction).monster_id].nickname

    return (
        <div style={{marginBottom:"0.5rem"}}>
           <Button bsPrefix="TestButton SmallText" onClick={() => Manager.UpdatePlotsSwap(Action, Position, TurnChar)}>{placeName}</Button>
        </div>
    )

}

export default SwapDisplay