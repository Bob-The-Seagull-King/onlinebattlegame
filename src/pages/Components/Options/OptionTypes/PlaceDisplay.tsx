import { Button } from "react-bootstrap";
import { BattleManager } from "../../../../classes/viewmodel/battle_manager";
import { PlaceAction, SelectedAction, TurnCharacter } from "../../../../global_types";
import { ActionTranslateDex } from "../../../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';

const PlaceDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar = props.turn;    
    const Action : SelectedAction = props.action;

    // Sends a selected objct to the viewmodel manager as the chosen action
    const SendSingleOption = (_pos : number) => {
        Manager.SendOptions("NONE", 0, -1, _pos)
    }

    const placeName =  Manager.BattleState.sides[Manager.BattlePosition].trainers[Manager.SidePosition].team.monsters[(Action as PlaceAction).monster_id].nickname

    return (
        <div style={{marginBottom:"0.5rem"}}>
           <Button bsPrefix="TestButton SmallText" >{placeName}</Button>
        </div>
    )

}

export default PlaceDisplay