
import { useState } from "react";
import Collapse from 'react-bootstrap/Collapse';

import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { TurnChoices } from "../../../global_types";

import OptionsSwitchDisplay from "./OptionSwitchDisplay";
import OptionsItemDisplay from "./OptionItemDisplay";
import OptionsActionDisplay from "./OptionActionDisplay";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faSquare, faBurst, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import OptionsNoneDisplay from "./OptionNoneDisplay";

const OptionsMonsterDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Choices   : TurnChoices = props.turns;        // The list of choices being displayed
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)

    // Determines white suite of sub options are shown to the user
    const [switchOpen, setSwitchOpen]   = useState(false);
    const [itemOpen, setItemOpen]       = useState(false);
    const [actionOpen, setActionOpen]   = useState(false);
    const [noneOpen, setNoneOpen]       = useState(false);

    // Sets the visibility of the various sub options
    function setOpen(_switch : boolean, _item : boolean, _action : boolean, _none : boolean) {
        setSwitchOpen(_switch);
        setItemOpen(_item);
        setActionOpen(_action);
        setNoneOpen(_none);
    }

    // The number of possible choice types
    const TypeCount = (Choices["SWITCH"]? 1 : 0) + (Choices["ITEM"]? 1 : 0) + (Choices["ACTION"]? 1 : 0)

    // Sets the width of the sub-option buttons based on how many sub-options exist so that they fit in a 12-wide-row
    let Width = 0;
    switch(TypeCount) {
        case 1: Width = 12; break;
        case 2: Width = 6; break;
        case 3: Width = 4; break;
        default: Width = 12;
    }

    return (
        <div>
            {/** Row of buttons to open the various sub options */}
            <div className={"row"}>
                {Choices["SWITCH"] &&
                    <div className={"col-"+Width}>
                        <Button className={"OptionButton MedText"} onClick={() => setOpen(!switchOpen, false, false, false)}>
                            <FontAwesomeIcon icon={faRotate} />
                        </Button> 
                    </div>
                }
                {Choices["ITEM"] &&
                    <div className={"col-"+Width}>
                        <Button className={"OptionButton MedText"} onClick={() => setOpen(false, !itemOpen, false, false)}>
                            <FontAwesomeIcon icon={faBoxOpen} />
                        </Button> 
                    </div>
                }    
                {Choices["ACTION"] &&
                    <div className={"col-"+Width}>
                        <Button className={"OptionButton MedText"} onClick={() => setOpen(false, false, !actionOpen, false)}>
                            <FontAwesomeIcon icon={faBurst} />
                        </Button> 
                    </div> 
                }     
                {Choices["NONE"] &&
                    <div className={"col-"+Width}>
                        <Button className={"OptionButton MedText"} onClick={() => setOpen(false, false, false, !noneOpen)}>
                            <FontAwesomeIcon icon={faSquare} />
                        </Button> 
                    </div> 
                }     
            </div>
            {/** Row providing vertical space */}
            <div className="row">  
                <div style={{marginTop:"0.5em", marginBottom:"0.5em"}}/>
            </div>
            {/** Row of buttons to see the sub option choices */}
            <div className="row">                
                <Collapse in={switchOpen}>
                    <div>
                        {Choices["SWITCH"] && 
                            <OptionsSwitchDisplay manager={Manager} turns={Choices["SWITCH"]} position={Position}/>
                        }
                    </div>
                </Collapse>          
                <Collapse in={itemOpen}>
                    <div>
                        {Choices["ITEM"] && 
                            <OptionsItemDisplay manager={Manager} turns={Choices["ITEM"]} position={Position}/>
                        }
                    </div>
                </Collapse>          
                <Collapse in={actionOpen}>
                    <div>
                        {Choices["ACTION"] && 
                            <OptionsActionDisplay manager={Manager} turns={Choices["ACTION"]} position={Position}/>
                        }
                    </div>
                </Collapse>         
                <Collapse in={noneOpen}>
                    <div>
                        {Choices["NONE"] && 
                            <OptionsNoneDisplay manager={Manager} turns={Choices["NONE"]} position={Position}/>
                        }
                    </div>
                </Collapse>
            </div>
            {/** Row providing vertical space */}
            <div className="row">  
                <div style={{marginTop:"0.5em", marginBottom:"0.5em"}}/>
            </div>
        </div>
    )

}

export default OptionsMonsterDisplay