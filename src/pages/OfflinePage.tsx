import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import logo from '../resources/images/npm install socket.io-client.svg';
import '../resources/styles/App.css';
import * as io from "socket.io-client";
import { useEffect, useState } from "react";
import { SocketManager } from '../classes/structure/connection/SocketManager';
import { OnlineBattleManager } from '../classes/viewmodel/battle_manager_online';
import { OfflineBattleManager } from '../classes/viewmodel/battle_manager_local';
import { BattleManager } from '../classes/viewmodel/battle_manager';
import TestDisplay from './Screen/TestDisplay';

const OfflinePage = (props: any) => {

  // Messages States
  const battleManager : OfflineBattleManager = new OfflineBattleManager();
  
  // Functions
  const joinOfflineBattle = () => {
    battleManager.StartBattle();
  };
  
  // DOM Return
  return (
    <div className="App">
      <button onClick={joinOfflineBattle}> Join Offline Battle</button>
      <TestDisplay manager={battleManager}/>
    </div>
  );
}

export default OfflinePage;
