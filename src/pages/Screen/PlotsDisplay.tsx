import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';
import GamePlotDisplay from '../GameComponents/GamePlotDisplay';

const PlotsDisplay = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [plotsReceived, setPlotsReceived] = useState(Manager.CurrentPlots);
  const [scene, setScene] = useState(Manager.CurrentScene);
  const [key, setKey] = useState(0);
  
  // Update the state of options to match the manager
  const receivePlots = () => {
    const options =  Object.assign([], Manager.CurrentPlots);
    setPlotsReceived(options);
    const valscene = Manager.CurrentScene;
    setScene(valscene);
    setKey(key + 1);
  }

  // Assign the relevant function to the manager
  Manager.setPlotsFuncs(receivePlots)
  
  return (
    <div>
      {scene != null &&
        <div style={{minWidth:"calc(50vw)",minHeight:"calc(50vw)",maxWidth:"calc(50vw)",maxHeight:"calc(50vw)",padding:"1rem"}}>
          {plotsReceived.map(item => 
            <div className="row">
              {item.map(_plot => 
                <GamePlotDisplay key={_plot.Plot.position.toString() + key} manager={Manager} plot={_plot}/>
              )}
            </div>
          ) }
        </div>
      }
    </div>
  );
}

export default PlotsDisplay;
