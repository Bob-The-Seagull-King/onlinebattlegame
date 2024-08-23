import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import '../resources/styles/App.css';
import { OnlineBattleManager } from '../classes/viewmodel/battle_manager_online';
import MessagesDisplay from './Screen/MessagesDisplay';
import OptionsDisplay from './Screen/OptionsDisplay';

const OnlinePage = (props: any) => {

  const battleManager : OnlineBattleManager = new OnlineBattleManager()

  // Functions
  const joinOnlineBattle = () => {
    battleManager.MySocket.JoinRoom();
  };
  
  // DOM Return
  return (
    <div className="App">
      <button onClick={joinOnlineBattle}> Join Online Battle</button>
      <MessagesDisplay manager={battleManager}/>
      <OptionsDisplay manager={battleManager}/>
    </div>
  );
}

export default OnlinePage;
