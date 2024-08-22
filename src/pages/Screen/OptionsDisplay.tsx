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
    <div className="App">
      {optionsReceived.map(item => (
        <>
          <button onClick={() => SendSingleOption(item)}>{item.type}</button>
        </>
      ))
      }
    </div>
  );
}

export default OptionsDisplay;
