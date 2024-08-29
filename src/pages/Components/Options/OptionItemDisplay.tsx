import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { SubSelectAction } from "../../../global_types";
import ItemChoicesDisplay from "./Choices/ItemChoicesDisplay";

const OptionsItemDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Choices   : SubSelectAction[] = props.turns;  // The list of choices being displayed
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    
    return (
        <div>
            {Choices.map(item => (
                <div key={"item" + Choices.indexOf(item)}>
                    <ItemChoicesDisplay manager={Manager} turns={item} indexval={Choices.indexOf(item)} position={Position}/>
                </div>
            ))}            
        </div>
    )

}

export default OptionsItemDisplay