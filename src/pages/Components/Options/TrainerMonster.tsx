import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BattleManager } from "../../../classes/viewmodel/battle_manager";
import { ItemAction, PlaceAction, SelectedAction, SwapAction, TurnCharacter } from "../../../global_types";
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
import { Plot } from "../../../classes/sim/models/terrain/terrain_plot";
import TextWobble from "../../SubComponents/Generics/TextWobble";
import { ActiveMonster, IActiveMonster } from "../../../classes/sim/models/active_monster";
import { SpeciesBattleDex } from "../../../data/static/species/species_btl";

const TrainerMonster = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Monster      : IActiveMonster = props.item;
    const Trainer   : ITrainer = props.trainer;
    const HasAction : Boolean = props.displayaction;

    // Action Information
    const Position  : number = props.position           // The ID val of this set of choices (used for when multiple monsters are on the field)
    const TurnChar  = props.turn;    
    const Action    : SwapAction | PlaceAction = props.action;
    

    const placeName =  Monster.nickname;

    function TryAction() {
        if (HasAction === true) {
            if (Action.type === "PLACE") {
                Manager.UpdatePlotsPlace(Action, Position, TurnChar)
            }
            if (Action.type === "SWITCH") {
                Manager.UpdatePlotsSwap(Action, Position, TurnChar)
            }
        }
    }

    return (
        <div className={"ItemPreview " + ((HasAction === true)? "ActivePreview" : "")} style={{borderRadius:"0.5rem",width:"100%",height:"100%"}}>
            
            <OverlayTrigger
                key={"Mon" + Position + "Monster" + Trainer.team.monsters.indexOf(Monster)}
                placement={'auto'}
                delay={{ show: 250, hide: 0 }}
                overlay={<Tooltip className="overcomeTooltip">
                    <div className="previewborder basebackground plottooltip" style={{ opacity: "100%" }}>
                        <div>
                            {placeName}
                        </div>
                        <div>
                            {Monster.hp_cur + "/" + SpeciesBattleDex[new ActiveMonster(Monster, null).GetSpecies()].stats.hp}
                        </div>                        
                    </div>
                </Tooltip>} >                
                <img src={require("../../../resources/assets/img_monster/000/img_000_0.png")} onClick={() => TryAction()} style={{width:"100%",height:"100%"}}/>
            </OverlayTrigger>
            
        </div>
    )
}

export default TrainerMonster