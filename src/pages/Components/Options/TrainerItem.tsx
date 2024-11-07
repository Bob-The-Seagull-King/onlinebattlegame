import { Button } from "react-bootstrap";
import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { ItemAction, SelectedAction, TurnCharacter } from "../../../global_types";
import { ActionTranslateDex } from "../../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';
import PlaceDisplay from "./OptionTypes/PlaceDisplay";
import SwapDisplay from "./OptionTypes/SwapDisplay";
import MoveDisplay from "./OptionTypes/MoveDisplay";
import ItemDisplay from "./OptionTypes/ItemDisplay";
import ActionDisplay from "./OptionTypes/ActionDisplay";
import { IActiveItem } from "../../../classes/sim/models/active_item";
import { ITrainer } from "../../../classes/sim/controller/trainer/trainer_basic";
import { ItemInfoDex } from "../../../data/static/item/item_inf";

const TrainerItem = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Item      : IActiveItem = props.item;
    const Trainer   : ITrainer = props.trainer;
    const HasAction : Boolean = props.displayaction;

    
    console.log("ITEM MADE")

    // Action Information
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar  = props.turn;    
    const Action    : ItemAction = props.action;
    

    const placeName =  "Use Item " + ItemInfoDex[Item.item].name

    return (
        <div className={(HasAction)? "example-4" :""}>
            {HasAction === true &&
                <Button bsPrefix="TestButton SmallText" onClick={() => Manager.UpdatePlotsItem(Action, Position, TurnChar)}>{placeName}</Button>
            }
            {HasAction === false &&
                <Button bsPrefix="TestButton SmallText">{placeName}</Button>
            }
           
        </div>
    )

}

export default TrainerItem