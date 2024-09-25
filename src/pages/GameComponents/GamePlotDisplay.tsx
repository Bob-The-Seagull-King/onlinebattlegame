import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../../resources/styles/App.css';
import { useState } from "react";

import { Button } from "react-bootstrap";
import { BattleManager } from "../../classes/viewmodel/battle_manager";
import { PlaceAction, SelectedAction, TurnCharacter } from "../../global_types";
import { ActionTranslateDex } from "../../classes/tools/translator_static";
import Accordion from 'react-bootstrap/Accordion';
import { IPlot } from "../../classes/sim/models/terrain/terrain_plot";
import { GamePlot } from "../../classes/viewmodel/game_plot";

const GamePlotDisplay = (props: any) => {
    const Manager   : BattleManager = props.manager;    // The viewmodel manager object
    const Plot  : GamePlot = props.plot           // The ID val of this set of choices (used for when multiple monsters are on the field)

    const size = (Manager.CurrentScene != null)? Math.floor(45/(Manager.CurrentScene.Scene.plots.length)) : "45";
    
    const [active, setActive] = useState(Plot.IsActive);
    const [mon, setMon] = useState(Plot.CheckForMon());

    // Update the state of options to match the manager
    const receivePlots = () => {
        setMon(Plot.CheckForMon())
        setActive(Plot.IsActive);
    }

    function TrySend() {
        if (active) {
            Manager.SendOptions(Plot.TurnVal);
        }
    }

    // Assign the relevant function to the manager
    Plot.setUpdateFuncs(receivePlots)

    return (
        <div style={{minWidth:"calc("+size+"vw)",minHeight:"calc("+size+"vw)",maxWidth:"calc("+size+"vw)",maxHeight:"calc("+size+"vw)",padding:"0.5rem"}}>
            <div className={"plotbasic" + ((active)? " example-4" : "")} onClick={() => TrySend()}>
                <div className="TempMonPlotName">{mon}</div>
            </div>
        </div>
    )

}

export default GamePlotDisplay