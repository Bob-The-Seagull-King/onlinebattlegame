import { Button, Collapse } from "react-bootstrap";
import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { SelectedAction, SubSelectAction, SwitchAction } from "../../../global_types";
import { MessageTranslator } from "../../../classes/tools/translator";
import ItemChoicesDisplay from "./Choices/ItemChoicesDisplay";

const OptionsItemDisplay = (props: any) => {
    const Manager : BattleManager = props.manager;
    const Choices : SubSelectAction[] = props.turns;
    const Position : number = props.position
    
    return (
        <div>
            {Choices.map(item => (
                <div key={"item" + Choices.indexOf(item)}>
                    <ItemChoicesDisplay manager={Manager} turns={item} position={Position}/>
                </div>
            ))}            
        </div>
    )

}

export default OptionsItemDisplay