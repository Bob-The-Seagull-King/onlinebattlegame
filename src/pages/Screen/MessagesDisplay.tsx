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

const MessagesDisplay = (props: any) => {
  const Manager : BattleManager = props.manager;
  // Messages States
  const [messageReceived, setMessageReceived] = useState("");
  
  const receiveMessage = (data : string) => {
    setMessageReceived(messageReceived + "\n" + data);
  }
  
  Manager.setResultFuncs(receiveMessage)
  
  // DOM Return
  return (
    <div className="App">
      <h1> Message:</h1>
      <div style={{whiteSpace: "pre-line"}} >{messageReceived}</div>
    </div>
  );
}

export default MessagesDisplay;
