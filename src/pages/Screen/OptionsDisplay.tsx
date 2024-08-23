import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import logo from '../resources/images/npm install socket.io-client.svg';
import '../../resources/styles/App.css';
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import { SocketManager } from '../../classes/structure/connection/SocketManager';
import { OnlineBattleManager } from '../../classes/viewmodel/battle_manager_online';
import { OfflineBattleManager } from '../../classes/viewmodel/battle_manager_local';
import { BattleManager } from '../../classes/viewmodel/battle_manager';
import { SelectedAction, TurnChoices } from '../../global_types';
import Button from 'react-bootstrap/Button';

const OptionsDisplay = (props: any) => {
  const Manager : BattleManager = props.manager;
  // Messages States

  const [optionsReceived, setOptionsReceived] = useState([]);
  

  const receiveOptions = (data : TurnChoices) => {
    const options : SelectedAction[] = []
    Object.keys(data).forEach(item =>  {
      data[item].forEach(element => {
        options.push(element)
      })
    })
    setOptionsReceived(options);
  }

  Manager.setOptionsFuncs(receiveOptions)

  const SendSingleOption = (_item : SelectedAction) => {
    Manager.SendOptions(_item)
  }
  
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
                  <Button bsPrefix="OptionButton SmallText" onClick={() => SendSingleOption(item)}>{item.type}</Button>
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
