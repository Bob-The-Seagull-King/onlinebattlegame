import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';

const PlotsDisplay = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [plotsReceived, setPlotsReceived] = useState(Manager.BattleState);
  
  // Update the state of options to match the manager
  const receivePlots = () => {
    const options =  Object.assign([], Manager.BattleState);
    setPlotsReceived(options);
  }

  // Assign the relevant function to the manager
  Manager.setPlotsFuncs(receivePlots)
  
  return (
    <div>      

      <div className="">
        <div className='row justify-content-center'>
          <div className='col-12'>
            <div className="" style={{width:"100%", justifyContent:"center"}}>
              {plotsReceived.scene.plots.map(item => 
                <div className="row  gx-5 justify-content-center" style={{height:"5em"}}>
                  {item.map(plot => 
                    <div style={{width:"5em"}} className={"plotboxtest col-"+(Math.floor(12/item.length))}>
                      {plot.position}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlotsDisplay;
