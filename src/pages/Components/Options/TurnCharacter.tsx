import { Button } from "react-bootstrap";
import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { SelectedAction, TurnCharacter } from "../../../global_types";
import { ActionTranslateDex } from "../../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';
import PlaceDisplay from "./OptionTypes/PlaceDisplay";

const TurnCharacterDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar = props.turn;

    return (
        <div>
            <Accordion>
            {
            Object.keys(TurnChar.action).map(item => 
                <Accordion.Item bsPrefix="AccordianCustom" eventKey={Object.keys(TurnChar.action).indexOf(item).toString()}>        
                    <Accordion.Header bsPrefix="AccordianCustomHeader">{item}</Accordion.Header>
                    <Accordion.Body>
                        {item === 'PLACE' &&
                        <>
                            {TurnChar.action[item].map(_subitem =>
                                <PlaceDisplay manager={Manager} position={Position} turn={TurnChar} action={_subitem}/>
                            )

                            }
                        </>}
                    </Accordion.Body>
                </Accordion.Item>
            ) }
      
            </Accordion>
           
        </div>
    )

}

export default TurnCharacterDisplay