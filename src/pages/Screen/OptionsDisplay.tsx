import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../../resources/styles/App.css';
import * as io from "socket.io-client";
import { useState } from "react";
import { BattleManager } from '../../classes/viewmodel/battle_manager';
import { SelectedAction } from '../../global_types';
import OptionsMonsterDisplay from '../Components/Options/OptionMonsterDisplay';

const OptionsDisplay = (props: any) => {
  const Manager : BattleManager = props.manager;
  // Messages States

  const [optionsReceived, setOptionsReceived] = useState(Manager.ChoicesLog);
  

  const receiveOptions = () => {
    const options =  Object.assign([], Manager.ChoicesLog);
    setOptionsReceived(options);
  }

  Manager.setOptionsFuncs(receiveOptions)
  
  // DOM Return
  return (
    <div>      
      <h1 className="BigText"> BATTLE OPTIONS</h1>
      <div className="BasicElementContainer overflow-auto">
        <div className='row justify-content-center'>
          <div className='col-11'>
            <div className="ForceHeight50" style={{width:"100%", justifyContent:"center"}}>
              {optionsReceived.map(item => (
                <div key={"choice" + optionsReceived.indexOf(item)}>
                  <OptionsMonsterDisplay manager={Manager} turns={item.action} position={item.pos}/>
                </div>
              )) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OptionsDisplay;
