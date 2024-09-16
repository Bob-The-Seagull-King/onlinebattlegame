import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../../resources/styles/App.css';
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';
import OptionsMonsterDisplay from '../Components/Options/OptionMonsterDisplay';

const OptionsDisplay = (props: any) => {
  const Manager : BattleManager = props.manager; // The manager running this battle
 
  // Collection of options available for the user to choose from
  const [optionsReceived, setOptionsReceived] = useState(Manager.ChoicesLog);
  
  // Update the state of options to match the manager
  const receiveOptions = () => {
    const options =  Object.assign([], Manager.ChoicesLog);
    setOptionsReceived(options);
  }

  // Assign the relevant function to the manager
  Manager.setOptionsFuncs(receiveOptions)
  
  return (
    <div>      
      <h1 className="BigText"> BATTLE OPTIONS</h1>

      <div className="BasicElementContainer overflow-auto">
        <div className='row justify-content-center'>
          <div className='col-11'>
            <div className="ForceHeight20" style={{width:"100%", justifyContent:"center"}}>
              {/** Display each suite of choices */}
              {optionsReceived.map(item => (
                <div key={"choice" + optionsReceived.indexOf(item)}>
                  <OptionsMonsterDisplay manager={Manager} turns={item.action} position={item.pos}/>
                </div> ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsDisplay;
