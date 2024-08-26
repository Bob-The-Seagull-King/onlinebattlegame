import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { TurnChoices } from "../../../global_types";
import { useState } from "react";
import Collapse from 'react-bootstrap/Collapse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotate, faSquare, faBurst, faBoxOpen } from '@fortawesome/free-solid-svg-icons'
import { Button } from "react-bootstrap";
import OptionsSwitchDisplay from "./OptionSwitchDisplay";
import OptionsItemDisplay from "./OptionItemDisplay";
import OptionsActionDisplay from "./OptionActionDisplay";

const OptionsMonsterDisplay = (props: any) => {
    const Manager : BattleManager = props.manager;
    const Choices : TurnChoices = props.turns;
    const Position : number = props.position

    const [switchOpen, setSwitchOpen]   = useState(false);
    const [itemOpen, setItemOpen]       = useState(false);
    const [actionOpen, setActionOpen]   = useState(false);
    const [noneOpen, setNoneOpen]       = useState(false);

    function setOpen(_switch : boolean, _item : boolean, _action : boolean, _none : boolean) {
        setSwitchOpen(_switch);
        setItemOpen(_item);
        setActionOpen(_action);
        setNoneOpen(_none);
    }

    const TypeCount = (Choices["SWITCH"]? 1 : 0) + (Choices["ITEM"]? 1 : 0) + (Choices["ACTION"]? 1 : 0)
    let Width = 0;
    switch(TypeCount) {
        case 1: Width = 12; break;
        case 2: Width = 6; break;
        case 3: Width = 4; break;
        default: Width = 12;
    }

    return (
        <div>
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
            <div className="row">  
                <div style={{marginTop:"0.5em", marginBottom:"0.5em"}}/>
            </div>
            <div className="row">                
                <Collapse in={switchOpen}>
                    <div>
                        <OptionsSwitchDisplay manager={Manager} turns={Choices["SWITCH"]} position={Position}/>
                    </div>
                </Collapse>          
                <Collapse in={itemOpen}>
                    <div>
                        <OptionsItemDisplay manager={Manager} turns={Choices["ITEM"]} position={Position}/>
                    </div>
                </Collapse>          
                <Collapse in={actionOpen}>
                    <div>
                        <OptionsActionDisplay manager={Manager} turns={Choices["ACTION"]} position={Position}/>
                    </div>
                </Collapse>         
                <Collapse in={noneOpen}>
                    <div>
                        None
                    </div>
                </Collapse>
            </div>
        </div>
    )

}

export default OptionsMonsterDisplay